//странная функция, {value:10} считает за циклическую
function isCyclic (obj) {
  var seenObjects = [];
  var mark = String(Math.random());
 
  function detect (obj) {
    if (typeof obj === 'object') {
      if (mark in obj) {
        return false;
      }
      obj[mark] = true;
      seenObjects.push(obj);
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && !detect(obj[key])) {
          return false;
        }
      }
    }
    return true;
  }
 
  var result = detect(obj);
 
  for (var i = 0; i < seenObjects.length; ++i) {
    delete seenObjects[i][mark];
  }
 
  return result;
}