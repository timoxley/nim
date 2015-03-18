#!/usr/bin/env node

"use strict"

// warning: hacky code below
var join = require('path').join
var vm = require('vm')
var repl = require('repl')

var findup = require('findup')

var _inspect = require('util').inspect
var inspect = function() {
  return _inspect.apply(this, arguments)
        .replace(/^{ /,'{\n  ' )
        .replace(/ }$/,'\n}')
        .replace(/^\[ /,'[\n  ' )
        .replace(/ \]$/,'\n]')
}
var highlight = require('ansi-highlight')

var debug = require('debug')('nim')

module.exports = function nim(args, options, fn) {
  var options = options || {}

  var cwd = options.cwd || process.cwd()
  var color = options.color !== undefined ? options.color : true
  var hl = color ? highlight : function(str) {return str}

  global.require = require

  var code = args.join(' ')
  if (!code) {
    code = 'global.' // default = list global properties
  }

  code = code.trim()
  var input = code
  code = code.replace(/ /gmi, '.prototype.') // Function protoMethod syntax.
  var parts = code.split('.')
  parts[0] = [
    '(function get(part0) {',
      'if (typeof global[part0] !== "undefined") return global[part0]',
      'return require(part0)',
    '})("'+parts[0]+'")'
  ].join(';\n')
  code = parts.join('.')

  nodeModulesPaths(cwd, function(err, dirs) {
    try {
      if (err) throw err
      var listKeys = code[code.length - 1] === '.'
      if (listKeys) {
        code = code.replace(/\.+$/m, '') // remove trailing .
        input = input.replace(/\.+$/m, '')
      }
      module.paths = module.paths.concat(dirs)
      vm.runInThisContext('global.$$item = ' + code + ';')
      module.paths.pop()
      var item = $$item
      delete global.$$item

      if (listKeys) return fn(null, renderProtoKeys(input, protokeys(item)))

      fn(null, hl(getString(item)))

    } catch(err) {
      debug('error', err && err.message || err)
      debug('\n', hl(code))
      return fn(err)
    }
  })

  // array of arrays of keys. walks up proto chain
  function protokeys(obj) {
    if (obj === global) loadBuiltIns()
    var keys = []
    while (obj) {
      keys.push(Object.getOwnPropertyNames(obj))
      obj = Object.getPrototypeOf(obj)
    }
    return keys
  }

  function renderProtoKeys(name, keys) {
    name = name.replace(/ $/, '.prototype')
    return '\n' + keys.reverse().reduce(function(lines, protoKeys) {
      return lines.concat(protoKeys.map(function(k) {
        return name + '.' + hl(k)
      }).join('\n'))
    }, []).join('\n\n')
  }
}

function getString(item) {
  var str = (typeof item === "function")
  ?  item.toString()
  : inspect(item, {depth: 30}) // 30 depth should be enough for anyone
  return str
}

function loadBuiltIns() {
  var builtIns = repl._builtinLibs
  builtIns.forEach(function(builtIn) {
    global[builtIn] = require(builtIn)
  })
}

function nodeModulesPaths(cwd, fn) {
  var results = []
  function noop() {}
  var finder = new findup.FindUp(cwd, 'package.json')
  .once('found', function(dir) {
    results.push(join(dir, 'node_modules'))
  })
  .once('end', function() {
    fn(null, results)
    fn = noop
  })
  .once('error', function(err) {
    fn(err)
    fn = noop
  })
}
