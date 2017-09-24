var bitmeddler = require('./main')


var range = process.argv[2] || 10000;

// bitmeddler setup
var bmed = new bitmeddler(range);

// naive setup
var naive_ary = [];
var naive_i = 1;
var naive_next, naive_rand;
var naive_size = range;
while (naive_size >= naive_i) naive_ary.push(naive_i++);


function bm(bm_size)
{
    var bm_next = 1;
    while (bm_next)
      bm_next = bmed.next();
}


function naive(naive_size)
{

  while (naive_size--)
  {
      naive_rand = Math.floor(Math.random() * naive_ary.length);
      naive_next = naive_ary.splice(naive_rand, 1)[0];
  }
}

console.time('bm');
bm(range);
console.timeEnd('bm');

console.time('naive');
naive(range);
console.timeEnd('naive');
