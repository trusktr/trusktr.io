export
function callAfter(times, callback) {
    var count = 0;
    return function() {
        if (++count == times) {
            if (typeof callback == 'function') {
                callback.apply(this, arguments);
            }
        }
    };
}
export {callAfter as default};
