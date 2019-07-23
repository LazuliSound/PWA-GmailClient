//a % b: a < 0
function negMod(a,b){
  // console.log("negMod");
  if(b <= 0){
    throw new Exception("negative or zero moduli");
  }
  if(a >= 0){
    return a % b;
  }
  else{
    var negA = a*(-1);
    return ((negA % b)-b)*(-1)
  }
  while(negA < 0){
    negA += b*1000000;
  }
  return negA % b;
}

//(a/b) mod c
function fracMod(a,b,c){
  if(isNaN(a) || isNaN(b)){
    throw new Exception("nan value");
  }
  if(b < 0){
    return fracMod(-a,-b,c);
  }
  if(a == b){
    return 1;
  }
  if(b == 1){
    return a;
  }
  var top = a;
  var bot = b;
  while(bot < c){
    top += a;
    bot += b;
  }
  if(bot == c){
    throw new Exception("modular inverse does not exist");
  }
  else if (bot-c == 1) {
    return negMod(top,c);
  }
  else{
    return fracMod(top, negMod(bot,c), c);
  }
}

function isSquare(n){
  return n>0 && Math.sqrt(n) % 1 == 0;
}

class Point {
  constructor(x,y) {
    this.x = 0;
    this.y = 0;
    if(x !== undefined){
      this.x = x;
    }
    if(y !== undefined){
      this.y = y;
    }
  }
}

class ECCEG {
  constructor(a,b,p) {
    this.a = 1;
    this.b = 18;
    this.p = 2087;
    if(a !== undefined){
      this.a = a;
    }
    if(b !== undefined){
      this.b = b;
    }
    if(p !== undefined){
      this.p = p;
    }
  }

  add(pointA, pointB){
    if(pointA.x == pointB.x && pointA.y == pointB.y){
      if(pointA.y == 0){
        return "0"
      }
      else{
        var gradient = fracMod(3*Math.pow(pointA.x,2)+this.a, 2*pointA.y, this.p);
      }
    }
    else{
      if(pointA.x == pointB.x){
        throw new Exception("point addition equals '0'");
      }
      else{
        var gradient = fracMod((pointB.y - pointA.y), (pointB.x-pointA.x), this.p);
      }
    }
    var xr = negMod((Math.pow(gradient, 2)-pointA.x-pointB.x), this.p);
    var yr = negMod((gradient * (pointA.x-xr) - pointA.y), this.p);
    var r = new Point(xr, yr);
    return r;
  }

  minus(pointA, pointB){
    var negPointB = new Point(pointB.x, negMod(-pointB.y, this.p));
    return this.add(pointA, negPointB);
  }

  mult(pointA, b){
    var result = pointA;
    for (var i=0;i<b-1;i++){
      result = this.add(result, pointA);
    }
    return result;
  }

  encrypt(pointP, pointG, k, pointPub){
    return [this.mult(pointG, k), this.add(pointP, this.mult(pointPub, k))];
  }

  arrEncrypt(arrPointP, pointG, k, pointPub){
    var result = [];
    for (var i=0;i<arrPointP.length;i++) {
      // console.log("i=",i);
      result.push(this.encrypt(arrPointP[i], pointG, k, pointPub));
    }
    return result;
  }

  decrypt(pointA, pointB, priv){
    return this.minus(pointB, this.mult(pointA, priv));
  }

  arrDecrypt(arrPoints, priv){
    var result = [];
    for (var i=0;i<arrPoints.length;i++){
      result.push(this.decrypt(arrPoints[i][0], arrPoints[i][1], priv));
    }
    return result;
  }

  findY(x){
    var y2 = negMod(Math.pow(x,3) + (this.a*x) + this.b, this.p);
    for(var y=0; y<this.p; y++){
      if(negMod(Math.pow(y,2), this.p) == y2){
        return y;
      }
    }
    return -1;
  }

  enc(m,k){
    var x = m*k + 1;
    while(this.findY(x) == -1){
      x += 1;
    }
    if(x > ((m+1)*k)){
      throw new Exception("not enough encoding space, k too small");
    }
    return new Point(x, this.findY(x));
  }

  encAscii(c, k){
    return this.enc(c.charCodeAt(0), k);
  }

  stringEncAscii(string, k){
    var result = [];
    for (var i=0;i<string.length;i++){
      result.push(this.encAscii(string[i], k));
    }
    return result;
  }

  dec(point, k){
    return Math.floor((point.x - 1) / k);
  }

  decAscii(point, k){
    return String.fromCharCode(this.dec(point, k));
  }

  stringDecAscii(arrPoint, k){
    var result = "";
    for (var i=0;i<arrPoint.length;i++){
      result += (this.decAscii(arrPoint[i], k));
    }
    return result;
  }

  generateKey(pointG){
    // var priv = Math.floor(Math.random()*5);
    var priv = 10;
    var pointPub = this.mult(pointG, priv);
    return [priv, pointPub];
  }

  generateG(){
    return new Point(771, 35);
  }
}

function testECC(){
  var p = 2087;
  var ecc1 = new ECCEG(1,18,p);
  console.log("p=",p);

  // var pointG = ecc1.generateG();
  var pointG = new Point(771, 35);
  console.log("pointG = ",pointG.x,",",pointG.y);

  var priv;
  var pointPub;
  [priv, pointPub] = ecc1.generateKey(pointG);
  console.log("priv: pointPub = ",priv,":",pointPub.x,",",pointPub.y);

  var string1 = "aku adalah anak gembala";
  kEncode = 10;
  var arrPlain = ecc1.stringEncAscii(string1, kEncode);
  console.log("plaintext");
  for(var i=0;i<arrPlain.length;i++){
    console.log(arrPlain[i].x,",",arrPlain[i].y);
  }
  // var kEncrypt = Math.floor(Math.random()*10);
  var kEncrypt = 10;
  var arrCipher = ecc1.arrEncrypt(arrPlain, pointG, kEncrypt, pointPub);
  console.log("cipher");
  for(var i=0;i<arrCipher.length;i++){
    console.log(arrCipher[i][0].x,",",arrCipher[i][0].y,":",arrCipher[i][1].x,",",arrCipher[i][1].y);
  }

  var arrDecrypt = ecc1.arrDecrypt(arrCipher, priv);
  console.log("decrypt");
  for(var i=0;i<arrDecrypt.length;i++){
    console.log(arrDecrypt[i].x,",",arrDecrypt[i].y);
  }

  console.log("ping6");
  var string2 = ecc1.stringDecAscii(arrDecrypt, kEncode);
  console.log(string2);

  return string2;
}

export {Point, ECCEG}
