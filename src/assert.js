/** -----------------------------------------------------------------------------------------------
 * assert.js
 */

class Assert {
  constructor(it) {
    this.it = it;
    this.desc = null;
    this.state = 0;
    this.reason = null;
    this.time = 0;
  }
  okey() {
    this.state = 1;
    var it = this.it;
    if(!this.desc) {
      this.desc = it.source;
    }
    it.report(this);
  }
  fail(reason) {
    this.state = -1;
    var it = this.it;
    if(!this.desc) {
      this.desc = it.source;
    }
    it.report(this);
  }
}