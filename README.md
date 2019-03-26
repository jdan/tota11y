# tota11y [![Build Status](https://travis-ci.org/Khan/tota11y.svg?branch=master)](https://travis-ci.org/Khan/tota11y)

An accessibility visualization toolkit

<img src="http://khan.github.io/tota11y/img/tota11y-logo.png" alt="tota11y logo" width="200">

[Try tota11y in your browser](http://khan.github.io/tota11y/#Try-it), or
[read why we built tota11y](http://engineering.khanacademy.org/posts/tota11y.htm).

## Installation

`npm install @khanacademy/tota11y`

Include it right before `</body>` like so:

```html
<script src="tota11y.min.js"></script>
```

## Development

Want to contribute to tota11y? Awesome! Run the following in your terminal:

```
git clone https://github.com/Khan/tota11y.git
cd tota11y/
npm install
```

## Architecture Overview

Most of the functionality in tota11y comes from its **plugins**. Each plugin
gets its own directory in [`plugins/`](https://github.com/Khan/tota11y/tree/master/plugins) and maintains its own JavaScript, CSS,
and even handlebars. [Here's what the simple LandmarksPlugin looks like](https://github.com/Khan/tota11y/blob/master/plugins/landmarks/index.js).

[`plugins/shared/`](https://github.com/Khan/tota11y/tree/master/plugins/shared) contains a variety of shared utilities for the plugins, namely the [info-panel](https://github.com/Khan/tota11y/tree/master/plugins/shared/info-panel) and [annotate](https://github.com/Khan/tota11y/tree/master/plugins/shared/annotate) modules, which are used to report accessibility violations on the screen.

[`index.js`](https://github.com/Khan/tota11y/blob/master/index.js) brings it all together.

tota11y uses a variety of technologies, including [jQuery](https://jquery.com/), [webpack](https://webpack.github.io/), [babel](https://babeljs.io/), and [JSX](https://facebook.github.io/jsx/). **There's no need to know all (or any!) of these to contribute to tota11y, but we hope tota11y is a good place to learn something new and interesting.**

## Testing

You can run unit tests on tota11y with the following:

```
npm test
```

Or lint with:

```
npm run lint
```

To perform manual testing as you work, you can run a live dev-server with the
following:

```
npm start
```

## Building

To create a development build as the test server uses:

```
npm run build:dev
```

To create a production build, with minified and unminified output:

```
npm run build:prod
```

## Loading tota11y as an unpacked Chrome extension

Build the project

```
npm run build
```

then in Chrome, enter `chrome://extensions` in the address bar to load the Chrome extensions  page. At the top left of the Chrome extensions page, click the *Load Unpacked* button. From the file browser, select the `./build` folder and press the *Select* button to load the tota11y Chrome extension unpacked.

## Loading tota11y as a temporary add-on in Firefox

Build the project

```
npm run build
```

then in Firefox, enter `about:debugging` in the address bar to load the add-on debugging page. At the top right of the add-on debugging page, click the *Load Temporary Add-on...* button. From the file browser, select the `./build/manifest.json` file and press the *Open* button to load tota11y as a temporary add-on.

## Special thanks

Many of tota11y's features come straight from [Google Chrome's Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools). We use this library heavily at [Khan Academy](http://khanacademy.org).

The awesome glasses in our logo were created by [Kyle Scott](https://thenounproject.com/Kyle/) and are licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/us/legalcode).

## License

[MIT License](LICENSE.txt)
