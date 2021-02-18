import { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";

const configuration: Configuration = {
  mode: "production",

  entry: "./src/server.ts",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "awesome-typescript-loader",
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  target: "node",

  externals: [nodeExternals()],
};

export default configuration;
