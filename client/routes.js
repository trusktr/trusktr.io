import {ReactiveVar} from 'meteor/reactive-var'

console.log('my new router:', window.history.length)

export
let Title = new ReactiveVar('trusktr.io')

FlowRouter.route('/', {
    action: function() {
        Title.set('Joseph Orbegoso Pea, trusktr.')
    }
})

//FlowRouter.route('/password', {
    //action: function() {
        //Title.set('Password generator by Joe Pea, using jQuery.')
    //}
//})

//FlowRouter.route('/clobe', {
    //action: function() {
        //Title.set('Clobe by Joe Pea, using Famo.us.')
    //}
//})

//FlowRouter.route('/calendar', {
    //action: function() {
        //Title.set('Date picker by Joe Pea, using Bootstrap, Bootstrap-Datepicker, and Tooltipster.')
    //}
//})

//FlowRouter.route('/flipDiagonal', {
    //action: function() {
        //Title.set('Diagonal flip animation by Joe Pea, using Famo.us.')
    //}
//})

//FlowRouter.route('/passwordReveal', {
    //action: function() {
        //Title.set('Password reveal by Joe Pea, using Famo.us.')
    //}
//})

//FlowRouter.route('/scrollViewTest', {
    //action: function() {
        //Title.set('ScrollView test by Joe Pea and Alessandro Annini, using Famo.us.')
    //}
//})

//FlowRouter.route('/webglearth', {
    //action: function() {
        //Title.set('3D earth playground by Joe Pea, using Famo.us and WebGLEarth.')
    //}
//})

//FlowRouter.route('/mom2015', {
    //action: function() {
        //Title.set('I love you Mom.')
    //}
//})

//FlowRouter.route('/giants', {
    //action: function() {
        //Title.set('Giants with Marisa!')
    //}
//})

//FlowRouter.route('/johnnyCrook', {
    //action: function() {
        //Title.set('Crooked grind by Johnny Ray Taylor.')
    //}
//})

//FlowRouter.route('/greg5050', {
    //action: function() {
        //Title.set('Greg\'s first coping grind!')
    //}
//})
