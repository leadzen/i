/** -----------------------------------------------------------------------------------------------
 * lib.js
 */

function valuetype(any) {
  return any === null ? "null" : typeof any;
}

var classtype = function(){
  var reTrimTag = /\[object |\]/g;
  return function (any) {
    return Object.prototype.toString.call(any).replace(reTrimTag, '');
  }
}();
