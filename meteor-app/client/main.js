import { detectIE, showNeedsBetterBrowser } from './imports/utils'

~async function main() {

    var ieVersion = detectIE()
    if ( ieVersion && ieVersion <= 11 ) {
        showNeedsBetterBrowser()
        return
    }

    const {default:run} = await import(
        //'./imports/home'
        //'./imports/earthDefense'
        //'./imports/lettersToGrid'
        //'./imports/motorPushMenuDev'
        //'./imports/kanban'
        './imports/planet'

        //'./imports/testElementRemoval'
        //// currently fails
        //'./imports/testSceneUnmount'
        //// TODO
        //'./imports/testShadowDomUsage'
        //'./imports/testHtmlRerendering'
        //'./imports/testHtmlRerendering2'
        //'./imports/testSceneCreation'
    )

    Meteor.startup(run)
}()
