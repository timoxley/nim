#!/usr/bin/env node

// warning: hacky code below

var args = process.argv.slice(2)
var vm = require('vm')
var debug = require('debug')('nimp')

var highlight = require('ansi-highlight')
var inspect = require('util').inspect
global.require = require

code = args.join(' ')
if (!code) {
  code = 'global.' // default = list global properties
}

code = code.trim()
code = code.replace(/ /gmi, '.prototype.') // Function protoMethod syntax.
var parts = code.split('.')
parts[0] = [
  '(function get(part0) {',
    'if (typeof global[part0] !== "undefined") return global[part0]',
    'return require(part0)',
  '})("'+parts[0]+'")'
].join('\n')
code = parts.join('.')

// array of arrays of keys. walks up proto chain
function protokeys(obj) {
  var keys = [];
  while (obj && obj !== Object.prototype) {
    keys.push(Object.keys(obj));
    obj = obj.__proto__;
  }
  return keys;
}

try {
  var listKeys = code[code.length - 1] === '.'
  if (listKeys) {
    code = code.replace(/\.+$/m, '') // remove trailing .
  }

  code = 'global.$$item = ' + code + ';'
  vm.runInThisContext(code)
  var item = $$item
  delete global.$$item

  if (listKeys) item = protokeys(item)

  console.info(highlight(getString(item)))

} catch(err) {
  console.error(err.message)
  debug('\n', highlight(code))
  process.exit(1)
}

function getString(item) {
  var str = (typeof item === "function")
  ?  item.toString()
  : inspect(item, {depth: 30}) // 30 depth should be enough for anyone!
  return str
}
