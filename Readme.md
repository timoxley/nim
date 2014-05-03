# nim

Commandline convenience tool for inspecting objects, function implementations and listing properties.

```bash
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

```bash
$ nim process
{ title: 'node',
  version: 'v0.10.24',
  moduleLoadList:
   [ 'Binding evals',
     'Binding natives',
    ...
   ]
  etc
```
### Inspect properties

```bash
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

```bash
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

Express's default export is the `createApplication` function.

```bash
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

### List available properties

You can list properties of an object by appending a `.` to the name of
the object you want to inspect. This lists all the properties of the
current object and each object in its prototype chain.

```bash
$ nim stream
function Stream() {
  EE.call(this);
}

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

The default export for `stream` is a constructor.
List the properties on `stream.prototype` with `stream .`:

```bash
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

$ nim stream.prototype. # equivalent to the above
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


## Why

I often boot up the node repl to simply print out lists of properties or get insight on how things work by logging functions implementations.

This usually looks like:

```bash
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
