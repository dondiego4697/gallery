import * as CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import * as path from 'path';
import * as TerserPlugin from 'terser-webpack-plugin';
import * as webpack from 'webpack';

const nodeModulesPath = path.resolve('./node_modules');
const projectPath = path.resolve('./client');
const outPath = path.resolve('./out/client');

const babelOptions = {
    comments: true,
    presets: [
        '@babel/preset-react',
        [
            '@babel/preset-env',
            {
                modules: 'commonjs',
                loose: true
            }
        ],
        [
            '@babel/preset-typescript',
            {
                allExtensions: true,
                isTSX: true
            }
        ]
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-typescript',
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true
            }
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true
            }
        ],
        [
            '@babel/plugin-transform-runtime',
            {
                regenerator: true
            }
        ]
    ]
};

interface Params {
    mode?: 'development' | 'production' | 'none';
    isProduction: boolean;
    isDevelopment: boolean;
}

function createConfig(params: Params): webpack.Configuration {
    const {mode, isDevelopment, isProduction} = params;

    return {
        mode,
        // в production сборке выходим сразу при первой ошибке
        bail: isProduction,
        devtool: isDevelopment ? 'cheap-module-source-map' : false,
        target: 'web',
        entry: {
            desktop: path.resolve(projectPath, './desktop/index.tsx'),
            touch: path.resolve(projectPath, './touch/index.tsx')
        },
        output: {
            path: path.resolve(outPath, './bundles'),
            filename: '[name].bundle.js'
        },
        infrastructureLogging: {
            level: 'error'
        },
        stats: 'errors-warnings',
        externals: {},
        plugins: [],
        resolve: {
            alias: {
                common: path.resolve(projectPath, './common'),
                desktop: path.resolve(projectPath, './desktop'),
                touch: path.resolve(projectPath, './touch'),
                lodash: 'lodash-es',
                'antd/lib': 'antd/es'
            },
            modules: [projectPath, nodeModulesPath],
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        resolveLoader: {
            modules: [nodeModulesPath],
            extensions: ['.js', '.json'],
            mainFields: ['loader', 'main']
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 2017
                        },
                        compress: {
                            ecma: 5,
                            comparisons: false,
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    }
                }),
                new CssMinimizerPlugin()
            ],
            splitChunks: {chunks: () => false},
            // по умолчанию в production окружении вебпак именует чанки числами,
            // но чтобы управлять предзагруженными чанками вручную нужно, зафиксировать
            // именование чанков именами
            chunkIds: 'named'
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve(projectPath, './tsconfig.json')
                            }
                        }
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        {
                            // Creates `style` nodes from JS strings
                            loader: 'style-loader'
                        },
                        {
                            // Translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
                        {
                            // Compiles Sass to CSS
                            loader: 'sass-loader'
                        }
                    ]
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                }
            ]
        }
    };
}

export default (_env: any, argv: any) => {
    argv.mode = argv.mode || 'development';

    return createConfig({
        mode: argv.mode || 'development',
        isProduction: argv.mode === 'production',
        isDevelopment: argv.mode === 'development'
    });
};
