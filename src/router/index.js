import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home.vue'
import watchingPerson from '@/components/model/watchingPerson'
import watchingTravel from '@/components/model/watchingTravel'
import trafficLevel from '@/components/model/trafficLevel'
import flowScatter from '@/components/model/dataMining/flowScatter'
import coupledTraffic from '@/components/model/dataMining/coupledTraffic'
import crossCityTransportation from '@/components/model/dataMining/crossCityTransportation'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children: [
        {
          path: '/watchingPerson',
          name: 'watchingPerson',
          component: watchingPerson,
        },
        {
          path: '/watchingTravel',
          name: 'watchingTravel',
          component: watchingTravel,
        },
        {
          path: '/trafficLevel',
          name: 'trafficLevel',
          component: trafficLevel,
        },
        {
          path: '/flowScatter',
          name: 'flowScatter',
          component: flowScatter,
        },
        {
          path: '/coupledTraffic',
          name: 'coupledTraffic',
          component: coupledTraffic,
        },
        {
          path: '/crossCityTransportation',
          name: 'crossCityTransportation',
          component: crossCityTransportation,
        },

      ]
    },

  ]
})