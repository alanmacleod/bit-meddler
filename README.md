# bit-meddler

If Bette Midler ever needed a lightweight way of scrambling a range of numbers without resorting to a random number generator or an array, oh boy, she would surely:

```
npm install --save bit-meddler
```

...and to scramble those numbers between `1` and `1000`:

```js
let bitmeddler = require('bit-meddler');

let meddle = new bitmeddler(1000)

meddle.next(); // give me a number!
```

Calling `.next()` will return every number between `1` and `1000` in a scrambled, pseudorandom order. The method will return a `null` once every number has been returned. You can then call `.reset()` to start again if you wish.

It's not "very random" but produces a passable simulation if speed and low memory usage are amongst your requirements. It uses linear feedback shift register design adapted for software. I got the idea as described in [Game Engine Black Book: Wolfenstein 3D](http://fabiensanglard.net/Game_Engine_Black_Book_Release_Date/index.php) and also [this website was handy](https://www.maximintegrated.com/en/app-notes/index.mvp/id/4400).
