const memo = (fn, cache = new Map) => {
    return param => {
        console.log(cache);
        console.log(param, `Has cache ${cache.has(param)}`);

        if (!cache.has(param)) {
            cache.set(param, fn(param))
        }

        return cache.get(param)
    }
}

//
const f = memo((x) => x * Math.sin(1 / x))

f(0.314);
f(0.314);