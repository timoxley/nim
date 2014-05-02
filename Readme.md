# nim

Convenience utility to print function implementations and list
properties available on objects & prototypes.

```bash
> nim
```

## Installation

```bash
> npm install -g nim
```

## Usage

### Inspect global variables

```bash
> nim process
{ title: 'node',
  version: 'v0.10.24',
  moduleLoadList:
   [ 'Binding evals',
     'Binding natives',
    ...
    etc

>
```
### Inspect properties

```bash
> nim process.versions
{ http_parser: '1.0',
  node: '0.10.24',
  v8: '3.14.5.9',
  ares: '1.9.0-DEV',
  uv: '0.10.21',
  zlib: '1.2.3',
  modules: '11',
  openssl: '1.0.1e' }
>
```

### Inspect core modules

```bash
> nim os
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

>
```

### Inspect local packages

Express's default export is the `createApplication` function.

```bash
> nim express
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

>
```

### List available properties

You can list properties of an object by appending a `.` to the name of
the object you want to inspect. This lists all the properties of the
current object and each object in its prototype chain.

```bash
> nim stream
function Stream() {
  EE.call(this);
}

> nim stream.
[ [ 'super_',
    'Readable',
    'Writable',
    'Duplex',
    'Transform',
    'PassThrough',
    'Stream' ],
  [] ]
}

>
```

### List prototype properties

The default export for `stream` is a constructor.
List the properties on `stream.prototype` with `stream .`:

```bash
> nim stream .
[ [ 'pipe' ],
  [ 'setMaxListeners',
    'emit',
    'addListener',
    'on',
    'once',
    'removeListener',
    'removeAllListeners',
    'listeners' ] ]

> nim stream.prototype. # equivalent to the above
[ [ 'pipe' ],
  [ 'setMaxListeners',
    'emit',
    'addListener',
    'on',
    'once',
    'removeListener',
    'removeAllListeners',
    'listeners' ] ]

>
```

## TODO

* Better formatting for property listings. Make more like completion in repl.
* Add tests.
* More intuitive syntax for telling nim to list properties?
* Opt in (or out) of printing a flattened property list (i.e. do not display which level of the prototype hierarchy a property is implemented on)
* Maybe support running against a custom scope from inside a paused execution context saved to disk?

## License

MIT
