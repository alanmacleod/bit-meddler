

// Magic XOR number for 7-bit. 128 vals
// const MASK = [];
const MASK = 0x60;

const MASKS = [ 0x0110, 0x0240, 0x0500, 0x0CA0,
            0x1B00, 0x3500, 0x6000, 0xB400 ];

const MASKS2 = [ 0x03,0x06,0x0C,0x14,0x30,0x60,0xB8,
                 0x11,0x24,0x50,0xCA,0x1B,0x35,0x60,0xB4,
                 0x12,0x20,0x72,0x90,0x14,0x30,0x40,0xD8,
                 0x12,0x2


              ];

//
// // Initial value
// let seq = i = 1;
// let arr = [0];
//
// do
// {
//
//   arr[seq] = 1;
//   seq = (seq & 1) ? seq = (seq >> 1) ^ MASK : seq >>= 1
//
// } while (seq != i);
//
//
// // Test output
// let s = "";
// for(let e of arr)
//   s+=`${e} `;
//


for (let i=0; i<MASKS2.length; i++)
{
  let m = msb(MASKS2[i]);
  console.log(
    MASKS2[i] << (i - m + 1)
  );

}

function msb(v)
{
  let r=0;
  while (v >>= 1) r++;
  return r;
}
