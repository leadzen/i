//#include ./assert.js

(function(){

  I.$define("hope", hope);

  function hope(any) {
    var it = this;
    var assert = new Hope(it);
    assert.any = any;
    return assert;
  }

  class Hope extends Assert{
    constructor(it) {
      super(it);
    }
    get ok() {
      this.any ? this.okey() : this.fail("not ok");
    }
  }
})();