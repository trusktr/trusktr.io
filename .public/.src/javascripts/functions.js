
export function forLength(length, action) {
    for (var i=0; i<length; i+=1) {
        action(i);
    }
}
