# nim

Node.js command-line tool for inspecting objects, function implementations and listing properties, *with syntax highlighting*.

## Why

If you're like me, you regularly boot up node's REPL just to explore
objects or gain insight on how things work by logging function
implementations. `nim` is a slightly more convenient way of doing this.

```js
$ nim path.join
function () {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(paths.filter(function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}
```

![nim](https://cloud.githubusercontent.com/assets/43438/2869888/1298f88c-d29a-11e3-8e15-8e1b692c121f.gif)

## Installation

```bash
$ npm install -g nim
```

## Usage

```
Usage: nim [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    --color        Coloured output
    --repl         Start a REPL

  Examples:

  nim                       - List Global Properties
  nim process               - Inspect Global Properties
  nim os                    - Inspect Core Modules
  nim process.versions      - Inspect Properties
  nim express               - Inspect Local Packages
  nim "crypto.getCiphers()" - Inspect Simple Function Calls
  nim stream.               - List Available Properties
  nim stream .              - List Prototype Properties
```

### Inspect Global Variables

```js
$ nim process
{
  title: 'node',
  version: 'v0.10.24',
  argv: [ 'node', '/usr/local/bin/nim', 'process' ],
  ...
}
```
### Inspect Properties

```js
$ nim process.versions
{
  http_parser: '1.0',
  node: '0.10.29',
  v8: '3.14.5.9',
  ares: '1.9.0-DEV',
  uv: '0.10.27',
  zlib: '1.2.3',
  modules: '11',
  openssl: '1.0.1h'
}
```

### Inspect Core Modules

```js
$ nim os
{
  endianness: [Function],
  hostname: [Function],
  loadavg: [Function],
  uptime: [Function],
  freemem: [Function],
  totalmem: [Function],
  cpus: [Function],
  type: [Function],
  release: [Function],
  networkInterfaces: [Function],
  arch: [Function],
  platform: [Function],
  tmpdir: [Function],
  tmpDir: [Function],
  getNetworkInterfaces: [Function: deprecated],
  EOL: '\n'
}
```

### Inspect Local Packages

`nim` will try load the appropriate package using regular local package resolution.

```js
$ nim express
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, proto);
  mixin(app, EventEmitter.prototype);

  app.request = { __proto__: req, app: app };
  app.response = { __proto__: res, app: app };
  app.init();
  return app;
}
```
```js
$ nim express.

nim express.

express.constructor
express.toString
express.toLocaleString
express.valueOf
express.hasOwnProperty
express.isPrototypeOf
express.propertyIsEnumerable
express.__defineGetter__
express.__lookupGetter__
express.__defineSetter__
express.__lookupSetter__

express.length
express.name
express.arguments
express.caller
express.constructor
express.bind
express.toString
express.call
express.apply

express.length
express.name
express.arguments
express.caller
express.prototype
express.application
express.request
express.response
express.Route
express.Router
express.query
express.static
express.json
express.urlencoded
express.bodyParser
express.compress
express.cookieSession
express.session
express.logger
express.cookieParser
express.favicon
express.responseTime
express.errorHandler
express.timeout
express.methodOverride
express.vhost
express.csrf
express.directory
express.limit
express.multipart
express.staticCache
```

### Inspect Simple Function Calls

Remember to escape parens or wrap the expression in quotes.

```js
$ nim "crypto.getCiphers()"
[
  'CAST-cbc',
  'aes-128-cbc',
  'aes-128-cbc-hmac-sha1',
  ...
  'seed-cfb',
  'seed-ecb',
  'seed-ofb'
]
```

This is similar to the result you'd get from `node -p "require('crypto').getCiphers()"` with added syntax highlighting.

### List Available Properties

You can list properties of an object by appending a `.` to the name of
the object you want to inspect. This lists all the properties of the
current object and each object in its prototype chain.

```js
$ nim stream.

stream.constructor
stream.toString
stream.toLocaleString
stream.valueOf
stream.hasOwnProperty
stream.isPrototypeOf
stream.propertyIsEnumerable
stream.__defineGetter__
stream.__lookupGetter__
stream.__defineSetter__
stream.__lookupSetter__

stream.length
stream.name
stream.arguments
stream.caller
stream.constructor
stream.bind
stream.toString
stream.call
stream.apply

stream.length
stream.name
stream.arguments
stream.caller
stream.prototype
stream.super_
stream.Readable
stream.Writable
stream.Duplex
stream.Transform
stream.PassThrough
stream.Stream
```

### List Prototype Properties

For example, listing the properties on `stream.prototype`:

```js
$ nim stream .
stream.prototype.constructor
stream.prototype.toString
stream.prototype.toLocaleString
stream.prototype.valueOf
stream.prototype.hasOwnProperty
stream.prototype.isPrototypeOf
stream.prototype.propertyIsEnumerable
stream.prototype.__defineGetter__
stream.prototype.__lookupGetter__
stream.prototype.__defineSetter__
stream.prototype.__lookupSetter__

stream.prototype.constructor
stream.prototype.setMaxListeners
stream.prototype.emit
stream.prototype.addListener
stream.prototype.on
stream.prototype.once
stream.prototype.removeListener
stream.prototype.removeAllListeners
stream.prototype.listeners

stream.prototype.constructor
stream.prototype.pipe
```

The above is a convenience syntax and exactly equivalent to inspecting the prototype with `.` directly:

```js
$ nim stream.prototype.

stream.prototype.constructor
stream.prototype.toString
stream.prototype.toLocaleString
stream.prototype.valueOf
stream.prototype.hasOwnProperty
stream.prototype.isPrototypeOf
stream.prototype.propertyIsEnumerable
stream.prototype.__defineGetter__
stream.prototype.__lookupGetter__
stream.prototype.__defineSetter__
stream.prototype.__lookupSetter__

stream.prototype.constructor
stream.prototype.setMaxListeners
stream.prototype.emit
stream.prototype.addListener
stream.prototype.on
stream.prototype.once
stream.prototype.removeListener
stream.prototype.removeAllListeners
stream.prototype.listeners

stream.prototype.constructor
stream.prototype.pipe
```

### Pagination

Sometimes `nim`'s output can be many screenfuls. Feel free to pipe `nim` through your pager of choice:

e.g.

```js
$ nim crypto | less
```

If your pager is having trouble displaying colorcodes, pass it the `-r` flag:

```js
$ nim crypto | less -r
$ nim crypto | more -r
```

### REPL

Save on keystrokes when issuing multiple `nim` commands!

```
$ nim --repl
nim> path
{
  resolve: [Function],
  normalize: [Function],
  join: [Function],
  relative: [Function],
  sep: '/',
  delimiter: ':',
  dirname: [Function],
  basename: [Function],
  extname: [Function],
  exists: [Function: deprecated],
  existsSync: [Function: deprecated],
  _makeLong: [Function]
}
nim> url
{
  parse: [Function: urlParse],
  resolve: [Function: urlResolve],
  resolveObject: [Function: urlResolveObject],
  format: [Function: urlFormat],
  Url: [Function: Url]
}
nim>
```

## TODO

* --Better formatting for property listings. **Make more like obj.<TAB> completion in repl.**--
* Add tests.
* Auto-completion on `.`.
* More intuitive syntax for telling nim to list properties?
* Opt in (or out) of printing a flattened property list (i.e. do not display which level of the prototype hierarchy a property is implemented on)
* Maybe support running against a custom scope from inside a paused execution context saved to disk?

## License

MIT
