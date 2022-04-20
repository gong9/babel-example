const {
    transformFromAstSync
} = require('@babel/core');
const parser = require('@babel/parser');
const prettier = require('prettier')
const compressPlugin = require('./plugin/compress');

let sourceCode = `
    function func() {
        const num1 = 1
        const num2 = 2
        const num3 = add(1, 2)
        const num4 = add(3, 4)
        console.log(num2)
        return num2
        console.log(num1)
        function add (aaa, bbb) {
            return aaa + bbb
        }
    }
    func()
`;

// sourceCode = prettier.format(sourceCode, {
//     semi: true,
//     parser: "babel"
// });

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    comments: true
});

const {
    code
} = transformFromAstSync(ast, sourceCode, {
    plugins: [
        [compressPlugin]
    ],
    generatorOpts: {
        comments: true,
        compact: true
    }
});
console.log(code);