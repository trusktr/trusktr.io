// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  this.match('/',               'pages#home');
  this.match('/password',       'pages#password');
  this.match('/clobe',          'pages#clobe');
  this.match('/calendar',       'pages#calendar');
  this.match('/flipDiagonal',   'pages#flipDiagonal');
  this.match('/passwordReveal', 'pages#passwordReveal');
  this.match('/scrollViewTest', 'pages#scrollViewTest');
  this.match('/webglearth',     'pages#webglearth');
  this.match('/mom2015',        'pages#mom2015');
  this.match('/giants',         'pages#giants');
  this.match('/johnnyCrook',    'pages#johnnyCrook');
};
