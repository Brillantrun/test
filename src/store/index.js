import Vue from 'vue'
import Vuex from 'vuex'
import TransactionModule from './transaction/transaction-user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    transaction:TransactionModule,
  }
})
