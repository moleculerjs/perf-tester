module.exports = {
	env: {
		node: true,
		commonjs: true,
		es6: true,
		jquery: false,
		jest: true,
		jasmine: true
	},
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2018
	},
	rules: {
		"no-var": ["error"],
		"no-unused-vars": ["warn"],
		"no-trailing-spaces": ["error"]
	}
};
