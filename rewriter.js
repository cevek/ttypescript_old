module.exports = function (ts) {
    var esprima = require('esprima');
    var escodegen = require('escodegen');
    var origEmit = ts.emitFiles.toString();
    var emitAst = esprima.parse(origEmit);

    function walkStack(ast, fn) {
        var stack = [ast], i, j, key, len, node, child, subchild
        for (i = 0; i < stack.length; i += 1) {
            node = stack[i]
            fn(node)
            for (key in node) {
                if (key !== 'parent') {
                    child = node[key]
                    if (child instanceof Array) {
                        for (j = 0, len = child.length; j < len; j += 1) {
                            subchild = child[j]
                            subchild.parent = child
                            subchild.parentKey = j
                            stack.push(subchild)
                        }
                    } else if (child != void 0 && typeof child.type === 'string') {
                        child.parent = node
                        child.parentKey = key
                        stack.push(child)
                    }
                }
            }
        }
    }

// var emitAst = esprima.parse('function hello(){function emitAsyncFunctionBodyForES6(){return "@#$#@$"}}');
    walkStack(emitAst, (node)=> {
        if (node.type == 'FunctionDeclaration') {
            if (node.id.name == 'emitAsyncFunctionBodyForES6') {
                node.parent[node.parentKey] = esprima.parse('function emitAsyncFunctionBodyForES6(){write("{console.log(123);}")}').body[0];
                console.log("Replaced");
            }
        }
    })

    var newEmit = escodegen.generate(emitAst);
// console.log(newEmit);
    ts.emitFiles = eval(`(${newEmit})`);
}
