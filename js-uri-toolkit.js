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
		qs: '',
		query: {},
		hash: ''
	};
	
	function xsplit(str, delim, callback) {
		
		var parts = str.split(delim);
		
		if (parts.length==1)
			return callback(str, '');
		
		var left  = parts.shift();
		
		return callback(left, parts.join(delim));
	};

	// STEP 1
	xsplit(input, "://", function(scheme, rest){
		
		o.scheme = scheme.toLowerCase();

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
				
				var without_invalid_qs = (maybe_hash || "").split("?");
				o.hash = without_invalid_qs[0];
				
				// STEP 4
				xsplit(rest, "?", function(rest, maybe_query){
					
					o.qs = maybe_query || "";
					
					var qso = o.qs.split("&");
					
					
					// STEP 5
					xsplit(rest, "/", function(rest, maybe_path){
						
						o.path = maybe_path || '';
						
						// STEP 6 & 7
						xsplit(rest, ":", function(rest, maybe_port){
							
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