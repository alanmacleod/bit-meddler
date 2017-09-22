
import test from 'ava';

let bitmeddler = require('./main');

test('input range (1)', t => {
  try {
    let m = new bitmeddler(-1);
    t.fail();
   } catch (e) {
    // console.log(e);
    t.pass();
   }
});

test('input range (2)', t => {
  try {
    let m = new bitmeddler(1);
    t.fail();
   } catch (e) {
    // console.log(e);
    t.pass();
   }
});


// Should return NULL after all numbers in range have been returned
test('completion signal', t => {

  let max = 5000;
  let loop_safe = 0;
  let m = new bitmeddler(max);

  for(;;)
  {
    if (m.next() == null)
    {
      t.pass(); // finished
      break;
    }

    if (loop_safe++ > max)
    {
      t.fail(); // looks like we spilled over, oops
      break;
    }

  }
});


test('touch all numbers once (1)', t => {

  let m = new bitmeddler(5000);
  let arr = [1];

  for(;;)
  {
    let n = m.next();
    if (n == null) break;
    arr[n] = (arr[n] == undefined) ? 1 : arr[n] + 1;
  }

  for (let i of arr)
    t.is(i, 1);

});


// with seed
test('touch all numbers once (2)', t => {

  let m = new bitmeddler(5000, 499);
  let arr = [1];

  for(;;)
  {
    let n = m.next();
    if (n == null) break;
    arr[n] = (arr[n] == undefined) ? 1 : arr[n] + 1;
  }

  for (let i of arr)
    t.is(i, 1);

});
