

// Magic XOR number for 7-bit. 128 vals
const MASK = 0x60;

// Initial value
let seq = i = 1;
let arr = [0];

do
{

  arr[seq] = 1;
  seq = (seq & 1) ? seq = (seq >> 1) ^ MASK : seq >>= 1

} while (seq != i);


// Test output
let s = "";
for(let e of arr)
  s+=`${e} `;

console.log(s);
