/**
 * Simple URI manipulation library in Javascript
 * 
 * @author: jldupont
 * 
 * According to https://en.wikipedia.org/wiki/URI_scheme 
 * 
 *   <scheme name> : <hierarchical part> [ ? <query> ] [ # <fragment> ]
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

uri.parse = function(input){
	
	var o = {
		scheme: '',
		username: '',
		password: '',
		host: '',
		port: '',
		path: '',
		query_string: '',
		query: {},
		hash: ''
	};
	
	function xsplit(str, delim, callback) {
		
		var parts = str.split(delim);
		var left  = parts.shift();
		
		return callback(left, parts.join(delim));
	};

	// STEP 1
	xsplit(input, "://", function(scheme, rest){
		
		o.scheme = scheme.toLowerCase();

		// STEP 2
		xsplit(rest, "@", function(maybe_user_pass, rest){
			
			var parts = maybe_user_pass.split(":");
			o.username = parts[0] || '';
			o.password = parts[1] || '';
			
			if (rest=='')
				rest= maybe_user_pass;

			// STEP 3
			xsplit(rest,"#", function(rest, maybe_hash){
				
				o.hash = maybe_hash || "";
				
				console.log("Hash: ", o.hash);
				
				xsplit(rest, "?", function(rest, maybe_query){
					
					o.qs = maybe_query || "";
					
					console.log("QS: ", o.qs);
					
					xsplit(rest, "/", function(rest, maybe_path){
						
						o.path = maybe_path || '';
						
						console.log("Path: ", o.path);
						
						xsplit(rest, ":", function(rest, maybe_port){
							
							console.log("Rest: ", rest);
							
							o.port = +maybe_port || null;
							
							o.domain = rest;
							
						});
						
					});
					
				});
				
			});
			
		});
		
	});
	
	
	return o;
};


// For the tests 
//
if (typeof module!= 'undefined') {
	module.exports = uri;
};