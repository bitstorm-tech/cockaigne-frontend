module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {},
  plugins: [require("daisyui")],
  future: {
    hoverOnlyWhenSupported: true
  },
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-300": "#1b2123",
          "base-100": "#1b2123",
          primary: "#2c363a",
          "--btn-text-case": "normal",
          warning: "#751b37"
        }
      }
    ]
  }
};
