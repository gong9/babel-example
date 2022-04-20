const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types')
const template =require('@babel/template')

/**
 * 删除代码中的console
 * ! ast 节点节点的增加
 */


const sourceCode = `
console.log(1);

function func() {
   console.info(2);
}

export default class Clazz {
    say() {
        console.debug(3);
      }
      render() {
        return <div>{console.error(4)}</div>
      }
 }`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
});
const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

traverse(ast, {
    CallExpression(path, state) {
        // 找到目标，进行节点删除
        if (path.node.isNew) return

        const calleeName = generate(path.node.callee).code;
        if (targetCalleeName.includes(calleeName)) {
            const newNode = template.expression(`console.log("这是我刚加进去的")`)();
            newNode.isNew = true;
            if (path.findParent(path => path.isJSXElement())) {
                path.replaceWith(types.arrayExpression([newNode, path.node]))
                path.skip();
            } else {
                path.insertBefore(newNode);
            }
        }
    }
});

const {
    code,
    map
} = generate(ast);

console.log(code);