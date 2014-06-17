#!/usr/bin/env node

var nim = require('../')

var program = require('commander')

program
.option('--color', 'Coloured output', true)
.parse(process.argv)

var options = {
  cwd: process.cwd(),
  color: program.color
}

nim(program.args, options, function(err, txt) {
  if (err) return error(err)
  console.info(txt)
})

function error(err) {
  console.error(err.message)
  process.exit(1)
}
