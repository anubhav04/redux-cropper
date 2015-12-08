import hook from 'css-modules-require-hook'
import sass from 'node-sass'
var path = require('path');
const node_modules = path.resolve(__dirname, '..', 'node_modules');

var jsdom = require('jsdom');

// setup the simplest document possible
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

// get the window object out of the document
var win = doc.defaultView;

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc;
global.window = win;
global.IS_TEST = true

// take all properties of the window object and also attach it to the
// mocha global object
propagateToGlobal(win);

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key]
  }
}

hook({
  extensions: ['.scss' ],
  preprocessCss: (css) => {
    const result = sass.renderSync({
      data: css
    });
    return result.css
  }
});
