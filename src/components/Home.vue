<template>
  <v-container>
    <v-row align="center">
      <v-col class="d-flex" cols="4" sm="4">
        <v-select
                :items="rib"
                v-model="search"
                label="RIB"
        ></v-select>
      </v-col>

      <v-col cols="4" sm="4" md="4">
        <v-menu
                ref="show_start_date"
                v-model="show_start_date"
                :return-value.sync="start_date"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                    v-model="start_date"
                    label="Date début"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="start_date"
                         @input="filterStartDate"
          ></v-date-picker>
        </v-menu>
      </v-col>


      <v-col cols="4" sm="4" md="4">
        <v-menu
                ref="show_end_date"
                v-model="show_end_date"
                :return-value.sync="end_date"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                    v-model="end_date"
                    label="Date fin"
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker  v-model="end_date"
                          @input="filterEndDate"></v-date-picker>
        </v-menu>
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
        show_start_date: false,
        start_date: null,

        show_end_date: false,
        end_date: null,
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
      /**
       * Handler when select a date on "From" date picker.
       */
      filterStartDate(val) {
        // Close the date picker.
        this.$refs.show_start_date.save(val);

        //Convert the value to a timestamp before saving it.
        const timestamp = new Date(val + 'T00:00:00Z').getTime();
        this.filters = this.$MultiFilters.updateFilters(this.filters, {start_date: timestamp});
      },

      /**
       * Handler when select a date on "To" date picker.
       */
      filterEndDate(val) {
        // Close the date picker.
        this.$refs.show_end_date.save(val);

        //Convert the value to a timestamp before saving it.
        const timestamp = new Date(val + 'T00:00:00Z').getTime();
        this.filters = this.$MultiFilters.updateFilters(this.filters, {end_date: timestamp});
      },
     verifyElement(value){
         for (const rib in this.rib) {
            if (value === rib){
                return true
            } else {
                return false
            }
         }
     }
    }
  }
</script>
