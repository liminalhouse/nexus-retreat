// Override @sanity/prettier-config to exclude buggy oxc plugin
module.exports = {
  semi: false,
  singleQuote: true,
  bracketSpacing: false,
  printWidth: 100,
  plugins: ['prettier-plugin-packagejson'],
}
