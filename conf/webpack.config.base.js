/* global __dirname, module, require */
const { resolve } = require('path')
const webpack = require('webpack')

module.exports = function() {
    return {
        context: resolve(__dirname, '../frontend'),

        entry: {
            vendor: [
                resolve(__dirname, '../frontend/base.scss'),
                resolve(__dirname, '../frontend/base.js'),
            ],
            home: './pages/home.js',
        },

        output: {
            chunkFilename: '[name].bundle.js',
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: resolve(
                                __dirname,
                                '.webpack-cache'
                            ),
                            presets: [
                                [
                                    'env',
                                    {
                                        modules: false,
                                        targets: {
                                            browsers: [
                                                'last 2 versions',
                                                'ie >= 10',
                                            ],
                                        },
                                    },
                                ],
                                'react',
                                'stage-0',
                            ],
                            plugins: [
                                'transform-object-rest-spread',
                                'transform-runtime',
                            ],
                        },
                    },
                },
                {
                    test: /(png|gif|jpe?g)$/i,
                    use:
                        'url-loader?limit=10000&name=[path][name].[ext]?[hash]',
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    loader: 'file-loader?name=fonts/[name].[ext]',
                },
                {
                    test: /\.svg$/,
                    loader: 'babel-loader!svg-react-loader',
                },
            ],
        },

        plugins: [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
            }),
            // Only load Finnish locales
            new webpack.ContextReplacementPlugin(
                /moment[\\/]locale$/,
                /^\.\/(fi)$/
            ),
        ],

        resolve: {
            alias: {
                Base$: resolve(__dirname, '../frontend/base.js'),
                Components: resolve(__dirname, '../frontend/components/'),
                Containers: resolve(__dirname, '../frontend/containers/'),
                Pages: resolve(__dirname, '../frontend/pages/'),
            },
        },
    }
}
