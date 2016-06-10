const webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
  entry: [path.join(__dirname, '/app.js')],
  resolve: {
    //When require, do not have to add these extensions to file's name
    extensions: ["", ".js"],
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Render source-map file for final build
  devtool: 'source-map',
  //output config
  output: {
    path: "./build",    //Path of output file
    filename: 'paybook.js',  //Name of output file
  },
  plugins: [
    //Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false,
      },
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Transfer Files
    /*new TransferWebpackPlugin([
      {from: 'front/static'},
    ], path.resolve(__dirname,"./")),*/
  ],
  module: {
    loaders: [
      {
        test: /\.js$/, // All .js files
        loaders: ['babel-loader'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
    ],
  },
  noParse: ["ws"],
   externals:["ws"],
  //Eslint config
  eslint: {
    configFile: '.eslintrc', //Rules for eslint
  }
  /*
  target: 'node', // in order to ignore built-in modules like path, fs, etc. 
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 
  */

};



module.exports = config;
