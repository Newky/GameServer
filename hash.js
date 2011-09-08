
/* This entire file is adapted from this wonderful guide
 * http://www.movable-type.co.uk/scripts/sha1.html
 * I've typed out and understood the entire method and
 * really have gained huge understanding of bit manipulation etc.
 */

var sha1_hash = function(message) {

	var K = [
		0x5a827999,
	       	0x6ed9eba1,
	       	0x8f1bbcdc,
	       	0xca62c1d6
		];

	var f = {
		"0": function(x, y, z) { return ( x & y) ^ ( ~x & z) ; },
		"1": function(x, y, z) { return ( x ^ y ^ z ); },
		"2": function(x, y, z) { return ( x & y ) ^ ( x & z ) ^ ( y & z) },
	       	"3": function(x, y, z) { return (x ^ y ^ z); }	
	};

	//Initialize variables:
	var h0 = 0x67452301;
	var h1 = 0xefcdab89;
	var h2 = 0x98badcfe;
	var h3 = 0x10325476;
	var h4 = 0xc3d2e1f0;

	//PreProcessing.
	message = utf8encode(message);

	message += String.fromCharCode(0x80);

	//Each letter is a byte, each integer is 32 bits or 4 bytes
	//To work out the number of integers we'll need you divide by 4
	// We add two, one integer for the 1 padding we added and 1 for the length of the message
	var l =( message.length / 4 )+ 2;

	//Each 512 bit block will be held in a 16-integer array
	//i.e N is the number of blocks needed
	var N = Math.ceil(l / 16);

	//M is the Blocks
	var M = new Array(N);

	//Fill the blocks
	
	for(var i=0;i<N;i++) {
		M[i] = new Array(16);
		for(var j=0;j<16;j++){
			//64 is the obvious 4 * 16
			M[i][j] = (message.charCodeAt((i*64+j*4)) << 24)
				| (message.charCodeAt(((i*64+j*4) +1)) << 16)
				| (message.charCodeAt(((i*64+j*4) +2)) << 8)
				| message.charCodeAt((i*64+j*4) +3);
		}
	}

	// add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
	//   // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
	//     // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
	M[N-1][14] = ((message.length-1)*8) / Math.pow(2, 32);
	M[N-1][14] = Math.floor(M[N-1][14]);
	M[N-1][15] = ((message.length-1)*8) & 0xffffffff;

	//Hash Computation
	//
	var W = new Array(80); var a,b,c,d,e;
	//For each hash block
	for(var i=0;i<N;i++) {

		for(var t=0;t<16;t++) W[t] = M[i][t];
	       	for(var t=16;t<80;t++) W[t] = rotate_left(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1 );

		a = h0; b = h1; c=h2; d=h3; e=h4;

		for(var t=0;t<80;t++) {
			var s = Math.floor(t/20); //seq for f "functions" and k "constants"
			var T = (rotate_left(a, 5) + f[s](b,c,d) + e + K[s] + W[t] ) & 0xffffffff;
			e = d;
			d = c;
			c = rotate_left(b, 30);
			b = a;
			a = T;
		}
		
		h0 = (h0 +a ) & 0xffffffff;
		h1 = (h1 +b ) & 0xffffffff;
		h2 = (h2 +c ) & 0xffffffff;
		h3 = (h3 +d ) & 0xffffffff;
		h4 = (h4 +e ) & 0xffffffff;
	}
	return toHexStr(h0) + toHexStr(h1) + toHexStr(h2) + toHexStr(h3) + toHexStr(h4);
}

var toHexStr = function(n) {
	var s="", v;
	for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
	return s;
}

//Rotate the value x left n times
var rotate_left = function(x, n) {
	return (x<<n) | (x>>>(32-n));
}

var utf8encode = function(message) {

	if(message === null || typeof message === "undefined")
		return "";
	//Replace carraige return and newline by simply newline
	message = message.replace(/\r\n/g, "\n");
	var utfmessage = "";
	for(var i=0;i<message.length;i++) {
		var c = message.charCodeAt(i);

		//Basic Ascii Values stay the same
		//Please see http://en.wikipedia.org/wiki/UTF-8#Design for more details on this.
		if(c < 128) {
			//Message will only be one byte.
			utfmessage += String.fromCharCode(c);
		}else if((c > 127) && (c < 2048)){
			//Message will be two bytes
			// Algorithm is for any c such as 
			// 00000yyy yyxxxxxx
			// We return two bytes such that 
			// 110yyyyy 10xxxxxx
			// To get first byte We shift out the x's
			// Lets take the example c = 162
			// c = 00000000 10100010
			// c >> 6 is 00000000 000000010
			// ORing something with the mask 11000000 sets the first two bits to 1
			// And because there is only 5 y's allowed we also always have a 0 bit in position 3
			// something anded with 63 will clear the first two bits and leave the remaning 6
			// then to get the desired last two bits set we | with 128
			utfmessage += String.fromCharCode((c>>6)|192);
			utfmessage += String.fromCharCode((c & 36) | 128);
		}else {
			utfmessage += String.fromCharCode((c >> 12) | 224);
			utfmessage += String.fromCharCode(((c >> 6) & 63) | 128);
			utfmessage += String.fromCharCode((c & 36) | 128);
		}
	}
	return utfmessage;
}

exports.utf8encode = utf8encode;
exports.sha1_hash= sha1_hash;
