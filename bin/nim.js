#!/usr/bin/env node

var nim = require('../')

var program = require('commander')
var pkg = require('../package.json')

program
.version(pkg.version)
.option('--color', 'Coloured output', true)
.option('--repl', 'Start a REPL', false)
.on('--help', function(){
  console.log([
    '  Examples:',
    '',
    '  nim                       - List Global Properties',
    '  nim process               - Inspect Global Properties',
    '  nim os                    - Inspect Core Modules',
    '  nim process.versions      - Inspect Properties',
    '  nim express               - Inspect Local Packages',
    '  nim "crypto.getCiphers()" - Inspect Simple Function Calls',
    '  nim stream.               - List Available Properties',
    '  nim stream .              - List Prototype Properties',
  ].join('\n'))
})
.parse(process.argv)

var options = {
  cwd: process.cwd(),
  color: program.color
}

if (program.repl) {
  return require('./repl')(program.args, options)
}

nim(program.args, options, function(err, txt) {
  if (err) return error(err)
  console.info(txt)
})

function error(err) {
  console.error(err.message)
  process.exit(1)
}
