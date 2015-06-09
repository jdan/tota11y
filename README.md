# tota11y

An accessibility visualization toolkit

<img src="http://khan.github.io/tota11y/img/tota11y-logo.png" alt="tota11y logo" width="200">

## Installation

First, [grab the latest copy of tota11y](https://github.com/Khan/tota11y/releases/latest).

Then, include it right before `</body>` like so:

```
<script src="tota11y.min.js"></script>
```

## Building

You can build tota11y with:

```
npm install
webpack
```

Or, productionized (minified + dead-code elimination):

```
webpack -p
```

## Special thanks

Many of tota11y's features come straight from [Google Chrome's Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools). We use this library heavily at [Khan Academy](http://khanacademy.org).

The awesome glasses in our logo were created by [Kyle Scott](https://thenounproject.com/Kyle/) and are licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/us/legalcode).

## License

MIT
