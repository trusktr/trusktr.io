
// loop for a given length, performing action each loop iteration. action receives the index of the loop.
export function forLength(length, action) {
    for (var i=0; i<length; i+=1) {
        action(i);
    }
}
export {forLength as default};
