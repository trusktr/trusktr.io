var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.home = function() {
  this.title = 'Joseph Orbegoso Pea, trusktr.';
  this.render();
};

pagesController.password = function() {
  this.title = 'Password generator by Joe Pea, using jQuery.';
  this.render();
};

pagesController.clobe = function() {
  this.title = 'Clobe by Joe Pea, using Famo.us.';
  this.render();
};

pagesController.calendar = function() {
  this.title = 'Date picker by Joe Pea, using Bootstrap, Bootstrap-Datepicker, and Tooltipster.';
  this.render();
};

pagesController.flipDiagonal = function() {
  this.title = 'Diagonal flip animation by Joe Pea, using Famo.us.';
  this.render();
};

pagesController.passwordReveal = function() {
  this.title = 'Password reveal by Joe Pea, using Famo.us.';
  this.render();
};

pagesController.scrollViewTest = function() {
  this.title = 'ScrollView test by Joe Pea and Alessandro Annini, using Famo.us.';
  this.render();
};

pagesController.webglearth = function() {
  this.title = '3D earth playground by Joe Pea, using Famo.us and WebGLEarth.';
  this.render();
};

pagesController.mom2015 = function() {
  this.title = 'I love you Mom.';
  this.render();
};

pagesController.giants = function() {
  this.title = 'Giants with Marisa!';
  this.render();
};

pagesController.johnnyCrook = function() {
  this.title = 'Crooked grind by Johnny Ray Taylor.';
  this.render();
};

pagesController.greg5050 = function() {
  this.title = 'Greg\'s first coping grind!';
  this.render();
};

module.exports = pagesController;
