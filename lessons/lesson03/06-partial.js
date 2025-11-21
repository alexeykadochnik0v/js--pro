const otusPrefix = partial(addPrefix, "otus");

console.log(otusPrefix("student")); // "otus_student"
console.log(otusPrefix("course")); // "otus_course"

const partial =
  (fn, ...fixedArgs) =>
  (...remainingArgs) =>
    fn(...fixedArgs, ...remainingArgs);
