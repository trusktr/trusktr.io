import { detectIE, showNeedsBetterBrowser } from './imports/utils'

~async function main() {

    var ieVersion = detectIE()
    if ( ieVersion && ieVersion <= 11 ) {
        showNeedsBetterBrowser()
        return
    }

    const {default:home} = await import('./imports/home')
    Meteor.startup(home)

    //import earthDefense from './imports/earthDefense'
    //Meteor.startup(earthDefense)

    //import lettersToGrid from './imports/lettersToGrid'
    //Meteor.startup(lettersToGrid)

    //import motorPushMenuDev from './imports/motorPushMenuDev'
    //Meteor.startup(motorPushMenuDev)




    //import testElementRemoval from './imports/testElementRemoval'
    //Meteor.startup(testElementRemoval)

    // currently fails
    //import testSceneUnmount from './imports/testSceneUnmount'
    //Meteor.startup(testSceneUnmount)

    // TODO
    //import testShadowDomUsage from './imports/testShadowDomUsage'
    //Meteor.startup(testShadowDomUsage)

    //import testHtmlRerendering from './imports/testHtmlRerendering'
    //Meteor.startup(testHtmlRerendering)

    //import testHtmlRerendering2 from './imports/testHtmlRerendering2'
    //Meteor.startup(testHtmlRerendering2)

    //import testSceneCreation from './imports/testSceneCreation'
    //Meteor.startup(testSceneCreation)
}()
