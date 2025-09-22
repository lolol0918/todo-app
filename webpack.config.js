const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: "./dist",                 // serve dist
    hot: true,                        // enable hot module replacement (HMR)
    watchFiles: ["./src/**/*"],       // watch changes in src folder
    open: true,                       // auto-open browser
    port: 8080,
  },
  mode: "development",
};
