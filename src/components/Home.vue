<template>
  <v-container>
    <v-row align="center">
      <v-col class="d-flex" cols="2" sm="2">
        <v-select
                :items="rib"
                v-model="search"
                label="RIB"
        ></v-select>
      </v-col>

      <v-col cols="4" sm="2" md="2">
        <v-menu
                v-model="date1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                    v-model="DateBegin"
                    label="Date début"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="DateBegin" @input=startDate(DateBegin)></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="2" sm="4" md="2">
        <v-menu
                v-model="date2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                    v-model="DateEnd"
                    label="Date fin"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="DateEnd" @input=endtDate(DateEnd)></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="4" md="2">
        <v-btn depressed large color="primary" @click="resetFiltre()">Supression filtre</v-btn>
      </v-col>
    </v-row>
    <v-data-table
            :headers="headers"
            :items="operations"
            :sort-by="['Date']"
            :sort-asce="[true]"
            :items-per-page="10"
            :search="search"
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
        rib: [],
        search:'',
        DateBegin: new Date().toISOString().substr(0, 10),
        date1: false,
        DateEnd: new Date().toISOString().substr(0, 10),
        date2: false,
        headers: [
          {
            text: 'RIB',
            align: 'start',
            sortable: false,
            value: 'RIB',
          },
          { text: 'Date', value: 'Date' },
          { text: 'Libelle', sortable: false, value: 'Libelle' },
          { text: 'Montant', sortable: false, value: 'Montant' },
          { text: 'Devise', sortable: false, value: 'Devise' },
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
          this.getRIB(res);
      },
     getRIB(value) {
         for (let i = 0; i < value.length; i++) {
            if (!this.verifyElement(value[i].RIB)) {
                this.rib.push(value[i].RIB)
            }
          }
     },
     verifyElement(value){
         for (const rib in this.rib) {
            if (value === rib){
                return true
            } else {
                return false
            }
         }
     },
      startDate(start_date) {
       if (start_date === null) {
         return this.operations
       }
        this.operations = this.operations.filter(item => item.Date >= this.formatDate(start_date))
        this.date1 = false
    },
      endtDate(end_date) {
        if (end_date === null) {
          return this.operations
        }
        this.operations = this.operations.filter(item => item.Date <= this.formatDate(end_date))
        this.date2 = false
      },
      resetFiltre() {
        this.search = '',
        this.DateBegin = ''
        this.DateEnd = ''
        this.getOperationUserAction()
      },
    formatDate (value) {
      if (!value) return '';
      return new Date(value).toLocaleDateString("fr-FR");
    }
  }
  }
</script>
