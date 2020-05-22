let a, b, c, d, e, f, id,
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    nextIndex = getRandomIndex(chars),
    charsCount = chars.length;
const newId = (function() {
  return function() {
    a = nextIndex[0];
    b = nextIndex[1];
    c = nextIndex[2];
    d = nextIndex[3];
    e = nextIndex[4];
    f = nextIndex[5];
    id = a + b + c + d + e + f;

    a = ++a % charsCount;
    if (!a) {
      a = chars[0];
      b = ++b % charsCount; 
      if (!b) {
        b = chars[0];
        c = ++c % charsCount;
        if (!c) {
          c = chars[0];
          d = ++d % charsCount;
          if (!d) {
            d = chars[0];
            e = ++e % charsCount; 
            if (!e) {
              e = chars[0];
              f = ++f % charsCount;

              if (!f)
                f = chars[0];
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

function getRandomIndex(chars) {
  return [chars[parseInt(Math.random() *chars.length)],
          chars[parseInt(Math.random() *chars.length)],
          chars[parseInt(Math.random() *chars.length)],
          chars[parseInt(Math.random() *chars.length)],
          chars[parseInt(Math.random() *chars.length)],
          chars[parseInt(Math.random() *chars.length)]];
}
