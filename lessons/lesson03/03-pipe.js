import chalk from 'chalk';

const envars = {
    PORT: 3000,
    KEY: 'value'
}

// Делаем билдер запуска node CLI
console.log(
    chalk.dim(
        `$ ${Object.keys(envars)
            .map(envar => `${envar}=${envars[envar]}`)
            .join(' ')
        }`,
        'node',
        process.argv.join(' ')
    )
);