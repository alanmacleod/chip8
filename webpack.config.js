module.exports = [
    {
      node: {
        fs: "empty"
      },
        entry: './main.js',
        output: {
            path: './build',
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    /* exclude: /(node_modules)/,*/
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        },
        resolve: {
            // you can now require('file') instead of require('file.coffee')
            extensions: ['', '.js', '.json']
        }
    }

];
