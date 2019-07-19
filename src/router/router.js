import Vue from 'vue'
import VueRouter from 'vue-router'
import Father from '@/components/father.vue'
import Son from '@/components/son.vue'


Vue.use(VueRouter)


var router=new VueRouter({
    routes:[
      {
        name: 'father',
        path: '/father',
        component: Father
      },
      {
        name: 'son',
        path: '/son',
        component: Son}
    ]
  })
  export default router