class SHA1 {
  constructor() {
    this.h0 = 0x67452301;
    this.h1 = 0xEFCDAB89;
    this.h2 = 0x98BADCFE;
    this.h3 = 0x10325476;
    this.h4 = 0xC3D2E1F0;
  }
  //receive 512bit, 16 chunks, 32 bit per chunk
  sha512(words) {
    var a = this.h0;
    var b = this.h1;
    var c = this.h2;
    var d = this.h3;
    var e = this.h4;
    var f, j, t;

    var blocks = words;

    for(j = 16; j < 80; ++j) {
      t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
      blocks[j] =  (t << 1) | (t >>> 31);
    }

    for(j = 0; j < 20; j += 5) {
      f = (b & c) | ((~b) & d);
      t = (a << 5) | (a >>> 27);
      e = (t + f + e + 0x5A827999 + blocks[j] << 0) >>> 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | ((~a) & c);
      t = (e << 5) | (e >>> 27);
      d = (t + f + d + 0x5A827999 + blocks[j + 1] << 0) >>> 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | ((~e) & b);
      t = (d << 5) | (d >>> 27);
      c = (t + f + c + 0x5A827999 + blocks[j + 2] << 0) >>> 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | ((~d) & a);
      t = (c << 5) | (c >>> 27);
      b = (t + f + b + 0x5A827999 + blocks[j + 3] << 0) >>> 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | ((~c) & e);
      t = (b << 5) | (b >>> 27);
      a = (t + f + a + 0x5A827999 + blocks[j + 4] << 0) >>> 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 40; j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = (t + f + e + 0x6ED9EBA1 + blocks[j] << 0) >>> 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = (t + f + d + 0x6ED9EBA1 + blocks[j + 1] << 0) >>> 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = (t + f + c + 0x6ED9EBA1 + blocks[j + 2] << 0) >>> 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = (t + f + b + 0x6ED9EBA1 + blocks[j + 3] << 0) >>> 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = (t + f + a + 0x6ED9EBA1 + blocks[j + 4] << 0) >>> 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 60; j += 5) {
      f = (b & c) | (b & d) | (c & d);
      t = (a << 5) | (a >>> 27);
      e = (t + f + e - 0x8F1BBCDC + blocks[j] << 0) >>> 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | (a & c) | (b & c);
      t = (e << 5) | (e >>> 27);
      d = (t + f + d - 0x8F1BBCDC + blocks[j + 1] << 0) >>> 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | (e & b) | (a & b);
      t = (d << 5) | (d >>> 27);
      c = (t + f + c - 0x8F1BBCDC + blocks[j + 2] << 0) >>> 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | (d & a) | (e & a);
      t = (c << 5) | (c >>> 27);
      b = (t + f + b - 0x8F1BBCDC + blocks[j + 3] << 0) >>> 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | (c & e) | (d & e);
      t = (b << 5) | (b >>> 27);
      a = (t + f + a - 0x8F1BBCDC + blocks[j + 4] << 0) >>> 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 80; j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = (t + f + e - 0xCA62C1D6 + blocks[j] << 0) >>> 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = (t + f + d - 0xCA62C1D6 + blocks[j + 1] << 0) >>> 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = (t + f + c - 0xCA62C1D6 + blocks[j + 2] << 0) >>> 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = (t + f + b - 0xCA62C1D6 + blocks[j + 3] << 0) >>> 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = (t + f + a - 0xCA62C1D6 + blocks[j + 4] << 0) >>> 0;
      c = (c << 30) | (c >>> 2);
    }
    this.h0 = (this.h0 + (a << 0)) >>> 0;
    this.h1 = (this.h1 + (b << 0)) >>> 0;
    this.h2 = (this.h2 + (c << 0)) >>> 0;
    this.h3 = (this.h3 + (d << 0)) >>> 0;
    this.h4 = (this.h4 + (e << 0)) >>> 0;
  };

  extractResult(){
    return ""+this.h0.toString(16)+this.h1.toString(16)+this.h2.toString(16)+this.h3.toString(16)+this.h4.toString(16);
  }

  shaString(string){
    var procString = string;
    procString += String.fromCharCode(0b10000000);
    for(var i=procString.length+1;i%32 != 0;i++){
      procString += String.fromCharCode(0b00000000);
    }
    procString += String.fromCharCode((string.length) * 8);
    for(i=0;i<procString.length;i += 32){
      var words = [];
      for(var j=0;j<16;j++){
        words[j] = (procString[i+ 2*j].charCodeAt() << 8) + (procString[i+ 2*j + 1].charCodeAt());
      }
      this.sha512(words);
    }
    return this.extractResult();
  }
}

export default SHA1;