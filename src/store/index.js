import Vue from 'vue'
import Vuex from 'vuex'
import TransactionModule from './operation'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    operation:TransactionModule,
  }
})
