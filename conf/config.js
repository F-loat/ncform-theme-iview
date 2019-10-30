/**
 * Created by daniel on 16/9/6.
 */

const path = require("path");

const root = process.cwd();

const env = process.env.NODE_ENV;

module.exports = {
  root,
  src: path.join(root, "src"),
  dist: path.join(root, env === "production" ? "dist" : "examples/dist"),
  babelModules: ["lodash-es"].map(item => path.join(root, "node_modules", item))
};
