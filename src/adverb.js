/** -----------------------------------------------------------------------------------------------
 * adverb.js
 */

(function(){
  I.$defineVerbs({
    get is() { return this },
    get be() { return this },
    get not() {
      this._not = !this._not;
      return this;
    }
  });
})();