[![Build Status](https://travis-ci.org/alanmacleod/bit-meddler.svg?branch=master)](https://travis-ci.org/alanmacleod/bit-meddler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# bit-meddler

Returns randomish integers in a given range.

The practical use of this package doesn't reveal itself until you go for stupid big-ass numbers. Like `100,000` which would take a relatively long time and waste a ton of memory to iterate through and return each integer only once using Math.random() and a flags array.

[Watch a live demo here](https://demos.alanmacleod.eu/bit-meddler/pub/)

![demo](https://raw.githubusercontent.com/alanmacleod/bit-meddler/master/demo/img/demo.png)

If Bette Midler ever needed a lightweight method to scramble a range of numbers without resorting to a random number generator or an array, oh boy, she would surely:

```
npm install --save bit-meddler
```

...and to scramble those numbers between, say, `1` and `1000`:

```js
let bitmeddler = require('bit-meddler');

let meddle = new bitmeddler(1000)

meddle.next(); // give me a number
```

Calling `.next()` will return every number between `1` and `1000` in a scrambled, pseudorandom order. The method will return a `null` once every number has been returned. You can then call `.reset()` to start again if you wish.

An optional second parameter is a seed number to vary the order:

```js
let seed = 42;
let meddle = new bitmeddler(1000, seed);
```

If you just want access to the full list of numbers, there's a convenient `all` method for that:

```js
let meddle = new bitmeddler(1000);

let scrambled = meddle.all(); // return array of 1000 scrambled integers
```

So it's not "very random" but produces a passable simulation if speed and low memory usage are amongst your requirements. It uses a linear feedback shift register design adapted for software. I remember writing games as a kid on bait hardware bending my brain trying to think of a way to do this without an array. So thanks to this book [Game Engine Black Book: Wolfenstein 3D](http://fabiensanglard.net/Game_Engine_Black_Book_Release_Date/index.php) for finally revealing the method to me years later. And also [this website was handy](https://www.maximintegrated.com/en/app-notes/index.mvp/id/4400).
