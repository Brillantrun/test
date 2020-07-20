<template>
  <v-container>
    <v-data-table
            :headers="headers"
            :items="operations"
            :items-per-page="5"
            class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
  import { mapActions } from "vuex";
  import { mapGetters } from "vuex";
  export default {
    data () {
      return {
        headers: [
          {
            text: 'RIB',
            align: 'start',
            sortable: false,
            value: 'RIB',
          },
          { text: 'Date', value: 'Date' },
          { text: 'Libelle', value: 'Libelle' },
          { text: 'Montant', value: 'Montant' },
          { text: 'Devise', value: 'Devise' },
        ],
        operations:[]
      }
    },
    computed:{
      ...mapGetters("operation",["isLoading","error","operation"]),
    },
    async created() {
      await this.getOperationUserAction();

    },
    methods: {
      ...mapActions("operation", ["getOperationUser"]),
      async getOperationUserAction() {
       const res = await this.getOperationUser();
       this.operations = res
      }
    }
  }
</script>
