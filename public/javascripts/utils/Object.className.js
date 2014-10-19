
Object.prototype.__defineGetter__('className', function() {
    return this.constructor.name || "Object";
});
