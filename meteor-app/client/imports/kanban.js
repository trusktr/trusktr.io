import Vue from 'vue'
import Kanban from './kanban.vue'

export default
function() {

    // mount the root Vue component
    const vueContainer = document.createElement('div')
    document.querySelector('#app-root').appendChild(vueContainer)
    vueInstance = ( new ( Vue.extend( Kanban ) ) )
        .$mount( vueContainer )
}
