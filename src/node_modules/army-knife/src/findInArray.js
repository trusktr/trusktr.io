
export function findInArray (arr, callback) {
    var results = [];
    arr.forEach(function(item, i, a) {
        if (callback(item)) {
            results.push(item);
        }
    });
    return results;
}
export {findInArray as default};;
