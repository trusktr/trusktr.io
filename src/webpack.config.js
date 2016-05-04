var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: {
         'mom2015': './javascripts/mom2015/main.js',
         'webglearth': './javascripts/webglearth/main.js',
         'clobe': './javascripts/clobe/main.js',
         'flipDiagonal': './javascripts/flipDiagonal/main.js',
         'passwordReveal': './javascripts/passwordReveal/main.js',
         'calendar': './javascripts/calendar/main.js',
         'password': './javascripts/password/main.js',

         'giants': './javascripts/giants/main.js',
         'greg5050': './javascripts/greg5050/main.js',
         'johnnyCrook': './javascripts/johnnyCrook/main.js',
         'scrollViewTest': './javascripts/scrollViewTest/main.js',
    },
    output: {
        path: path.resolve(__dirname, '../meteor-app/public/js'),
        filename: '[name].bundle.js',
    },
    plugins: [
        //new webpack.optimize.CommonsChunkPlugin('shared-modules.js'),
    ],
    resolve: {
        extensions: [
            '', '.js', '.jsx', '.css',
        ],
        root: [ path.resolve(__dirname, 'node_modules') ],
        alias: {
            'famous': 'famous/src'
        },
    },
    resolveLoader: {
        root: [ path.resolve(__dirname, 'node_modules') ]
    },
    module: {
        loaders: [

            // Support for ES6 modules and the latest ES syntax.
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: [
                        'es2015', // specified manually below.
                        'react' // for React JSX.
                    ],
                    plugins: [],
                },
            },

            // For loading CSS files.
            { test: /\.css$/, loader: 'style!css' },

            //images
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'file',
                //loader: 'url',
            },

            //// temporary support for Famous/engine's glslify transform requirement.
            //// TODO: Make rocket:module detect and apply browserify transforms.
            //{ test: /\.js$/, loader: 'transform/cacheable?glslify'},
            // dependencies for npm.json:
            //  "transform-loader": "^0.2.0",
            //  "glslify": "^2.0.0"

            //// glsl files.
            ////{ test: /\.glsl$/, loader: 'glslify!raw' }
            //{ test: /\.(glsl|frag|vert)$/, loader: 'raw' },
            //{ test: /\.(glsl|frag|vert)$/, loader: 'glslify' }
        ]
    },
    devtool: 'source-map',
    progress: true,
    //cache: webpackCacheObject[platform],
}
