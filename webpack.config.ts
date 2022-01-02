import TerserPlugin from "terser-webpack-plugin";
import { TsconfigPathsPlugin as TsConfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";

const configuration: Configuration = {
  mode: "production",

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ terserOptions: { mangle: false } })],
  },

  entry: "./src/server.ts",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsConfigPathsPlugin()],
  },

  target: "node",

  externals: [nodeExternals()],
};

export default configuration;
