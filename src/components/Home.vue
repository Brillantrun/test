<template>
  <v-container>
    <v-row align="center">
      <v-col class="d-flex" cols="4" sm="4">
        <v-select
                :items="rib"
                v-model="search"
                label="RIB"
                @input="filterRIB(search)"
        ></v-select>
      </v-col>

      <v-col cols="3" sm="3" md="3">
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

      <v-col cols="3" sm="3" md="3">
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
      <v-col cols="2" sm="2" md="2">
        <v-btn depressed width="100%" color="primary" @click="resetFiltre()">Supression filtre</v-btn>
      </v-col>
    </v-row>
    <v-data-table
            :headers="headers"
            :items="operations"
            :sort-by="['Date']"
            :sort-asce="[true]"
            :items-per-page="10"
            class="elevation-1"
    >
      <template v-slot:item.Recette= "{item}">
        <p style="color: green">{{ item.Recette }}</p>
      </template>
      <template v-slot:item.Depense= "{item}">
        <p style="color: red">{{ item.Depense }}</p>
      </template>
    </v-data-table>
    <v-row align="center">
      <v-col cols="2" sm="2" md="2">
        <v-btn
                color="success"
                class="mr-4"
                @click="calculSolde(operations)"
        >
          Solde
        </v-btn>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <p v-if="solde < 0" style="margin-bottom:0px !important;color: red">Solde : {{ solde }}€</p>
        <p v-else style="margin-bottom:0px !important;color: green">Solde : {{ solde }}€</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Vue from 'vue'
  import { mapActions } from "vuex";
  import { mapGetters } from "vuex";
  export default {
    data () {
      return {
        rib: [],
        solde:0,
        totalRecette:0,
        totalDepense:0,
        search:'',
        DateBegin: '',
        date1: false,
        DateEnd: '',
        date2: false,
        headers: [
          { text: 'RIB', align: 'start', sortable: false, value: 'RIB'},
          { text: 'Date', value: 'Date' },
          { text: 'Libelle', sortable: false, value: 'Libelle' },
          { text: 'Recette', sortable: false, value: 'Recette' },
          { text: 'Dépense', sortable: false, value: 'Depense' },
          { text: 'Devise', sortable: false, value: 'Devise' },
        ],
        operations:[]
      }
    },
    computed:{
      ...mapGetters("operation",["isLoading","error","operation"]),
    },
    async created() {
      //A la création on appel la méthode getOperationUserAction pour allimenter le Data-Table
      await this.getOperationUserAction();
      Vue.notify({
        group: 'foo',
        type: 'warn',
        position: 'top center',
        title: '<h2>Message important</h2>',
        duration: 30000,
        text: "A chaque fois que vous utilisez les filtres,Veillez à bien suprimer les filtres avant une autre tentative pour avoir une liste propre",
      })
    },
    methods: {
      //mapActions pour utiliser les action définie dans les stor, cela permet d'appelé les API une seul foie et de pouvoir les réutiliser dans toute les pages ou composant
      ...mapActions("operation", ["getOperationUser"]),

      //Méthode permettant d'allimenter le Data-Table
      async getOperationUserAction() {
       const res = await this.getOperationUser();
          this.operations = []
          this.formatedOperation(res)
          this.getRIB(res);
      },

      //Vu que nous avons pas un API our lister les RIB des clients, on par cet méthoede pour alimenter le champ RIB
      getRIB(value) {
       for (let i = 0; i < value.length; i++) {
            if (!this.verifyElement(value[i].RIB)) {
                this.rib.push(value[i].RIB)
            }
          }
     },

      //Méthode pour calculer le sodle du client
      calculSolde(){
        this.solde = 0
        for (let i = 0; i < this.operations.length; i++) {
           this.totalRecette += Math.abs(this.formatedFloat(this.operations[i].Recette))
           this.totalDepense += Math.abs(this.formatedFloat(this.operations[i].Depense))
        }
        this.solde = parseFloat(this.totalRecette - this.totalDepense).toFixed(2)
        this.totalRecette = 0
        this.totalDepense = 0
      },

      formatedFloat(decimal) {
          return parseFloat((decimal+"").replace(",","."));
        },

      //Transfomration du format de l'opération
      formatedOperation(value) {
        for (let i = 0; i < value.length; i++) {
          if (parseFloat(value[i].Montant) > 0){
            this.operations.push({
              RIB:value[i].RIB,
              Date:value[i].Date,
              Libelle:value[i].Libelle,
              Recette:value[i].Montant,
              Depense:0,
              Devise:value[i].Devise
            })
          } else {
            this.operations.push({
              RIB:value[i].RIB,
              Date:value[i].Date,
              Libelle:value[i].Libelle,
              Recette:0,
              Depense:value[i].Montant,
              Devise:value[i].Devise
            })
          }
        }
      },

      //Vérification des RIB
      verifyElement(value){
         for (const rib in this.rib) {
            if (value === rib){
                return true
            } else {
                return false
            }
         }
     },

      //Méthode pour filtrer en fonction des RIB
      filterRIB(rib) {
        if (rib === null) {
          return this.operations
        }
        this.operations = this.operations.filter(item => item.RIB === rib)
      },

      //Méthode pour filtrer en fonction de Datde de début
      startDate(start_date) {
       if (start_date === null) {
         return this.operations
       }
        this.operations = this.operations.filter(item => item.Date >= this.formatDate(start_date))
        this.date1 = false
    },

      //Méthode pour filtrer en fonction de Datde de fin
      endtDate(end_date) {
        if (end_date === null) {
          return this.operations
        }
        this.operations = this.operations.filter(item => item.Date <= this.formatDate(end_date))
        this.date2 = false
      },

      //Initialisation des champs
      resetFiltre() {
        this.search = '',
        this.DateBegin = ''
        this.DateEnd = ''
        this.solde = 0
        this.totalRecette = 0
        this.totalDepense = 0
        this.getOperationUserAction()
      },

      //Méthode permettant de formater les Date en Français
      formatDate (value) {
      if (!value) return '';
      return new Date(value).toLocaleDateString("fr-FR");
    }
  }
  }
</script>
