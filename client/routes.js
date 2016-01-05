import $ from 'jquery'
console.log('jquery more than once?', $)

FlowRouter.route('/', {
    action: function() {
        Session.set('title', 'Joseph Orbegoso Pea, trusktr.')
    }
})

//FlowRouter.route('/password', {
    //action: function() {
        //Session.set('title', 'Password generator by Joe Pea, using jQuery.')
    //}
//})

//FlowRouter.route('/clobe', {
    //action: function() {
        //Session.set('title', 'Clobe by Joe Pea, using Famo.us.')
    //}
//})

//FlowRouter.route('/calendar', {
    //action: function() {
        //Session.set('title', 'Date picker by Joe Pea, using Bootstrap, Bootstrap-Datepicker, and Tooltipster.')
    //}
//})

//FlowRouter.route('/flipDiagonal', {
    //action: function() {
        //Session.set('title', 'Diagonal flip animation by Joe Pea, using Famo.us.')
    //}
//})

//FlowRouter.route('/passwordReveal', {
    //action: function() {
        //Session.set('title', 'Password reveal by Joe Pea, using Famo.us.')
    //}
//})

//FlowRouter.route('/scrollViewTest', {
    //action: function() {
        //Session.set('title', 'ScrollView test by Joe Pea and Alessandro Annini, using Famo.us.')
    //}
//})

//FlowRouter.route('/webglearth', {
    //action: function() {
        //Session.set('title', '3D earth playground by Joe Pea, using Famo.us and WebGLEarth.')
    //}
//})

//FlowRouter.route('/mom2015', {
    //action: function() {
        //Session.set('title', 'I love you Mom.')
    //}
//})

//FlowRouter.route('/giants', {
    //action: function() {
        //Session.set('title', 'Giants with Marisa!')
    //}
//})

//FlowRouter.route('/johnnyCrook', {
    //action: function() {
        //Session.set('title', 'Crooked grind by Johnny Ray Taylor.')
    //}
//})

//FlowRouter.route('/greg5050', {
    //action: function() {
        //Session.set('title', 'Greg\'s first coping grind!')
    //}
//})
