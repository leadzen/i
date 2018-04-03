//#include ./get.js

/** -----------------------------------------------------------------------------------------------
 * getcode.js
 */

var getcode = function(){

  function getcode(path) {
    if(path in cache) {
      path = cache[path];
    }
    else {
      path = cache[path] = get(path);
    }
  }

  var cache = {};
  
  return getcode;
}();