module.exports = {
	"env": {
		"browser": true,
		"jest": true, 
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended"
	],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly",
		"module": false
	},
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 2020,
		"sourceType": "module",
		"project": "./tsconfig.json"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"error",
			4
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": ["error", {
			"args": "none"
		}],
		"no-loss-of-precision": "off",
		"no-nonoctal-decimal-escape": "off",
		"no-unsafe-optional-chaining": "off",
		"no-useless-backreference": "off"
	}
};