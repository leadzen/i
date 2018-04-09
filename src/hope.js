//#include ./assert.js
//#include ./where.js
//#include ./getline.js
//#include ./dent.js
//#include ./i.js

(function () {

  I.$defineAsserts({
    hope(any) {
      return Object.setPrototypeOf({
        it: this,
        time: Date.now(),
        trace: where(1),
        any: any
      }, hope);
    }
  });

  var hope = Object.setPrototypeOf({
    get desc() {
      var trace = this.trace;
      if (trace) {
        var loc = trace.loc, row = trace.row, lines = getline(loc), end;
        var endding = where(loc);
        if (endding && endding.row > row) {
          end = endding.row + 1;
        }
        else {
          end = row + 1;
        }
        lines = lines.slice(row, end);
        return dent(lines.join("\n"));
      }
    }
  }, assert);

})();