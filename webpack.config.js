const webpack = require("webpack");
const path = require("path");
const DtsBundleWebpack = require("dts-bundle-webpack");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const config = {
  entry: { index: "./src/index.ts", react: "./src/react/index.ts" ,ddd: "./src/ddd/index.ts"},
  output: {
    path: path.resolve(__dirname, "dist"),
    //filename: "[main].js",
    chunkFilename: "[main].js",
    library: ["ReactNativeDomainEvent", "[main]"],
    libraryTarget: "umd",
    globalObject: "this",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DtsBundleWebpack({
      name: "ReactNativeDomainEvent",
      main: "dist/src/type.d.ts",
      out: "../index.d.ts",
      removeSource: true,
      outputAsModuleFolder: true,
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: "./package.json",
    //       to: "./package.json",
    //     },
    //     {
    //       from: "./docs",
    //       to: "./docs",
    //     },
    //   ],
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",

        exclude: ["/node_modules/", "/exemple/", "/srcNew/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devtool: "source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: "async",
      minChunks: 1,
      minSize: 30000,
    },
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  mode: "development",
  externals: {
    react: 'react'
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
