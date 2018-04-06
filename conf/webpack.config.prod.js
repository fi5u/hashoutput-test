/* global __dirname, module, process, require */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HashOutput = require('webpack-plugin-hash-output')
const commonConfig = require('./webpack.config.base.js')
const { resolve } = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')

module.exports = function(env) {
    const options = {
        sourceMap: env.isTestServer,
        ident: 'postcss',
        plugins: () => {
            return [
                require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie >= 10'],
                }),
            ]
        },
    }

    return webpackMerge(commonConfig(), {
        devtool: 'source-map',

        output: {
            filename: '[name].[chunkhash].bundle.js',
            chunkFilename: '[name].[chunkhash].bundle.js',
            path: resolve(__dirname, '../frontend/dist'),
            publicPath: env.isTestServer
                ? '/static/dist/'
                : 'https://d3oyclny22pgl3.cloudfront.net/',
        },

        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        {
                            loader: 'cache-loader',
                            options: {
                                // provide a cache directory where cache items should be stored
                                cacheDirectory: resolve(
                                    __dirname,
                                    '.webpack-cache'
                                ),
                            },
                        },
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: env.isTestServer,
                                minimize: true,
                                importLoaders: 1,
                            },
                        },
                        { loader: 'postcss-loader', options: options },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: env.isTestServer },
                        },
                    ],
                },
            ],
        },

        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: options.sourceMap,
                }),
                new OptimizeCSSAssetsPlugin({}),
            ],
        },

        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            }),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),

            new webpack.optimize.ModuleConcatenationPlugin(),

            require('autoprefixer'),

            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].[contenthash:8].styles.css',
                //chunkFilename: "[id].css"
            }),

            new webpack.HashedModuleIdsPlugin(),

            new HashOutput(),

            new ManifestPlugin({
                publicPath: 'dist/',
            }),

            function() {
                this.plugin('done', function(stats) {
                    if (
                        stats.compilation.errors &&
                        stats.compilation.errors.length
                    ) {
                        /* eslint no-console:off */
                        console.log(stats.compilation.errors)
                        process.exit(1)
                    }
                })
            },
        ],
    })
}
