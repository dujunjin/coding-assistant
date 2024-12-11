const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: './.env' });

module.exports = {
  devtool: 'source-map',  // 启用 source map
  // 定义入口文件
  entry: {
    contentScript: './src/content/contentScript.js',  // 内容脚本的入口文件
    background: './src/background/background.js',  // 后台服务脚本入口文件
    sidepanel: './src/sidepanel/sidepanel.jsx',  // 侧边栏React组件的入口文件
  },
  // 输出打包文件
  output: {
    filename: '[name].bundle.js',  // 使用[name]作为文件名标识符
    path: path.resolve(__dirname, 'dist'),  // 打包文件输出到dist目录
  },
  module: {
    rules: [
      {
        // 处理JS和JSX文件
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],  // 使用Babel处理React和ES6+
          },
        },
      },
      {
        // 处理CSS文件
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],  // 将CSS插入页面中
      },
      {
        // 处理图像等静态文件
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',  // 将图片文件输出到dist/images目录
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 复制图标等静态文件到dist目录
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/icons', to: 'icons' },  // 复制icons文件夹到dist/icons
        { from: 'public/manifest.json', to: 'manifest.json' },  // 复制manifest.json到dist目录
        { from: 'src/sidepanel/sidepanel.html', to: 'sidepanel.html' },  // 添加侧边栏HTML文件
        { from: 'src/extensionPage/extensionPage.html', to: 'extensionPage.html' },
        { from: 'src/extensionPage/extensionPage.js', to: 'extensionPage.js' },  
        { from: 'src/extensionPage/extensionPage.css', to: 'extensionPage.css' },
        
      ],
    }),
    // 注入环境变量
    new webpack.DefinePlugin({
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],  // 允许省略JS和JSX扩展名
  },
  mode: 'development',  // 使用开发模式，可以根据需要改为'production'用于生产环境
};
