import { TRANSACTION_USER } from "../../api/transactionUser";

export default {
    namespaced: true,
    state: {
        isLoading: false,
        error: null,
        transaction:{}
    },
    getters: {
        isLoading(state) {
            return state.isLoading;
        },
        error(state) {
            return state.error;
        },
        transaction(state) {
            return state.transaction;
        },
    },
    mutations: {
        TRANSACTION_SUCCESS(state, transaction) {
            state.isLoading = false;
            state.error = null;
            state.transaction = transaction;
        },
        TRANSACTION_ERROR(state, error) {
            state.isLoading = false;
            state.error = error;
            state.transaction = {};
        },
    },
    actions: {
        async getTransactionUser({ commit }) {
            try {
                const response = await TRANSACTION_USER.transactionUser();
                if(response && response.operations && response.data.statut === "OK"){
                    commit('TRANSACTION_SUCCESS', response.data.operations);
                    return response.data.operations
                }
                else{
                        commit('TRANSACTION_ERROR', "Une erreur inattendue s'est produite");
                }
            } catch (error) {
                commit('TRANSACTION_ERROR', error);
            }
        },
    },
};
