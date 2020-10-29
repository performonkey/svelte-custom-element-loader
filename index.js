const { getOptions } = require('loader-utils');
const { name } = require('./package.json');

const helperPath = require.resolve(`${name}/connect`);

function camelToDash(str) {
	return str.replace(
		/[A-Z]/g,
		(x, i) => i === 0 ? x.toLowerCase() : `-${x.toLowerCase()}`
	);
}

module.exports = function loader(source) {
	const options = {
		prefix: 'my',
		registerAllFile: false,
		...getOptions(this),
	};

	let tagName = source.match(/const _customElemenTagName_ = "([a-z][a-z0-9-]+)"/);
	tagName = tagName && tagName[1];

	let tagName;
	if (!options.registerAllFile) {
		tagName = source.match(/const _customElemenTagName_ = "([a-z][a-z0-9-]+)"/);
		tagName = tagName && tagName[1];
	} else {
		tagName = source.match(/export default ([^;]+);/);
		tagName = tagName ? tagName[1] : '';
		tagName = `${options.prefix}-${tagName[0].toUpperCase() + tagName.slice(1)}`;
	}

	if (tagName) {
		const props = Array.from(source.matchAll(/let { (\w+).* } = \$\$props;/g))
			.map(x => x[1])
			.filter(Boolean);
		source += `\nimport registerCustomElement from "${helperPath}";`
			+ `\nregisterCustomElement("${camelToDash(main[1])}", ${main[1]}, ${JSON.stringify(props)})`;
	}

	return source;
}