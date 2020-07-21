import TransactionAPI from "../api/transactionUser";

//Les stor permet d'appelé les API une seul foie et de pouvoir les réutiliser dans toute les pages ou composants
export default {
    namespaced: true,
    state: {
        isLoading: false,
        error: null,
        operation:{}
    },
    getters: {
        isLoading(state) {
            return state.isLoading;
        },
        error(state) {
            return state.error;
        },
        operation(state) {
            return state.operation;
        },
    },
    mutations: {
        TRANSACTION_SUCCESS(state, operation) {
            state.isLoading = false;
            state.error = null;
            state.operation = operation;
        },
        TRANSACTION_ERROR(state, error) {
            state.isLoading = false;
            state.error = error;
            state.operation = {};
        },
    },
    actions: {

        //Définition des actions
        async getOperationUser({ commit }) {
            //Action permetant l'appel de l'API dans toute l'application
            try {
                const response = await TransactionAPI.transactionUser();
                if(response.data && response.data.operations && response.data.statut === "OK"){
                    commit('TRANSACTION_SUCCESS', response.data.operations);
                    return response.data.operations
                }
                else{
                        commit('TRANSACTION_ERROR', "Une erreur inattendue s'est produite");
                }
            }
            //Gestion des erreur
            catch (error) {
                commit('TRANSACTION_ERROR', error);
            }
        },
    },
};
