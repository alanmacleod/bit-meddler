'use strict';

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
