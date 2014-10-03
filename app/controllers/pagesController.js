var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.home = function() {
  this.title = 'Joseph Orbegoso Pea, trusktr.';
  this.render();
}

pagesController.password = function() {
  this.title = 'Password generator by Joe Pea, using jQuery.';
  this.render();
}

pagesController.clobe = function() {
  this.title = 'Clobe by Joe Pea, using Famo.us.';
  this.render();
}

pagesController.calendar = function() {
  this.title = 'Calendar picker by Joe Pea, using Famo.us.';
  this.render();
}

pagesController.flipDiagonal = function() {
  this.title = 'Diagonal flip animation by Joe Pea, using Famo.us.';
  this.render();
}

module.exports = pagesController;
