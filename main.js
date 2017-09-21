
'use strict';

module.exports = meddler;

function meddler(maximum, start)
{
  this.MASKS = [
    0x3,0x6,0x9,0x1D,0x36,0x69,0xA6, // 2 to 8
    0x17C,0x32D,0x4F2,0xD34,0x1349,0x2532,0x6699,0xD295, // 9 - 16
    0x12933,0x2C93E,0x593CA,0xAFF95,0x12B6BC,0x2E652E,0x5373D6,0x9CCDAE, // etc
    0x12BA74D,0x36CD5A7,0x4E5D793,0xF5CDE95,0x1A4E6FF2,0x29D1E9EB,0x7A5BC2E3,0xB4BCD35C
  ];

  this.maximum = maximum;
  this.start = start || 1;
  this.cur = this.start;
  this.MASK = this.MASKS[ this._msb( this.maximum ) - 2 ];
}


meddler.prototype = {

  next: function()
  {
    this.cur = (this.cur & 1) ? this.cur = (this.cur >> 1) ^ this.MASK :
                                this.cur >>= 1;
    if ( this.cur == this.start )
      return null;
    else
      return this.cur;
  },

  _msb: function(v)
  {
    let r=0;
    while (v >>= 1) r++;
    return r;
  }

};


let test = new meddler(255);


do {
  var r = test.next();
  console.log(r);
} while (r != null);

//
// process.exit();
//
// const MASKS3 = [
// ];
//
// let bits = 16;
//
// const MASK = MASKS3[bits - 2];
//
// // Initial value
// let seq = i = 1;
// let arr = [0];
//
// do
// {
//   arr[seq] = arr[seq] == undefined ? arr[seq] = 1 : arr[seq]++;
//   seq = (seq & 1) ? seq = (seq >> 1) ^ MASK : seq >>= 1
//
//   console.log(seq);
//
// } while (seq != i);
//
//
// // Test output
// let s = "";
// for(let e of arr)
//   s+=`${e} `;
//
// console.log(s);
//
//
// // for (let i=0; i<MASKS2.length; i++)
// // {
// //   let m = msb(MASKS2[i]);
// //   console.log(
// //     MASKS2[i] << (i - m + 1)
// //   );
// //
// // }
