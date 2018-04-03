//#include ./getcode.js

/** -----------------------------------------------------------------------------------------------
 * getline.js
 */

 var getline = function() {
  function getline(path) {
    if(path in cache) {
      path = cache[path];
    }
    else {
      path = cache[path] = get(path).split("\n");
    }
    return path;
  }

  var cache = {};

  return getline;
 }();