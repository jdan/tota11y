## CLA

In order to contribute to tota11y, you must first sign the CLA, which can be found at http://www.khanacademy.org/r/cla.

## Installation

`npm install @khanacademy/tota11y`

Include it right before `</body>` like so:

```html
<script src="tota11y.min.js"></script>
```

## Development

Want to contribute to tota11y? Awesome! Run the following in your terminal:

```bash
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

```bash
npm test
```

Or lint with:

```bash
npm run lint
```

To perform manual testing as you work, you can run a live dev-server with the
following:

```bash
npm start
```

## Building

To create a development build as the test server uses:

```bash
npm run build:dev
```

To create a production build, with minified and unminified output:

```bash
npm run build:prod
```

## Releasing

Currently, the following steps must be made to release a new version of tota11y:

1. Update `package.json` with the version number to be released.
1. Commit the release details to the CHANGELOG.md.
   This should be list of the unique pull requests and commits that contributed to the release (see the CHANGLOG.md file for previous examples).
1. Draft a new release for the version.
   The tag name and name of the release should be of the form `v1.2.3` where `1.2.3` is the version from `package.json`.
1. Login to `npm` with the Khan Academy credentials.
   This requires someone with appropriate privileges.
1. Run `npm publish`.
   This step will run tests and pre-publish checks, then perform a production build and publish the new package to NPM.

## Community Examples
Want to integrate tota11y into your site, but don't know where to start? Here are some examples from the tota11y community to inspire you:
* [azemetre/webpack-react-typescript-project](https://github.com/azemetre/tota11y-webpack-react-typescript-example) shows how to integrate tota11y into a webpack build for a React + TypeScript project.

## License

tota11y is licensed under the [MIT License](http://opensource.org/licenses/MIT).
