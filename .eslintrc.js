module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        // "plugin:vue/essential",
        'eslint:recommended'
    ],
    parserOptions: {
        // parser: 'babel-eslint'
			"ecmaVersion": 7,
    	"sourceType": "module"
    },
    rules: {}
}
