module.exports = {
  plugins: [require("prettier-plugin-svelte"), require("prettier-plugin-tailwindcss")],
  trailingComma: "none",
  printWidth: 120,
  pluginSearchDirs: false,
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }]
};
