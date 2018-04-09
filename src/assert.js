/** -----------------------------------------------------------------------------------------------
 * assert.js
 */

var assert = {
  okey() {
    this.state = 1;
    this.it.report(this);
  },

  fail(reason) {
    this.state = -1;
    this.reason = reason;
    this.it.report(this);
  }
}

// class Assert {
//   constructor(it) {
//     this.it = it;
//     // this.desc = null;
//     this.state = 0;
//     this.reason = null;
//     this.time = 0;
//   }
// }