

const MASK = 0x60; // 7-bit, 128 vals

let seq = 1;
let i = seq;
let limiter=0;

let arr = new Array(128);

for(;;)
{
  arr[seq] = 1;

  if (seq & 1)
    seq = (seq >> 1) ^ MASK;
  else
    seq >>=1;

  if (seq == i)
    break;

}

let s = "";
for(let e of arr)
  s+=`${e} `;

console.log(s);
