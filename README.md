# proevn-webpack-plugin

modify some environment variables in the webpack,s compilation process

# example

``` javascript
// webpack.prod.conf.js
var proevn = require('./proevn-webpack-plugin')
plugins: [
    new proevn({
      target: path.join(__dirname, '../src/config.js')
    })
]
```

``` javascript
// conf.js
var EVN = 'sit'
var TEST = 'aaa'
export {
  EVN,
  TEST
}
```

``` javascript
// package.json
"scripts": {  
    "build": "node build/build.js --EVN pro"
}
```

``` javascript
$ npm run dev
// or
$ npm run dev -- --TEST sit
//or 
$ node build/build.js --TEST sit
```

###berfor webpack compiler.plugin('after-emit') 
``` javascript
// conf.js
var EVN = 'pro'
var TEST = 'sit'
export {
  EVN,
  TEST
}
```

###after webpack compiler.plugin('after-emit') 
``` javascript
// conf.js
var EVN = 'sit'
var TEST = 'aaa'
export {
  EVN,
  TEST
}
```


# install

With [npm](https://npmjs.org) do:

```
npm install 'proevn-webpack-plugin
```

# license

MIT
