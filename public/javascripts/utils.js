
// loop for a given length, performing action each loop iteration. action receives the index of the loop.
export function forLength(length, action) {
    for (var i=0; i<length; i+=1) {
        action(i);
    }
}

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

export function findInArray (arr, callback) {
    var results = [];
    arr.forEach(function(item, i, a) {
        if (callback(item)) {
            results.push(item);
        }
    });
    return results;
}
