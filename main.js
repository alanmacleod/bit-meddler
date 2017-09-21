

'use strict';

module.exports = bitmeddler;

function bitmeddler(maximum, seed)
{

  this.ITSAKINDOFMAGIC = [
    0x3,0x6,0x9,0x1D,0x36,0x69,0xA6, // 2 to 8
    0x17C,0x32D,0x4F2,0xD34,0x1349,0x2532,0x6699,0xD295, // 9 - 16
    0x12933,0x2C93E,0x593CA,0xAFF95,0x12B6BC,0x2E652E,0x5373D6,0x9CCDAE, // etc
    0x12BA74D,0x36CD5A7,0x4E5D793,0xF5CDE95,0x1A4E6FF2,0x29D1E9EB,0x7A5BC2E3,0xB4BCD35C
  ];

  this.maximum = maximum;
  this.start = Math.min(seed || 1, maximum-2);
  this.cur = this.start;
  this.MASK = this.ITSAKINDOFMAGIC[ this._msb( this.maximum ) - 2 ];
  this.done = false;

}

bitmeddler.prototype = {

  next: function()
  {
    if (this.done)
      return null;

    do {
      this.cur = (this.cur & 1) ? this.cur = (this.cur >> 1) ^ this.MASK :
                                  this.cur >>= 1;
    } while( !this._ok( this.cur ) );

    this.done = ( this.cur == this.start );

    return this.cur;
  },

  _msb: function(v)
  {
    let r=0;
    while (v >>= 1) r++;
    return r;
  },

  _ok: function(v)
  {
    return (v >= 1 && v <= this.maximum);
  }

};

let test = new bitmeddler(1000, 1);


do {

  var r = test.next();
  console.log(r);

} while (r != null);
