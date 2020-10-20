import { detach, insert, noop } from 'svelte/internal';

function createSlots(slots) {
    const svelteSlots = {};

    for (const slotName in slots) {
        svelteSlots[slotName] = [createSlotFn(slots[slotName])];
    }

    function createSlotFn(element) {
        return function() {
            return {
                c: noop,

                m: function mount(target, anchor) {
                    insert(target, element, anchor);
                },

                d: function destroy(detaching) {
                    if (detaching) {
                        detach(element);
                    }
                },

                l: noop,
            };
        }
    }

    return svelteSlots;
}

/**
 * Connect Web Component attributes to Svelte Component properties
 * @param {string} name Name of the Web Component
 * @param {*} Component Svelte Component
 * @param {string[]} attributes Which attributes will be passed as properties
 */
export default function connect(name, Component, attributes = []) {
    return customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            this.component = undefined;
        }

        static get observedAttributes() {
            return attributes;
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (this.component && oldValue !== newValue) {
                let attrName = name.startsWith('json-') ? name.replace(/^json-/, '') : name;
                this.component.$set({ [attrName]: newValue });
            }
        }

        connectedCallback() {
            let props = {};

            for (const attr of attributes) {
                props[attr] = this.getAttrWithJson(attr) || undefined;
            }

            if (this.childNodes.length) {
                props.$$slots = createSlots(
                    Array.from(this.childNodes).reduce((obj, node) => {
                        obj[node.getAttribute && node.getAttribute('slot') || 'default'] = node.cloneNode(true);
                        node.remove();
                        return obj;
                    }, {})
                );
                props.$$scope = {};
            }

            this.component = new Component({
                target: this,
                props,
            });
        }

        getAttrWithJson(name) {
            let attr = this.getAttribute(name);
            if (attr) return attr;

            attr = this.getAttribute(`json-${name}`);
            if (attr) {
                try {
                    attr = JSON.parse(attr);
                } catch(error) {}
            }

            return attr;
        }
    });
}