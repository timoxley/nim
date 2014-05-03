# nim

Commandline convenience tool for inspecting objects, function implementations and listing properties, *with syntax highlighting*!

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

## Installation

```bash
$ npm install -g nim
```

## Usage

### Inspect global variables

```js
$ nim process
{ title: 'node',
  version: 'v0.10.24',
  argv: [ 'node', '/usr/local/bin/nim', 'process' ],
  ... }
```
### Inspect properties

```js
$ nim process.versions
{ http_parser: '1.0',
  node: '0.10.24',
  v8: '3.14.5.9',
  ares: '1.9.0-DEV',
  uv: '0.10.21',
  zlib: '1.2.3',
  modules: '11',
  openssl: '1.0.1e' }
```

### Inspect core modules

```js
$ nim os
{ endianness: [Function],
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
  EOL: '\n' }
```

### Inspect local packages

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
[ [ 'mime',
    'basicAuth',
    'bodyParser',
    ...
    'vhost',
    'createServer',
    'application',
    'request',
    'response',
    'Route',
    'Router' ],
  [] ]
```
```js
$ nim express.vhost
function vhost(hostname, server){
  if (!hostname) throw new Error('vhost hostname required');
  if (!server) throw new Error('vhost server required');
  var regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '\\$&').replace(/[*]/g, '(?:.*?)')  + '$', 'i');
  if (server.onvhost) server.onvhost(hostname);
  return function vhost(req, res, next){
    if (!req.headers.host) return next();
    var host = req.headers.host.split(':')[0];
    if (!regexp.test(host)) return next();
    if ('function' == typeof server) return server(req, res, next);
    server.emit('request', req, res);
  };
}
```

### List available properties

You can list properties of an object by appending a `.` to the name of
the object you want to inspect. This lists all the properties of the
current object and each object in its prototype chain.

```js
$ nim stream.
[ [ 'super_',
    'Readable',
    'Writable',
    'Duplex',
    'Transform',
    'PassThrough',
    'Stream' ],
  [] ]
}
```

### List prototype properties

For example, listing the properties on `stream.prototype`:

```js
$ nim stream .
[ [ 'pipe' ],
  [ 'setMaxListeners',
    'emit',
    'addListener',
    'on',
    'once',
    'removeListener',
    'removeAllListeners',
    'listeners' ] ]
```

The above is a convenience syntax and exactly equivalent to inspecting the prototype with `.` directly:

```js
$ nim stream.prototype.
[ [ 'pipe' ],
  [ 'setMaxListeners',
    ...
    'listeners' ] ]
```


## Why

I often boot up the node repl to simply print out lists of properties or get insight on how things work by logging functions implementations.

This usually looks like:

```js
$ node
> console.log(util.inherits.toString())
function (ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}
> os.
os.__defineGetter__      os.__defineSetter__      os.__lookupGetter__      os.__lookupSetter__      os.constructor           os.hasOwnProperty        os.isPrototypeOf
os.propertyIsEnumerable  os.toLocaleString        os.toString              os.valueOf

os.EOL                   os.arch                  os.cpus                  os.endianness            os.freemem               os.getNetworkInterfaces  os.hostname
os.loadavg               os.networkInterfaces     os.platform              os.release               os.tmpDir                os.tmpdir                os.totalmem
os.type                  os.uptime
```

`nim` is a simple wrapper around these commands.

## TODO

* Better formatting for property listings. **Make more like obj.<TAB> completion in repl.**
* Add tests.
* More intuitive syntax for telling nim to list properties?
* Opt in (or out) of printing a flattened property list (i.e. do not display which level of the prototype hierarchy a property is implemented on)
* Maybe support running against a custom scope from inside a paused execution context saved to disk?

## License

MIT
