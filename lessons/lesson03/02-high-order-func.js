function greet(name) {
    return `Hello, ${name}!`;
}

function processUser(name, callback) {
    // callback — это функция, переданная как аргумент
    return callback(name);
}

console.log(processUser("Alice", greet)); // Hello, Alice!

function makeMultiplier(multiplier) {
    return function (x) {
        return x * multiplier;
    };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Самый основной пример, когда мы хотим сделать lazy создани функции.

async function createConfigBuilder(env) {
    return () => {
        // await к secretManager

        return {
            port: env.PORT
        }
    }
}

const configBuilder = createConfigBuilder({ PORT: 3000 });
const config = configBuilder();