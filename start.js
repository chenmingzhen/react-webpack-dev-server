//const got = require("got");
const request=require("request")
const Koa = require("koa");
const Router = require("koa-router");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const ejs = require("ejs");

const webpackConfig = {
  entry: {
    app: "./index.js",
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, //这个文件夹除外
        loader: "babel-loader",
      },
    ],
  },
  output: {
    filename: "[name].js",
    publicPath: `http://localhost:3000/`,
  },
};

new WebpackDevServer(webpack(webpackConfig),{hot:false}).listen(
  3001,
  "localhost",
  (err) => {
    console.log(err);
  }
);

const app = new Koa();
const router = new Router();

router.get("/*.*", async (ctx, next) => {
  let url = ctx.url.split("/");
  url = url[url.length - 1];
  const options = {
    url: `http://localhost:3001/${url}`,
    method: "GET",
  };
  console.log(ctx.url, options);
  /* await got(options.url).then((data) => {
    console.log(data);
    ctx.body = data.body;
  }); */
  ctx.body=request(options)
});

router.get("/*", async (ctx) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.body = await ejs.renderFile(`./index.html`, {
    scripts: ["app.js"],
  });
});

app.use(router.routes());

app.listen(3000, () => {
  console.log(`server running on http://localhost:3000`);
});
