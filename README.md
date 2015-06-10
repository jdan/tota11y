# tota11y

An accessibility visualization toolkit

<img src="http://khan.github.io/tota11y/img/tota11y-logo.png" alt="tota11y logo" width="200">

[Try tota11y in your browser](http://khan.github.io/tota11y/#Try-it), or
[read why we built tota11y](http://engineering.khanacademy.org/posts/tota11y.htm).

## Run on live websites

1. Open your website in Firefox
2. Open Firefox’s Developer Toolbar via the <kbd>Shift</kbd> + <kbd>F2</kbd> shortcut
3. Paste this command and press <kbd>ENTER</kbd>: `inject https://rawgit.com/Khan/tota11y/master/build/tota11y.min.js`

<img src="http://i.imgur.com/EgZ7u4g.png" alt="Run tota11y in Firefox" width="600">

## Installation

First, [grab the latest release of tota11y](https://github.com/Khan/tota11y/releases/latest).

Then, include it right before `</body>` like so:

```
<script src="tota11y.min.js"></script>
```

## Building

You can build tota11y with:

```
npm install
npm run build
```

## Testing

You can perform manual testing with tota11y using the following:

```
npm test
```

This will open `http://localhost:8080/webpack-dev-server/` in your browser,
which will automatically update as you make changes.

## Special thanks

Many of tota11y's features come straight from [Google Chrome's Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools). We use this library heavily at [Khan Academy](http://khanacademy.org).

The awesome glasses in our logo were created by [Kyle Scott](https://thenounproject.com/Kyle/) and are licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/us/legalcode).

## License

MIT
