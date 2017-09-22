var bitmeddler = require('./main')

function bm(size)
{
    var bm = new bitmeddler(size);
    var next;

    while (next) next = bm.next();
}

function naive(size)
{
    var ary = [];
    var i = 1;
    var next, rand;

    while (size >= i) ary.push(i++);

    while (size--)
    {
        rand = Math.floor(Math.random() * ary.length);
        next = ary.splice(rand, 1)[0];
    }
}

console.time('bm');
bm(10000);
console.timeEnd('bm');

console.time('naive');
naive(10000);
console.timeEnd('naive');
