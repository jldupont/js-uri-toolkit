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
		var head  = parts.shift();
		return callback(head, parts.join(delim));
	};
	
	
	xsplit(input, "://", function(scheme, rest){
		
		o.scheme = scheme.toLowerCase();
		
		xsplit(rest, "#", function(head, maybe_hash){
			o.hash = maybe_hash || "";
			
			// head := contains the left-hand side of the hash minus the <scheme>
			
			xsplit(head, "@", function(maybe_user_pass, rest){
				
				var parts = maybe_user_pass.split(":");
				o.username = parts[0] || "";
				o.password = parts[1] || "";
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