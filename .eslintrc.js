module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
    'prettier',
  ],
  rules: {
    'no-prototype-builtins': 'off',
    'vue/no-mutating-props': 'off',
    'array-callback-return': 'off',
    'new-cap': 'off',
    'vue/no-v-html': 'off',
    'no-useless-constructor': 'off',
    'no-new': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/html-indent': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'vue/multi-word-component-names': 'off',
  },
  globals: {
    window: true,
  },
}
