import axios from "axios";

export default {
    transactionUser() {
        return axios.get(process.env.VUE_APP_ROOT_API+"exercice@dev/");
    },
}
