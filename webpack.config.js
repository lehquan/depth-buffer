const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** Make random hash string **/
function makeHashString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  mode: "development",
  name: "depth-buffer",
  entry: {
    app: ["./src/index.js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "esbuild-loader",
        options: {
          target: "es2015",
        },
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
      {
        type: "javascript/auto",
        test: /\.(glb|png|svg|jpe?g|gif|hdr|json|mp3|ogg|mov|woff|woff2|eot|ttf|otf|mp4|webm|ico)$/,
        loader: "file-loader",
        options: {
          outputPath: "assets/",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "dist", "index.html"),
      inject: true,
      hash: true,
      templateParameters: { hash: makeHashString(20).toLocaleLowerCase() },
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/draco/", to: "draco/" },
        { from: "src/assets/", to: "assets/" },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: "0.0.0.0", // Open every network Access.
    port: 8082,
    historyApiFallback: false,
  },
};
