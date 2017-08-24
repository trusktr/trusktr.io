
// given an array that possibly contains more arrays, flatten the array and convert each item into a number, or null if not a number.
export function stringsToNums(arr) {
   var result = [];
   arr.forEach(function(item, index, array) {
      var value = parseFloat(item);
      if (item instanceof Array) {
         result = result.concat(stringsToNums(item));
      }
      else if ( value.toString() === "NaN" ) {
         result.push(null);
      }
      else {
         result.push(value);
      }
   });
   return result;
}
export {stringsToNums as default};
