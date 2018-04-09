//#include ./lib.js

/** -----------------------------------------------------------------------------------------------
 * go.js
 */

function go(gen) {
  return next();
  function next(value) {
    var state = gen.next(value);
    value = state.value;
    return state.done
      ? value
      : ( classtype(value) === "Generator"
          ? go(value)
          : Promise.resolve(value)
        ).then(next);
  }
}
