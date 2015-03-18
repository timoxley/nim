var REPL = require("repl");

module.exports = function(args, options) {
  var repl = REPL.start({
    prompt: "nim> ",
    input: process.stdin,
    output: process.stdout,
    writer: writer,
    eval: evalNim
  });

  var nim = require('../')

  function evalNim(cmd, context, filename, callback) {
    nim(cmd.split(' '), options, callback)
  }

  function writer(content) {
    return content
  }
}
