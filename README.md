### Status
[![Build Status](https://travis-ci.org/jldupont/js-uri-toolkit.svg?branch=master)](https://travis-ci.org/jldupont/js-uri-toolkit)

# js-uri-toolkit
Lightweight URI manipulation in Javascript

# Usage
## Parsing a URI

```javascript
	var uri = "HTTP://user:pass@domain.com:6666/somepath?key1=value1&key2=value2#somehash?invalidqs";
	
	var p = uri.parse(uri);
	
	should.equal(p.scheme, 'http');
	should.equal(p.port,   6666);
	should.equal(p.hash,   'somehash');
	should.equal(p.qs,     'key1=value1&key2=value2');
	...
```

## Building a URI

```javascript
	var uri_parts = {
		scheme: 'http'
		,host: 'domain.com'
		,username: 'user'
		,password: 'pwd'
		,port: 6666
		,path: 'somepath'
		,query: {
			 key1: 9999
			,key2: 'xyz'
		}
		,hash: 'fragment'
	};
	
	var result = uri.build(uri_parts);
	
	should.equal(result, 'http://user:pwd@domain.com:6666/?key1=9999&key2=xyz#fragment', 'Got: ' + result);
```

# Status
Work in progress
