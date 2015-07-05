/*
 * jsrbac test cases
 * 
 * @author: jldupont
 */

var should = require('should');

var jsrbac = require("../js-uri-toolkit.js");

var uri1 = "HTTP://user:pass@domain.com:6666/somepath?key1=value1&key2=value2#somehash";
var uri2 = "HTTP://user:pass@domain.com:6666/somepath?key1=value1&key2=value2";
var uri3 = "HTTP://domain.com:6666/somepath?key1=value1&key2=value2";


// ----------------------------------------------------------------- TESTS

it('HTTP should be the scheme', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.scheme, 'http');
});

it('Check Hash', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.hash, 'somehash');
});

it('No Hash', function(){
	
	var p = uri.parse(uri2);
	
	should.equal(p.hash, '');
});

it('Username and Password', function(){
	
	var p = uri.parse(uri1);
	
	should.equal(p.username, 'user');
	should.equal(p.password, 'pass');
});

it('No Username and Password', function(){
	
	var p = uri.parse(uri3);
	
	should.equal(p.username, '');
	should.equal(p.password, '');
});
