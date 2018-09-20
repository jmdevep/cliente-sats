<template>
    <div>
        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
                <template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Filtrar" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Escribe para buscar" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Limpiar</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Ordenar" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">-- ninguno --</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Sort direction" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortDirection" slot="append">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
              <option value="last">Last</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
     <b-table id="my-table"
        ref="table"
        show-empty
        :items="myProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :busy.sync="isBusy"
        :filter="filter"
        @filtered="onFiltered"
            >
      <template slot="name" slot-scope="row">{{row.value.first}} {{row.value.last}}</template>
      <template slot="isActive" slot-scope="row">{{row.value?'Yes :)':'No :('}}</template>
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
          Editar
        </b-button>
        <b-button size="sm" @click.stop="row.toggleDetails">
         Eliminar
        </b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
      <pre>{{ modalInfo.content }}</pre>
    </b-modal>

  </b-container>
</template>
            

            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'PruebaTabla',
        mounted(){
          
        },
            beforeCreate: function () {
                var usuario = this.$session.get('usuario');
                if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
                this.$router.push('/usuario/login')
                } 
        },
        data() { 
            return { 
                isBusy: false, 
                fields: {
                    nombre: {
                        label: 'Nombre de Usuario',
                        sortable: true,
                        sortDirection: 'asc'
                    },
                    tipo: {
                        key: 'tipo.id',
                    },
                    actions: {
                        label: 'Acciones',
                        key: 'actions' 
                    } 
                },
                currentPage: 1, 
                perPage: 5, 
                totalRows: 1, 
                pageOptions: [ 5, 10, 15 ], 
                sortBy: null, 
                sortDesc: false, 
                filter: null, 
                modalInfo: { 
                    title: '', 
                    content: '' 
                    } 
                } 
            },

        methods: {
            onFiltered (filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            myProvider (ctx) {
            console.log("Proveedor datos");
            this.isBusy = true;
            
            return axios.get(`${process.env.BASE_URL}/api/usuario/lista-usuarios`, {
                params: {
                    condiciones: {
                        orden: (ctx.sortDesc == true) ? 'DESC' : 'ASC',
                        tamanoPagina: ctx.perPage,
                        indicePagina: ctx.currentPage,
                        campo: ctx.sortBy || 'nombre',
                        valor: ctx.filter || '%%'
                    },
                }
            })
                .then((res)=>{
                    console.log(res);
                    if(res.data.resultado == 100){
                        let items = res.data.listaUsuarios;   
                         console.log(items);
                         this.totalRows = res.data.cantidadElementos;
                         this.isBusy = false;
                         return items;       
                    }
            }).catch(error => {
                this.isBusy = false;        
                return [];
            })
            this.isBusy = false; 
            return [];
        }    
        },    
    }
</script>
