var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.home = function() {
  this.title = 'Joseph Orbegoso Pea, trusktr.';
  this.render();
}

pagesController.password = function() {
  this.title = 'Password Generator by Joe Pea.';
  this.render();
}

pagesController.clobe = function() {
  this.title = 'Clobe by Joe Pea.';
  this.render();
}

module.exports = pagesController;
