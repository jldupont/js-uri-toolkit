/*
 * jsrbac test cases
 * 
 * @author: jldupont
 */

var should = require('should');

var jsrbac = require("../js-uri-toolkit.js");

var uri0 = "HTTP://domain.com/";
var uri1 = "HTTP://user:pass@domain.com:6666/somepath?key1=value1&key2=value2#somehash";
var uri2 = "HTTP://user:pass@domain.com:6666/somepath?key1=value1&key2=value2";
var uri3 = "HTTP://domain.com:6666/somepath?key1=value1&key2=value2";
var uri4 = "HTTP://domain.com:6666?key1=value1&key2=value2";
var uri5 = "HTTP://domain.com:6666#somehash";

var uri10 = "HTTP://user:pass@domain.com:6666/somepath?key1=value1&key2=value2#somehash?invalidqs";


// ----------------------------------------------------------------- TESTS - parsing

it('HTTP should be the scheme', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.scheme, 'http');
});

it('Check port 1', function(){
	
	var p = uri.parse(uri0);
	
	should.equal(p.port, null);
});

it('Check port 2', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.port, 6666);
});

it('Username and Password', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.username, 'user');
	should.equal(p.password, 'pass');
});

it('No Username and Password', function(){
	
	var p = uri.parse(uri3);
	
	should.equal(p.username, '', 'Expected no username, got: '+p.username);
	should.equal(p.password, '', 'Expected no password');
});

it('No Username and Password - simple URI', function(){
	
	var p = uri.parse(uri0);
	
	should.equal(p.username, '');
	should.equal(p.password, '');
});

it('Port field present', function(){
	
	var p = uri.parse(uri4);
	
	should.equal(p.port, 6666);
});

it('hostname is valid - test 1', function(){
	
	var p = uri.parse(uri0);
	
	should.equal(p.host, 'domain.com');
});

it('hostname is valid - test 2', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.host, 'domain.com');
});

it('hostname is valid - test 3', function(){
	
	var p = uri.parse(uri2);
	
	should.equal(p.host, 'domain.com');
});

it('hostname is valid - test 4', function(){
	
	var p = uri.parse(uri3);
	
	should.equal(p.host, 'domain.com');
});

it('hostname is valid - test 5', function(){
	
	var p = uri.parse(uri4);
	
	should.equal(p.host, 'domain.com');
});

it('hostname is valid - test 6', function(){
	
	var p = uri.parse(uri5);
	
	should.equal(p.host, 'domain.com');
});


it('Check Hash', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.hash, 'somehash');
});


it('No Hash - simple uri', function(){
	
	var p = uri.parse(uri0);
	
	should.equal(p.hash, '');
});

it('No Hash', function(){
	
	var p = uri.parse(uri2);
	
	should.equal(p.hash, '');
});


it('With invalid qs', function(){
	
	var p = uri.parse(uri10);
	
	should.equal(p.hash, 'somehash');
});

it('With invalid qs and a valid one', function(){
	
	var p = uri.parse(uri10);
	
	should.equal(p.hash, 'somehash');
	should.equal(p.qs,   'key1=value1&key2=value2');
});

//----------------------------------------------------------------- TESTS - building

it('Build a simple URI - 1', function(){
	
	var uri_parts = {
		host: 'domain.com'
	};
	
	var result = uri.build(uri_parts);
	
	should.equal(result, 'http://domain.com/', 'Got: ' + result);
});

it('Build a simple URI - 2', function(){
	
	var uri_parts = {
		host: 'domain.com'
		,hash: "fragment"
	};
	
	var result = uri.build(uri_parts);
	
	should.equal(result, 'http://domain.com/#fragment', 'Got: ' + result);
});

it('Build a complex URI - 1', function(){
	
	var uri_parts = {
		scheme: 'http'
		,host: 'domain.com'
		,username: 'user'
		,password: 'pwd'
		,port: 6666
		,path: 'somepath'
		,query: {
			key: 9999 
		}
		,hash: 'fragment'
	};
	
	var result = uri.build(uri_parts);
	
	should.equal(result, 'http://user:pwd@domain.com:6666/?key=9999#fragment', 'Got: ' + result);
});

it('Build a complex URI - 2', function(){
	
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
});
