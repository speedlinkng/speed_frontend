// webpack.mix.js

let mix = require('laravel-mix');

mix.js('src/app.js', 'static').setPublicPath('static');