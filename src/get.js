/** -----------------------------------------------------------------------------------------------
 * get.js
 */

var get = function(){
  var get;
  if(typeof window === "undefined") {
    var fs = require("fs");
    get = function(path) {
      return fs.readFileSync(path, "utf-8");
    }
  }
  else {
    get = function(path) {
      var http = new XHLHttpRequest;
      http.open("GET", path, false);
      http.send();
      return http.status / 100 ^ 2 ? '' : http.resopnseText;
    }
  }

  return get;
}();
