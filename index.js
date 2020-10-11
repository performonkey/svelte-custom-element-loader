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
		...getOptions(this),
	};

	const props = Array.from(source.matchAll(/let { (\w+).* } = \$\$props;/g))
		.map(x => x[1])
		.filter(Boolean);
	const main = source.match(/export default ([^;]+);/);
	if (main) {
		source += `\nimport registerCustomElement from "${helperPath}";`
			+ `\nregisterCustomElement("${options.prefix}-${camelToDash(main[1])}", ${main[1]}, ${JSON.stringify(props)})`;
	}

	return source;
}