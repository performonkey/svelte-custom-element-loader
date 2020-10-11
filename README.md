# svelte-custom-element-loader

auto register svelte component as custom element (not attach to shadow dom).

## Getting Started

To begin, you'll need to install `svelte-custom-element-loader`:

```console
$ npm install svelte-custom-element-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

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
  },
};
```

and then you can use `<my-button></my-button>`

## Options

### `prefix`

Type: `String`

Default: `my`

custom-element name prefix
