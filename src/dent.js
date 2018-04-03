/** -----------------------------------------------------------------------------------------------
 * dent.js
 */

var dent = function(){
  function dent(text, space) {
    text = String(text);
    if(arguments.length<2) {
      var spaces = text.match(reSpaces);
      for(var i=0; i<spaces.length; i++) {
        if(!(spaces[i] > space)) {
          space = spaces[i];
        }
      }
    }
    space = RegExp('^'+space, 'gm');
    return text.replace(space, '');
  }
  var reSpaces = /^\s*/gm;

  return dent;
}();