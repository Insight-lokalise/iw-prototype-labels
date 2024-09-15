module.exports = {
  extends: ['react-app', 'airbnb', 'prettier'],
  plugins: ['react'],
  env: {
    jest: true,
    browser: true,
    es6: true,
  },
  globals: {
    ReactDOM: true,
    React: true,
  },
  rules: {
    camelcase: 'off',
    'import/no-extraneous-dependencies': 'off',
    'linebreak-style': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-use-before-define': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',

    // delete to enable later
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/alt-text': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/aria-activedescendant-has-tabindex': 'off',
    'jsx-a11y/aria-props': 'off',
    'jsx-a11y/aria-proptypes': 'off',
    'jsx-a11y/aria-role': 'off',
    'jsx-a11y/aria-unsupported-elements': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'jsx-a11y/html-has-lang': 'off',
    'jsx-a11y/iframe-has-title': 'off',
    'jsx-a11y/img-redundant-alt': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/lan': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-access-key': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/no-distracting-elements': 'off',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/no-onchange': 'off',
    'jsx-a11y/no-redundant-roles': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/role-has-required-aria-props': 'off',
    'jsx-a11y/role-supports-aria-props': 'off',
    'jsx-a11y/scop': 'off',
    'jsx-a11y/tabindex-no-positive': 'off',
  },
}