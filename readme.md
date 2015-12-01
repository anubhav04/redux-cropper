##[Demo](http://lapanoid.github.io/redux-cropper/)

Port of https://github.com/fengyuanchen/cropper to react, redux and immutable-js

Under development, please report an issue if you run into some bug

api should be as close as possible to https://github.com/fengyuanchen/cropper

#Usage

```
npm i redux-cropper --save
```
see example here - https://github.com/lapanoid/redux-cropper/blob/master/example/src/app.js

You also should use these webpack loaders as redux-cropper use css-modules internally (see https://github.com/css-modules/css-modules/pull/65 for details)

```
{
  test: /\.module.scss$/,
	loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
},
{
	test: /^((?!\.module).)*\.scss$/,
	loader: 'style!css!sass'
}
```

##Thanks!
@fengyuanchen for his awesome jQuery plugin

