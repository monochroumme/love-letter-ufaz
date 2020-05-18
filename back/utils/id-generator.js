let a, b, c, d, e, f, id,
    nextIndex = ['Z','Z','Z','Z','Z','Z'],
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    charsCount = chars.length;
const newId = (function() {
  return function() {
    a = nextIndex[0];
    b = nextIndex[1];
    c = nextIndex[2];
    d = nextIndex[3];
    e = nextIndex[4];
    f = nextIndex[5];
    id = chars[a] + chars[b] + chars[c] + chars[d] + chars[e] + chars[f];

    a = ++a % charsCount;
    if (!a) {
      b = ++b % charsCount; 
      if (!b) {
        c = ++c % charsCount;
        if (!c) {
          d = ++d % charsCount;
          if (!d) {
            e = ++e % charsCount; 
            if (!e) {
              f = ++f % charsCount;
            }
          }
        }
      }
    }

    nextIndex = [a, b, c, d, e, f]; 
    return id;
  }
}());

module.exports.new = newId;

module.exports.reset = () => {
  nextIndex = [0,0,0,0,0,0];
}
