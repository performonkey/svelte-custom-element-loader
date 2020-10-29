# svelte-custom-element-loader

auto register svelte component as custom element (not attach to shadow dom).

## Getting Started

To begin, you'll need to install `svelte-custom-element-loader`:

```console
$ npm install svelte-custom-element-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

```html
<script>
	export _customElementTagName_ = 'my-button';
</script>

<button>test</button>
```

```js
import './Button.svelte';
```

Then add the loader to your `webpack` config. For example:

```js
// webpack.config.js
module.exports = {
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: [
					{
						loader: 'svelte-custom-element-loader',
						options: {
							prefix: 'my',
						}
					},
					{
						loader: 'svelte-loader',
						options: {
							emitCss: true,
							hotReload: process.env.NODE_ENV === 'development'
						}
					},
				]
			},
		],
	}
};
```

and then you can use `<my-button></my-button>`

## Options

### `prefix`

Type: `String`

Default: `my`

custom-element name prefix, only work with `registerAllFile` is `true`

### `registerAllFile`

Type: `Boolean`

Default: `false`

register all imported svelte file as custom element.

## Slot

```
<my-container>
	<div slot="a">dsad</div>
	<div slot="b">dsad</div>
	<div>default slot only have one Elment</div>
</my-container>
```

## JSON attribute

Attribute name starts with `json-` will auto parse to without prefix prop
```
<my-element json-data="{\"name\": \"value"}" />
// will pass JSON.parse(json-data) to data
```