/** -----------------------------------------------------------------------------------------------
 * verb.js
 */

(function(){
  var nop = Function.prototype;

  I.$defineVerbs({
    get ok() {
      this.any ? this.okey() : this.fail("not ok");
      return nop;
    }
  });
})();
