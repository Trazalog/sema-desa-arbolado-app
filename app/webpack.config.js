let webpack = require("webpack");
let path = require("path");
let CleanWebpackPlugin = require("clean-webpack-plugin");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let autoprefixer = require('autoprefixer');
let precss = require('precss');
let OfflinePlugin = require('offline-plugin');
let WebpackPwaManifest = require('webpack-pwa-manifest');
let VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');

let pathsToClean = [
    "dist",
];

let cleanOptions = {
    verbose:  false,
    dry:      false
};


module.exports = [
    {
        entry: {
            core: './src/js/app.js',
            IndexController: './src/js/controller/IndexController.js',
            HomeController: './src/js/controller/HomeController.js',
            MiPerfilController: './src/js/controller/MiPerfilController.js',
            ManzanasAsignadasController: './src/js/controller/ManzanasAsignadasController.js',
            DomicilioACensarController: './src/js/controller/DomicilioACensarController.js',
            AreasAsignadasController: './src/js/controller/AreasAsignadasController.js',
            ArbolesCensadosController: './src/js/controller/ArbolesCensadosController.js',
            MisArbolesCensadosController: './src/js/controller/MisArbolesCensadosController.js',
            NuevaUbicacionController: './src/js/controller/NuevaUbicacionController.js',
            ManzanasCensadasController: './src/js/controller/ManzanasCensadasController.js',
            FormularioController: './src/js/controller/FormularioController.js'
        },

        output: {
            path: path.resolve(__dirname, "dist"),
            publicPath: "./",
            filename: "[name].js"
        },

        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.html/,
                    loader: "html-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.(scss)$/,
                    use: [
                        {
                            loader: 'style-loader', // inject CSS to page
                        },
                        {
                            loader: 'css-loader', // translates CSS into CommonJS modules
                        },
                        {
                            loader: 'postcss-loader', // Run post css actions
                            options: {
                                plugins() { // post css plugins, can be exported to postcss.config.js
                                return [
                                    precss,//require('precss'),
                                    autoprefixer//require('autoprefixer')
                                ];
                            }
                        }
                    }, {
                        loader: 'sass-loader'
                    }]
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                    ]
                },
                {
                    test: /\.js&/,
                    loader: "babel-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpg|gif|jpeg|ico|svg)$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "resource/image/"
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "resource/font/"
                    },
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "resource/font/"
                    },
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "resource/font/"
                    },
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "resource/font/"
                    },
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "resource/font/"
                    },
                }
            ]
        },

        resolve: {

            alias: {

                vue$: "vue/dist/vue.esm.js"
            },

            extensions: ['*', '.js', '.jsx', '.css', 'scss'],
        },

        performance: {
            hints: false
        },

        optimization: {
            minimize: true,
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'core',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env.LOGGER_LEVEL': JSON.stringify('info')
            }),

            new VueLoaderPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: true
            }),
            new CleanWebpackPlugin(pathsToClean, cleanOptions),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default'],
                Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
                Button: 'exports-loader?Button!bootstrap/js/dist/button',
                Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
                Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
                Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
                Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
                Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
                Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
                Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
                Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
                Util: 'exports-loader?Util!bootstrap/js/dist/util'
            }),
            new webpack.LoaderOptionsPlugin({ postcss: [autoprefixer] }),

            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].css',
            }),

            new HtmlWebpackPlugin({
                template: "./view/index.html",
                filename: "index.html",
                hash: true,
                chunks: ['core', 'IndexController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/home.html",
                filename: "home.html",
                hash: true,
                chunks: ['core', 'HomeController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/miPerfil.html",
                filename: "miPerfil.html",
                hash: true,
                chunks: ['core', 'MiPerfilController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/manzanasAsignadas.html",
                filename: "manzanasAsignadas.html",
                hash: true,
                chunks: ['core', 'ManzanasAsignadasController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/domicilioACensar.html",
                filename: "domicilioACensar.html",
                hash: true,
                chunks: ['core', 'DomicilioACensarController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/areasAsignadas.html",
                filename: "areasAsignadas.html",
                hash: true,
                chunks: ['core', 'AreasAsignadasController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/arbolesCensados.html",
                filename: "arbolesCensados.html",
                hash: true,
                chunks: ['core', 'ArbolesCensadosController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/misArbolesCensados.html",
                filename: "misArbolesCensados.html",
                hash: true,
                chunks: ['core', 'MisArbolesCensadosController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/nuevaUbicacion.html",
                filename: "nuevaUbicacion.html",
                hash: true,
                chunks: ['core', 'NuevaUbicacionController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/manzanasCensadas.html",
                filename: "manzanasCensadas.html",
                hash: true,
                chunks: ['core', 'ManzanasCensadasController']
            }),

            new HtmlWebpackPlugin({
                template: "./view/formulario.html",
                filename: "formulario.html",
                hash: true,
                chunks: ['core', 'FormularioController']
            }),

            new WebpackPwaManifest({
                name: 'CENSARB.SAN JUAN',
                short_name: 'CENSARB',
                description: 'CENSARB.SAN JUAN',
                background_color: '#fff',
                crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
                icons: [
                    {
                        src: path.resolve('resource/image/main-icon.png'),
                        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                    }
                ]
            }),

            // new SWPrecache({
            //     cacheId: 'dc-covers',
            //     filepath: 'service-worker.js',
            //     staticFileGlobs: [
            //         'index.html',
            //         'manifest.json',
            //         'dist/*.{js,css}'
            //     ],
            //     stripPrefix: '/'
            // })

            //IMPORTANTE: Se recomienda incluir el plugin al último del resto.
            new OfflinePlugin({
                version: '[hash]',
                responseStrategy: 'network-first',
                safeToUseOptionalCaches: true,
                updateStrategy: 'all',
                /*disableInstall: true,*/
                autoUpdate: 1000 * 60 * 10, // 10 minutes to refresh
                excludes: ['**/*.map'], // Don't cache source maps
                cacheMaps: [
                    {
                        match: url => {
                            // Don't return the cached indexController.html for API requests or /auth pages
                            if (url.pathname.indexOf('/api') === 0) return;
                            if (url.pathname.indexOf('/auth') === 0) return;
                            return new URL('/index.html', url);
                        },
                        requestType: ['navigate'],
                    },
                ],
                externals: [
                    /* Resources images */
                    "./resource/image/loading.gif",
                    "./resource/image/main-icon.png",
                    "./resource/image/default-profile-img.png",
                    "./resource/image/main-icon-white.png",
                    "./resource/image/logo-gobierno.png",
                    "./resource/image/layers-2x.png",
                    "./resource/image/layers.png",
                    "./resource/image/marker-icon-2x.png",
                    "./resource/image/marker-icon.png",
                    "./resource/image/marker-shadow.png",
                    "./resource/image/legend/calles_2020_3.png",
                    "./resource/image/legend/capital_manzanas_0.png",
                    "./resource/image/legend/espacios_verdes_2020_1.png",
                    "./resource/image/legend/infraestructura_2.png",

                    /* Resources fonts */
                    "./resource/font/fa-regular-400.woff2",
                    "./resource/font/fa-regular-400.woff",
                    "./resource/font/fa-regular-400.eot",
                    "./resource/font/fa-regular-400.ttf",
                    "./resource/font/fa-brands-400.woff2",
                    "./resource/font/fa-solid-900.woff2",
                    "./resource/font/fa-brands-400.woff",
                    "./resource/font/fa-solid-900.woff",
                    "./resource/font/fa-brands-400.eot",
                    "./resource/font/fa-brands-400.ttf",
                    "./resource/font/fa-regular-400.svg",
                    "./resource/font/fa-solid-900.ttf",
                    "./resource/font/fa-solid-900.eot",
                    "./resource/font/fa-brands-400.svg",
                    "./resource/font/fa-solid-900.svg",


                    /* CSS files */
                    "./core.css",
                    /* JS Kernel Libs files */
                    "./core.js",

                    /*NewCustomMaps*/
                    "./resource/js/data/calles_2020_3.js",
                    "./resource/js/data/capital_manzanas_0.js",
                    "./resource/js/data/espacios_verdes_2020_1.js",
                    "./resource/js/data/infraestructura_2.js",


                    /* Index Section */
                    "./IndexController.js",
                    "./",

                    /* Home Section */
                    "./HomeController.js",
                    "./home.html",

                    /* Mi Perfil Section */
                    "./MiPerfilController.js",
                    "./miPerfil.html",

                    /* Areas Asignadas Section */
                    "./AreasAsignadasController.js",
                    "./areasAsignadas.html",

                    /* Manzanas Asignadas Section */
                    "./ManzanasAsignadasController.js",
                    "./manzanasAsignadas.html",

                    /* Domicilio Section */
                    "./DomicilioACensarController.js",
                    "./domicilioACensar.html",

                    /* Arboles Section */
                    "./ArbolesCensadosController.js",
                    "./arbolesCensados.html",

                    /* Arboles Mapa Section */
                    "./MisArbolesCensadosController.js",
                    "./misArbolesCensados.html",

                    /* Mapa nueva ubicacion */
                    "./NuevaUbicacionController.js",
                    "./nuevaUbicacion.html",

                    /* Manzanas Censadas ubicacion */
                    "./ManzanasCensadasController.js",
                    "./manzanasCensadas.html",

                    /* Formularios dynamic */
                    "./FormularioController.js",
                    "./formulario.html",

                    // External or remote
                    "https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
                ],
                ServiceWorker: {
                    events: true,
                    output: './sw-arbolado-offline.js',
                    navigateFallbackURL: '/',
                    scope: '/'
                },
                caches:{
                    "main":
                        [
                            /* Resources images */
                            "./resource/image/loading.gif",
                            "./resource/image/main-icon.png",
                            "./resource/image/default-profile-img.png",
                            "./resource/image/main-icon-white.png",
                            "./resource/image/logo-gobierno.png",
                            "./resource/image/layers-2x.png",
                            "./resource/image/layers.png",
                            "./resource/image/marker-icon-2x.png",
                            "./resource/image/marker-icon.png",
                            "./resource/image/marker-shadow.png",
                            "./resource/image/legend/calles_2020_3.png",
                            "./resource/image/legend/capital_manzanas_0.png",
                            "./resource/image/legend/espacios_verdes_2020_1.png",
                            "./resource/image/legend/infraestructura_2.png",


                            /* Resources fonts */
                            "./resource/font/fa-regular-400.woff2",
                            "./resource/font/fa-regular-400.woff",
                            "./resource/font/fa-regular-400.eot",
                            "./resource/font/fa-regular-400.ttf",
                            "./resource/font/fa-brands-400.woff2",
                            "./resource/font/fa-solid-900.woff2",
                            "./resource/font/fa-brands-400.woff",
                            "./resource/font/fa-solid-900.woff",
                            "./resource/font/fa-brands-400.eot",
                            "./resource/font/fa-brands-400.ttf",
                            "./resource/font/fa-regular-400.svg",
                            "./resource/font/fa-solid-900.ttf",
                            "./resource/font/fa-solid-900.eot",
                            "./resource/font/fa-brands-400.svg",
                            "./resource/font/fa-solid-900.svg",


                            /* CSS files */
                            "./core.css",
                            /* JS Kernel Libs files */
                            "./core.js",

                            /*NewCustomMaps*/
                            "./resource/js/data/calles_2020_3.js",
                            "./resource/js/data/capital_manzanas_0.js",
                            "./resource/js/data/espacios_verdes_2020_1.js",
                            "./resource/js/data/infraestructura_2.js",

                            /* Index Section */
                            "./IndexController.js",
                            "./",

                            /* Home Section */
                            "./HomeController.js",
                            "./home.html",

                            /* Mi Perfil Section */
                            "./MiPerfilController.js",
                            "./miPerfil.html",

                            /* Areas Asignadas Section */
                            "./AreasAsignadasController.js",
                            "./areasAsignadas.html",

                            /* Manzanas Asignadas Section */
                            "./ManzanasAsignadasController.js",
                            "./manzanasAsignadas.html",

                            /* Domicilio Section */
                            "./DomicilioACensarController.js",
                            "./domicilioACensar.html",

                            /* Arboles Section */
                            "./ArbolesCensadosController.js",
                            "./arbolesCensados.html",

                            /* Arboles Mapa Section */
                            "./MisArbolesCensadosController.js",
                            "./misArbolesCensados.html",

                            /* Mapa nueva ubicacion */
                            "./NuevaUbicacionController.js",
                            "./nuevaUbicacion.html",

                            /* Manzanas Censadas ubicacion */
                            "./ManzanasCensadasController.js",
                            "./manzanasCensadas.html",

                            /* Formularios dynamic */
                            "./FormularioController.js",
                            "./formulario.html",

                            // External or remote
                            "https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
                        ]
                },
                AppCache: {
                    events: true,
                    publicPath: '/',
                    FALLBACK: {
                        '/': '/'
                    }
                }
            })
        ]
    }
];
