/**
 * Simple URI manipulation library in Javascript
 * 
 * @author: jldupont
 * 
 * According to https://en.wikipedia.org/wiki/URI_scheme 
 * 
 *   <scheme name> : <hierarchical part> [ ? <query> ] [ # <fragment> ]
 *   
 *   /over/there/index.dtb?type=animal&name=narwhal#nose?not_common
 *   
 *   foo://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose?not_common
 *   foo://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose
 *   foo://username:password@example.com:8042?type=animal&name=narwhal#nose
 *   foo://username:password@example.com:8042?type=animal&name=narwhal
 *   foo://username:password@example.com:8042#nose
 *   foo://username:password@example.com:8042/#nose
 *   foo://username:password@example.com:8042#nose?not_common
 *   foo://username:password@example.com:8042
 *   foo://username:password@example.com:8042/
 *   foo://example.com:8042
 *   foo://example.com:8042/
 *   foo://example.com
 *   foo://example.com/
 *   
 *   <scheme> : <hierarchical part> / [ ? <query> ] [ # <fragment> ]
 *   
 *   Cases:
 *   	a) <scheme> : <hierarchical part> / [ ? <query> ] [ # <fragment> ]
 *   	b) <scheme> : <hierarchical part> [ ? <query> ] [ # <fragment> ]
 *   
 *   
 *   foo://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose?not_common
 *   ------                  -----------     ---------------------                         ----------------
 *      1  ------------------     7     -----          5          -------------------------         3
 *                  2                     6                                     4
 */

uri = {};

/*
 *  Build a complete URI based on parts
 *  
 *  @param uri_parts: Object
 *  	scheme, [username, password], host, [port, path, query, hash]
 */
uri.build = function(uri_parts) {
	
	var p = uri_parts;
	
	return [
	        p.scheme || "http"
	        ,'://'
	        ,(p.username != undefined ? p.username+":"+p.password+"@" : '')
	        ,p.host
	        ,(p.port != undefined ? ":"+p.port : '')
	        ,'/'
	        ,p.path || ''
	        ,uri.build_query_string(p.query)
	        ,(p.hash != undefined && p.hash != '' ? "#"+p.hash : '')
	        ].join('');
};

/*
 *  Builds just the scheme://host[:port]/ part of the URI
 *  
 *	@param uri_parts: Object
 *  	scheme, [username, password], host, [port]
 *  
 */
uri.build_host = function(uri_parts) {

	var p = uri_parts;
	
	return [
	        p.scheme || "http"
	        ,'://'
	        ,(p.username != undefined ? p.username+":"+p.password+"@" : '')
	        ,p.host
	        ,(p.port != undefined ? ":"+p.port : '')
	        ].join('');
};

uri.parse = function(input, defaults){
	
	defaults = defaults || {};
	
	var o = {
		scheme:   defaults.scheme   || 'http',
		username: defaults.username,
		password: defaults.password,
		host:     defaults.host     || 'localhost',
		port:     defaults.port,
		path:     defaults.path,
		qs:       defaults.qs       || '',
		hash:     defaults.hash,
		query:    {}
	};
	
	function xsplit(str, delim, callback) {
		
		var parts = str.split(delim);
		
		if (parts.length==1)
			return callback(str, '');
		
		var left  = parts.shift();
		
		return callback(left, parts.join(delim));
	};

	// Process query string to an query object
	function process_qs(input) {
		
		if ((input==null) || (input==undefined))
			return {};
		
		var o={};
		var parts = input.split("&");
		
		for (var index in parts) {
			// 2 cases:
			//   a) key=value
			//   b) key
			var key_value = parts[index].split("=");
			var key = key_value[0];
			var value = key_value[1] || true;
			o[key] = value;
		};
		
		return o;
	};
	
	// STEP 1
	xsplit(input, "://", function(scheme, rest){
		
		// 'no host' case:
		//  Assume the defaults and
		//   trick the processing pipeline
		if (rest=='') {

			o.path = scheme;
			rest = uri.build(o);
			rest = rest.split("://")[1];
			rest = rest.replace("//", "/");
			
		} else {
			o.scheme = scheme.toLowerCase();	
		}

		// STEP 2
		xsplit(rest, "@", function(maybe_user_pass, rest){
			
			if (rest=='')
				rest= maybe_user_pass;
			else {
				var parts = maybe_user_pass.split(":");
				o.username = parts[0] || '';
				o.password = parts[1] || '';
			}

			// STEP 3
			xsplit(rest,"#", function(rest, maybe_hash){
				
				// Splice off the possible trailing query part
				//  that should not be there anyways
				var without_invalid_qs = (maybe_hash || "").split("?");
				o.hash = without_invalid_qs[0];
				
				// STEP 4
				xsplit(rest, "?", function(rest, maybe_query){
					
					o.qs = maybe_query || null;
					o.query = process_qs(o.qs);
					
					// STEP 5
					xsplit(rest, "/", function(rest, maybe_path){
						
						o.path = maybe_path || '';
						
						// STEP 6 & 7
						xsplit(rest, ":", function(rest, maybe_port){
							
							o.port = +maybe_port || null;
							o.host = rest;
							
						});//step 6, 7
						
					});// step 5
					
				});// step 4
				
			});// step 3
			
		});// step 2
		
	});// step1
	
	
	return o;
};

/*
 *  Build a query string from a query object key/value elements
 *  
 *  @param query_object: Object | null | undefined
 */
uri.build_query_string = function(query_object) {

	var enc = encodeURIComponent;
	
	// typeof null == 'object' !
	//
	if ((query_object==null) || (typeof query_object!='object'))
		return '';
	
	var qs = [];
	
	for (var key in query_object) {
		var result = ""+enc(key)+"="+enc(query_object[key]);
		qs.push(result);
	}
	
	result = qs.join('&');
	
	return (result.length>0 ? "?"+result : '');
};

// For the tests 
//
if (typeof module!= 'undefined') {
	module.exports = uri;
};