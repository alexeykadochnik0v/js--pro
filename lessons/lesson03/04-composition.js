// left-to-right: pipe(one, two, three)(x) === three(two(one(x)))
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

// right-to-left: compose(three, two, one)(x) === three(two(one(x)))
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);

const one = (x) => x + 1;
const two = (x) => x * 2;
const three = (x) => `#${x}`;

console.log(three(two(one(5)))); // "#12"
console.log(pipe(one, two, three)(5)); // "#12"
console.log(compose(three, two, one)(5)); // "#12"
