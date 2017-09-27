/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bitMeddler = __webpack_require__(1);

var _bitMeddler2 = _interopRequireDefault(_bitMeddler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WIDTH = 480,
    HEIGHT = 360,
    BIT_DEPTH = 4; // 32-bit

var bm = new _bitMeddler2.default(WIDTH * HEIGHT);

var load_count = 0; // hacky, I know, shut up its only a demo gawd

var lctx = document.getElementById('cleft').getContext('2d');
var rctx = document.getElementById('cright').getContext('2d');

load_img_into_canvas(lctx, './img/homer_car_1_480px.jpg');
load_img_into_canvas(rctx, './img/homer_car_2_480px.jpg');

var timer = window.setInterval(fizzle, 50);

function fizzle() {
  if (load_count != 2) {
    console.warn("Data not loaded yet!");
    return;
  }

  var ldat = lctx.getImageData(0, 0, WIDTH, HEIGHT);
  var rdat = rctx.getImageData(0, 0, WIDTH, HEIGHT);

  var L = ldat.data,
      R = rdat.data;
  var o = void 0;

  // Do 2000 pixels at a time so we don't hold the browser UI thread up too much
  for (var i = 0; i < 2000; i++) {

    // Here, we're just using bit-meddler to generate a buffer offset
    // but you can easily get a pair of X & Y pixel coordinates with some
    // modulus division
    o = bm.next();

    if (o == null) break;

    o *= BIT_DEPTH; // AGBR; = 4 bytes

    // Swap the pixels ES6 style
    var _ref = [R[o + 0], L[o + 0]];
    L[o + 0] = _ref[0];
    R[o + 0] = _ref[1];
    var _ref2 = [R[o + 1], L[o + 1]];
    L[o + 1] = _ref2[0];
    R[o + 1] = _ref2[1];
    var _ref3 = [R[o + 2], L[o + 2]];
    L[o + 2] = _ref3[0];
    R[o + 2] = _ref3[1];
    var _ref4 = [R[o + 3], L[o + 3]];
    L[o + 3] = _ref4[0];
    R[o + 3] = _ref4[1];
  }

  lctx.putImageData(ldat, 0, 0);
  rctx.putImageData(rdat, 0, 0);

  if (o == null) {
    window.clearInterval(timer);

    window.setTimeout(function () {
      bm.reset(); // reset bit-meddler for another pass!
      timer = window.setInterval(fizzle, 50);
    }, 2000);
  }
}

function load_img_into_canvas(ctx, file) {
  var img1 = new Image();
  img1.onload = function () {
    ctx.drawImage(img1, 0, 0);
    load_count++;
  };
  img1.src = file;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = bitmeddler;

var INT_MAX = 2147483647;

var ITSAKINDOFMAGIC = [
  0x3,0x6,0x9,0x1D,0x36,0x69,0xA6, // 2 to 8
  0x17C,0x32D,0x4F2,0xD34,0x1349,0x2532,0x6699,0xD295, // 9 - 16
  0x12933,0x2C93E,0x593CA,0xAFF95,0x12B6BC,0x2E652E,0x5373D6,0x9CCDAE, // etc
  0x12BA74D,0x36CD5A7,0x4E5D793,0xF5CDE95,0x1A4E6FF2,0x29D1E9EB,0x7A5BC2E3,0xB4BCD35C
];

function bitmeddler(maximum, seed)
{
  if (maximum < 2 || maximum > INT_MAX)
    throw "`maximum` must be between 2 and " + INT_MAX + " inclusive";

  this.maximum = maximum;
  this.start = (seed || 1) % maximum;
  this.cur = this.start;
  this.MASK = ITSAKINDOFMAGIC[ this._msb( this.maximum ) - 2 ];
  this.next = this._next;
}

bitmeddler.prototype = {

  _next: function()
  {
    do {
      this.cur = (this.cur & 1) ? this.cur = (this.cur >> 1) ^ this.MASK :
                                  this.cur >>= 1;
    } while( this.cur > this.maximum );

    if ( this.cur === this.start )
      this.next = this._done;

    return this.cur;
  },

  _done: function()
  {
    return null;
  },

  reset: function()
  {
    this.next = this._next;
    this.cur = this.start;
  },

  all: function()
  {
    this.reset();
    var o = [], v;
    while(v = this.next())
      o.push(v);
    return o;
  },

  _msb: function(v)
  {
    var r = 0;
    while (v) { v >>=1; r++; }
    return r;
  }

};


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODdmZGEwMTVlODlmZDQzYmJmN2EiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0LW1lZGRsZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJXSURUSCIsIkhFSUdIVCIsIkJJVF9ERVBUSCIsImJtIiwibG9hZF9jb3VudCIsImxjdHgiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Q29udGV4dCIsInJjdHgiLCJsb2FkX2ltZ19pbnRvX2NhbnZhcyIsInRpbWVyIiwid2luZG93Iiwic2V0SW50ZXJ2YWwiLCJmaXp6bGUiLCJjb25zb2xlIiwid2FybiIsImxkYXQiLCJnZXRJbWFnZURhdGEiLCJyZGF0IiwiTCIsImRhdGEiLCJSIiwibyIsImkiLCJuZXh0IiwicHV0SW1hZ2VEYXRhIiwiY2xlYXJJbnRlcnZhbCIsInNldFRpbWVvdXQiLCJyZXNldCIsImN0eCIsImZpbGUiLCJpbWcxIiwiSW1hZ2UiLCJvbmxvYWQiLCJkcmF3SW1hZ2UiLCJzcmMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzVEQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxHQUFkO0FBQUEsSUFBbUJDLFNBQVMsR0FBNUI7QUFBQSxJ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LE1BQUwsR0FBYyxZQUFNO0FBQ2xCSixRQUFJSyxTQUFKLENBQWNILElBQWQsRUFBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7QUFDQTVCO0FBQ0QsR0FIRDtBQUlBNEIsT0FBS0ksR0FBTCxHQUFXTCxJQUFYO0FBQ0QsQzs7Ozs7OztBQ2pGRDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVEsS0FBSztBQUM1QjtBQUNBOztBQUVBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg3ZmRhMDE1ZTg5ZmQ0M2JiZjdhIiwiXG5pbXBvcnQgYml0bWVkZGxlciBmcm9tICdiaXQtbWVkZGxlcic7XG5cbmNvbnN0IFdJRFRIID0gNDgwLCBIRUlHSFQgPSAzNjAsIEJJVF9ERVBUSCA9IDQ7IC8vIDMyLWJpdFxuXG5jb25zdCBibSA9IG5ldyBiaXRtZWRkbGVyKFdJRFRIICogSEVJR0hUKTtcblxubGV0IGxvYWRfY291bnQgPSAwOyAvLyBoYWNreSwgSSBrbm93LCBzaHV0IHVwIGl0cyBvbmx5IGEgZGVtbyBnYXdkXG5cbmxldCBsY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWZ0JykuZ2V0Q29udGV4dCgnMmQnKTtcbmxldCByY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyaWdodCcpLmdldENvbnRleHQoJzJkJyk7XG5cbmxvYWRfaW1nX2ludG9fY2FudmFzKGxjdHgsICcuL2ltZy9ob21lcl9jYXJfMV80ODBweC5qcGcnKTtcbmxvYWRfaW1nX2ludG9fY2FudmFzKHJjdHgsICcuL2ltZy9ob21lcl9jYXJfMl80ODBweC5qcGcnKTtcblxuXG5sZXQgdGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZml6emxlLCA1MCk7XG5cblxuZnVuY3Rpb24gZml6emxlKClcbntcbiAgaWYgKGxvYWRfY291bnQgIT0gMilcbiAge1xuICAgIGNvbnNvbGUud2FybihcIkRhdGEgbm90IGxvYWRlZCB5ZXQhXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG5cbiAgbGV0IGxkYXQgPSBsY3R4LmdldEltYWdlRGF0YSgwLCAwLCBXSURUSCwgSEVJR0hUKTtcbiAgbGV0IHJkYXQgPSByY3R4LmdldEltYWdlRGF0YSgwLCAwLCBXSURUSCwgSEVJR0hUKTtcblxuICBsZXQgTCA9IGxkYXQuZGF0YSwgUiA9IHJkYXQuZGF0YTtcbiAgbGV0IG87XG5cbiAgLy8gRG8gMjAwMCBwaXhlbHMgYXQgYSB0aW1lIHNvIHdlIGRvbid0IGhvbGQgdGhlIGJyb3dzZXIgVUkgdGhyZWFkIHVwIHRvbyBtdWNoXG4gIGZvciAobGV0IGk9MDsgaTwyMDAwOyBpKyspXG4gIHtcblxuICAgIC8vIEhlcmUsIHdlJ3JlIGp1c3QgdXNpbmcgYml0LW1lZGRsZXIgdG8gZ2VuZXJhdGUgYSBidWZmZXIgb2Zmc2V0XG4gICAgLy8gYnV0IHlvdSBjYW4gZWFzaWx5IGdldCBhIHBhaXIgb2YgWCAmIFkgcGl4ZWwgY29vcmRpbmF0ZXMgd2l0aCBzb21lXG4gICAgLy8gbW9kdWx1cyBkaXZpc2lvblxuICAgIG8gPSBibS5uZXh0KCk7XG5cbiAgICBpZiAobyA9PSBudWxsKVxuICAgICAgYnJlYWs7XG5cbiAgICAgbyAqPSBCSVRfREVQVEg7IC8vIEFHQlI7ID0gNCBieXRlc1xuXG4gICAgLy8gU3dhcCB0aGUgcGl4ZWxzIEVTNiBzdHlsZVxuICAgIFtMW28gKyAwXSwgUltvICsgMF1dID0gW1JbbyArIDBdLCBMW28gKyAwXV07XG4gICAgW0xbbyArIDFdLCBSW28gKyAxXV0gPSBbUltvICsgMV0sIExbbyArIDFdXTtcbiAgICBbTFtvICsgMl0sIFJbbyArIDJdXSA9IFtSW28gKyAyXSwgTFtvICsgMl1dO1xuICAgIFtMW28gKyAzXSwgUltvICsgM11dID0gW1JbbyArIDNdLCBMW28gKyAzXV07XG5cbiAgfVxuXG4gIGxjdHgucHV0SW1hZ2VEYXRhKGxkYXQsIDAsIDApO1xuICByY3R4LnB1dEltYWdlRGF0YShyZGF0LCAwLCAwKTtcblxuICBpZiAobyA9PSBudWxsKVxuICB7XG4gICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGltZXIpO1xuXG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBibS5yZXNldCgpOyAvLyByZXNldCBiaXQtbWVkZGxlciBmb3IgYW5vdGhlciBwYXNzIVxuICAgICAgICB0aW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbChmaXp6bGUsIDUwKTtcbiAgICB9LCAyMDAwKTtcblxuICB9XG59XG5cblxuXG5mdW5jdGlvbiBsb2FkX2ltZ19pbnRvX2NhbnZhcyhjdHgsIGZpbGUpXG57XG4gIGxldCBpbWcxID0gbmV3IEltYWdlKCk7XG4gIGltZzEub25sb2FkID0gKCkgPT4ge1xuICAgIGN0eC5kcmF3SW1hZ2UoaW1nMSwgMCwgMCk7XG4gICAgbG9hZF9jb3VudCsrO1xuICB9XG4gIGltZzEuc3JjID0gZmlsZTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW4uanMiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gYml0bWVkZGxlcjtcblxudmFyIElOVF9NQVggPSAyMTQ3NDgzNjQ3O1xuXG52YXIgSVRTQUtJTkRPRk1BR0lDID0gW1xuICAweDMsMHg2LDB4OSwweDFELDB4MzYsMHg2OSwweEE2LCAvLyAyIHRvIDhcbiAgMHgxN0MsMHgzMkQsMHg0RjIsMHhEMzQsMHgxMzQ5LDB4MjUzMiwweDY2OTksMHhEMjk1LCAvLyA5IC0gMTZcbiAgMHgxMjkzMywweDJDOTNFLDB4NTkzQ0EsMHhBRkY5NSwweDEyQjZCQywweDJFNjUyRSwweDUzNzNENiwweDlDQ0RBRSwgLy8gZXRjXG4gIDB4MTJCQTc0RCwweDM2Q0Q1QTcsMHg0RTVENzkzLDB4RjVDREU5NSwweDFBNEU2RkYyLDB4MjlEMUU5RUIsMHg3QTVCQzJFMywweEI0QkNEMzVDXG5dO1xuXG5mdW5jdGlvbiBiaXRtZWRkbGVyKG1heGltdW0sIHNlZWQpXG57XG4gIGlmIChtYXhpbXVtIDwgMiB8fCBtYXhpbXVtID4gSU5UX01BWClcbiAgICB0aHJvdyBcImBtYXhpbXVtYCBtdXN0IGJlIGJldHdlZW4gMiBhbmQgXCIgKyBJTlRfTUFYICsgXCIgaW5jbHVzaXZlXCI7XG5cbiAgdGhpcy5tYXhpbXVtID0gbWF4aW11bTtcbiAgdGhpcy5zdGFydCA9IChzZWVkIHx8IDEpICUgbWF4aW11bTtcbiAgdGhpcy5jdXIgPSB0aGlzLnN0YXJ0O1xuICB0aGlzLk1BU0sgPSBJVFNBS0lORE9GTUFHSUNbIHRoaXMuX21zYiggdGhpcy5tYXhpbXVtICkgLSAyIF07XG4gIHRoaXMubmV4dCA9IHRoaXMuX25leHQ7XG59XG5cbmJpdG1lZGRsZXIucHJvdG90eXBlID0ge1xuXG4gIF9uZXh0OiBmdW5jdGlvbigpXG4gIHtcbiAgICBkbyB7XG4gICAgICB0aGlzLmN1ciA9ICh0aGlzLmN1ciAmIDEpID8gdGhpcy5jdXIgPSAodGhpcy5jdXIgPj4gMSkgXiB0aGlzLk1BU0sgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VyID4+PSAxO1xuICAgIH0gd2hpbGUoIHRoaXMuY3VyID4gdGhpcy5tYXhpbXVtICk7XG5cbiAgICBpZiAoIHRoaXMuY3VyID09PSB0aGlzLnN0YXJ0IClcbiAgICAgIHRoaXMubmV4dCA9IHRoaXMuX2RvbmU7XG5cbiAgICByZXR1cm4gdGhpcy5jdXI7XG4gIH0sXG5cbiAgX2RvbmU6IGZ1bmN0aW9uKClcbiAge1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIHJlc2V0OiBmdW5jdGlvbigpXG4gIHtcbiAgICB0aGlzLm5leHQgPSB0aGlzLl9uZXh0O1xuICAgIHRoaXMuY3VyID0gdGhpcy5zdGFydDtcbiAgfSxcblxuICBhbGw6IGZ1bmN0aW9uKClcbiAge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB2YXIgbyA9IFtdLCB2O1xuICAgIHdoaWxlKHYgPSB0aGlzLm5leHQoKSlcbiAgICAgIG8ucHVzaCh2KTtcbiAgICByZXR1cm4gbztcbiAgfSxcblxuICBfbXNiOiBmdW5jdGlvbih2KVxuICB7XG4gICAgdmFyIHIgPSAwO1xuICAgIHdoaWxlICh2KSB7IHYgPj49MTsgcisrOyB9XG4gICAgcmV0dXJuIHI7XG4gIH1cblxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2JpdC1tZWRkbGVyL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==