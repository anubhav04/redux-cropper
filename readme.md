##[Demo](http://lapanoid.github.io/redux-cropper/)
[![Build Status](http://img.shields.io/travis/lapanoid/redux-cropper.svg?style=flat-square)](https://travis-ci.org/lapanoid/redux-cropper)
[![Join the chat at https://gitter.im/lapanoid/redux-cropper](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lapanoid/redux-cropper?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Github Issues](http://githubbadges.herokuapp.com/lapanoid/redux-cropper/issues.svg?style=flat-square)](https://github.com/lapanoid/redux-cropper/issues)
[![Pending Pull-Requests](http://githubbadges.herokuapp.com/lapanoid/redux-cropper/pulls.svg?style=flat-square)](https://github.com/lapanoid/redux-cropper/pulls)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Port of [fengyuanchen cropper](https://github.com/fengyuanchen/cropper) to react, redux and immutable-js

Under development, please report an issue if you run into some bug

api should be as close as possible to [this](https://github.com/fengyuanchen/cropper/blob/master/README.md)

#Usage

```
npm i redux-cropper --save
```
see example [here](https://github.com/lapanoid/redux-cropper/blob/master/example/src/app.js)

You also should use these webpack loaders as redux-cropper use css-modules internally (see [this PR](https://github.com/css-modules/css-modules/pull/65) for details)

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

