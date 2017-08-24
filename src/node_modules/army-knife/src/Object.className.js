import "./polyfill.Function.name";

Object.defineProperty(Object.prototype, 'className', {
  enumerable: false,
  get: function() {
      return this.constructor.name || "Object";
  }
});
