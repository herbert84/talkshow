const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const vendorLibs = ['react', 'react-router',
    'redux', 'react-redux', 'redux-logger', 'redux-thunk', 'redux-promise',
    'superagent',
];

module.exports = {
    devtool: 'cheap-module-source-map',

    entry: [
        './client/index.jsx'
    ],

    output: {
        path: __dirname + '/public',
        filename: 'bundle.min.js'
    },

    resolve: {
        modules: [
            path.resolve(__dirname, './client'),
            path.resolve(__dirname, 'node_modules'),
            'node_modules'
        ],
        extensions: ['*', '.js', '.jsx'],
    },

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: "/node_modules/",
                loader: "babel-loader"
            },
            {
                test: /\.js$/,
                exclude: "/node_modules/",
                loader: "babel-loader",
                include: [path.resolve('./client')]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
            }, {
                test: /\.(png|jpg|svg)$/,
                loader: 'url?limit=25000',
            },
        ],
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            minimize: true,
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
        }),

        new HtmlWebpackPlugin({
            template: 'index.html.template',
            title: "TalkShow",
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.min.js',
            minChunks: (module) => {
                var resource = module.resource;
                if (!resource)
                    return false;
                for (var libName of vendorLibs) {
                    if (resource.indexOf(path.resolve(__dirname, 'node_modules', libName)) >= 0)
                        return true;
                }
                return false;
            },
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new ExtractTextPlugin('bundle.min.css', {
            allChunks: false
        }),
        new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0,
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'production' ? 'false' : 'true')),
        }),
    ],
};
