<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Asignar Funcionarios</div>
            <div class="card-body darkTextCustom">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
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
                                <b-form-group horizontal label="Sentido" class="mb-0">
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
                                <b-form-group horizontal label="Registros por página" class="mb-0">
                                <b-form-select :options="pageOptions" v-model="perPage" />
                                </b-form-group>
                            </b-col>
                            </b-row>

                            <!-- Main table element -->
                            <b-table show-empty
                                    stacked="md"
                                    :items="items"
                                    :fields="fields"
                                    :current-page="currentPage"
                                    :per-page="perPage"
                                    :filter="filter"
                                    :sort-by.sync="sortBy"
                                    :sort-desc.sync="sortDesc"
                                    :sort-direction="sortDirection"
                                    @filtered="onFiltered"
                            >
                            <template slot="name" slot-scope="row">{{row.value.first}} {{row.value.last}}</template>
                            <template slot="isActive" slot-scope="row">{{row.value?'Yes :)':'No :('}}</template>
                            <template slot="actions" slot-scope="row">
                                <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                                <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
                                Info modal
                                </b-button>
                                <b-button size="sm" @click.stop="row.toggleDetails">
                                {{ row.detailsShowing ? 'Ocultar' : 'Mostrar' }} Detalles
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

const items = [
  { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
  { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
  {
    isActive: false,
    age: 9,
    name: { first: 'Mini', last: 'Navarro' },
    _rowVariant: 'success'      
  },
  { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
  { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' } },
  { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
  { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' } },
  {
    isActive: true,
    age: 87,
    name: { first: 'Larsen', last: 'Shaw' },
    _cellVariants: { age: 'danger', isActive: 'warning' }
  },
  { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
  { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' } },
  { isActive: true, age: 38, name: { first: 'John', last: 'Carney' } },
  { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } }
]

    import axios from 'axios';
    import Multiselect from 'vue-multiselect'

	 export default {
        name: 'AsignarEmpleadosEvento',
            components: { 'multi-select': Multiselect,                      
        },
        mounted(){
            this.loading = true;
            this.evento = this.$route.params.evento;
            this.cargarRoles();
        },
        beforeCreate: function () {
            var usuario = this.$session.get('usuario');
            if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
            this.$router.push('/usuario/login')
            } 
        },
        computed: {
            sortOptions () {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => { return { text: f.label, value: f.key } })
            }
        },
        data(){
            return{
                choferEnfermeroSeleccionado: null,
                enfermeroSeleccionado: null,
                choferSeleccionado: null,
                medicoSeleccionado: null,
                loading: false,
                erroresForm: [],
                disabled: false,
                errorDisponibilidad: '',
                evento: {
                    inicioEvento: '',
                    direccion: '',
                    persona: null,
                    servicio: null,
                    tipo: null,
                    direccion: '',
                    finEvento: ''
                },
                roles: [],
                enfermeros: { lista: [] },
                choferes: { lista: [] },
                medicos: { lista: [] },
                choferesEnfermeros: { lista: [] },
                rol: null,
                equipo: 3,

                //******************************************************** */
                items: items,
                fields: [
                    { key: 'nombre', label: 'Nombre', sortable: true, sortDirection: 'desc' },
                    { key: 'apellido', label: 'Apellido', sortable: true, sortDirection: 'desc' },  
                    { key: 'documento', label: 'Documento' },
                    { key: 'disponible', label: 'activo' },
                    { key: 'acciones', label: 'Acciones' }
                ],
                currentPage: 1,
                perPage: 5,
                totalRows: items.length,
                pageOptions: [ 5, 10, 15 ],
                sortBy: null,
                sortDesc: false,
                sortDirection: 'asc',
                filter: null,
                modalInfo: { title: '', content: '' }
                        }
        },
        methods: {
            info (item, index, button) {
                this.modalInfo.title = `Row index: ${index}`
                this.modalInfo.content = JSON.stringify(item, null, 2)
                this.$root.$emit('bv::show::modal', 'modalInfo', button)
            },
            resetModal () {
                this.modalInfo.title = ''
                this.modalInfo.content = ''
            },
            onFiltered (filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            cargarRoles(){
                axios.get(`${process.env.BASE_URL}/api/turno/lista-roles`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.roles = res.data.roles;
                        this.cargarListas();
                    }
                    this.loading = false;
            });
            },
            cargarListas(){
                this.cargarEmpleados(this.roles.find(x => x.descripcion == "AUX. ENF."), this.enfermeros);
                this.cargarEmpleados(this.roles.find(x => x.descripcion == "CHOF. ESP."), this.choferes);
                this.cargarEmpleados(this.roles.find(x => x.descripcion == "MED."), this.medicos);
                this.cargarEmpleados(this.roles.find(x => x.descripcion == "CHOF. ENF."), this.choferesEnfermeros);
            },
            customLabelEmpleados ({ nombre, documento }) {
                return `${nombre} – ${documento}`
            },
            cargarEmpleados(pRol, array){
                axios.get(`${process.env.BASE_URL}/api/evento/lista-empleados-por-rol-evento`, {
                params: {
                    rol: pRol,
                    evento: this.evento,
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        array.lista = res.data.listaEmpleados;
                    }
                    this.loading = false;
                });
            },
            modificarEvento(){
                this.evento.inicioEvento  = moment(`${this.fechaInicio} ${this.horaInicio}`, 'YYYY-MM-DD HH:mm:ss').format();
                this.evento.finEvento  = moment(`${this.fechaFin} ${this.horaFin}`, 'YYYY-MM-DD HH:mm:ss').format();
                this.loading = true;

                delete this.personaSeleccionada.fechaNacimiento;

                if(this.checkForm()){
                    this.evento.persona = this.personaSeleccionada;
                    this.evento.tipo = this.tipoEventoSeleccionado;
                    this.evento.servicio = this.servicioSeleccionado;

                    var params = this.evento;
                    console.log(params);
                    
                    axios.post(`${process.env.BASE_URL}/api/evento/modificar-evento`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5804){
                                this.$router.push({ name: 'PrincipalEvento', params: { resultadoOperacion: "Evento agregado satisfactoriamente." }});                            
                                this.limpiarCajas();    
                            } else if (res.data.resultado == 5805){
                                this.resultadoOperacion = "Error en modificacion.";
                            }
                        }); 
                    this.loading = false;
                }
            },
            limpiarCajas(){
                errorDisponibilidad: '';
            },
            checkForm() {
                if (this.fechaInicio && this.fechaFin  && this.horaInicio && this.horaFin  && this.direccion != ''
                && this.personaSeleccionada != null && this.servicioSeleccionado !=  null && this.tipoEventoSeleccionado != null) {
                    return true;
                }

                this.erroresForm = [];
                
                if (!this.fechaInicio) {
                    this.erroresForm.push('Fecha inicio requerida.');
                } 
                if(!this.horaInicio){
                    this.erroresForm.push('Hora Inicio requerida');
                }
                if(this.direccion == ''){
                    this.erroresForm.push('Direccion requerida');
                }
                if(!this.personaSeleccionada){
                    this.erroresForm.push("Paciente requerido");
                }
                if(!this.servicioSeleccionado){
                    this.erroresForm.push('Servicio requerido');
                }
                if(!this.tipoEventoSeleccionado){
                    this.erroresForm.push('Tipo de Evento requerido');
                }

                this.disabled = false;
                return false;
            },
            chofer(){
                if(this.equipo == 3 || this.equipo == 2)
                    return true;
                return false;
            },
            enfermero(){
                if(this.equipo == 3 || this.equipo == 2)
                    return true;
                return false;
            },
            medico(){
                if(this.equipo == 3)
                    return true;
                return false;    
            },
            choferEnfermero(){
                if(this.equipo == 1)
                    return true;
                return false;
            }
        },    
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.btn-sq-lg {
  width: 150px !important;
  height: 150px !important;
}

.btn-sq {
  width: 100px !important;
  height: 100px !important;
  font-size: 10px;
}

.btn-sq-sm {
  width: 50px !important;
  height: 50px !important;
  font-size: 10px;
}

.btn-sq-xs {
  width: 25px !important;
  height: 25px !important;
  padding:2px;
}

.equipo3{
    background-image: url(https://cdn2.iconfinder.com/data/icons/medical-services-set-3-1/64/x-01-512.png);
    background-size:70% 70%;    
    background-repeat: no-repeat;
    background-position: center;
}

.equipo1{
    background-image: url(https://cdn2.iconfinder.com/data/icons/medical-services-set-3-1/64/x-01-512.png);
    background-size:70% 70%;    
    background-repeat: no-repeat;
    background-position: center;
}

.equipo2{
    background-image: url(https://cdn2.iconfinder.com/data/icons/medical-services-set-3-1/64/x-01-512.png);
    background-size:70% 70%;    
    background-repeat: no-repeat;
    background-position: center;
}
</style>
