<template>
    <div>
        <div class="mb-3 card">
            <div class="card-body darkTextCustom">
            <i v-show="loading" class="fa fa-spinner fa-spin"></i>                
                <template v-if="!tieneEmpleados">
                    <p>Este evento no tiene empleados asignados.</p>
                    
                    <button @click="toggleForm()" class="btn marginBefore tableHeadingBackground">
                        {{ mostrarForm ? "Cancelar" : "Asignar empleados"}}
                    </button>
                </template>
                <template v-else>
                    <button @click="toggleEditar()" class="btn marginBefore tableHeadingBackground">
                        {{ disabled ?  "Editar " : "Cancelar"  }}
                    </button>
                </template>
                <template v-if="mostrarForm">
                    <form>
                        <p v-if="erroresForm.length">
                            <b>Por favor corrija lo siguiente:</b>
                            <ul>
                                <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                            </ul>
                        </p>
                        <p>{{ resultadoOperacion }}</p>
                        
                        <template v-if="mostrarEquipos">
                            <div class="row">
                                <div class="col-lg-12">
                                <p>
                                    <a href="#" @click="equipo = 3" class="btn btn-sq-lg btn-info equipo3">
                                    <br/>
                                    Médico <br>
                                    Chofer <br>
                                    Enfermero
                                    </a>
                                    <a href="#"  @click="equipo = 2" class="btn btn-sq-lg btn-info equipo2">
                                    <br/>
                                    Chofer <br>
                                    Enfermero
                                    </a>
                                    <a href="#"  @click="equipo = 1" class="btn btn-sq-lg btn-info equipo1">
                                    <br/>
                                    Chofer - Enfermero
                                    </a>
                                </p>
                                </div>
                            </div>
                        </template>

                        <template v-if="chofer()">
                            <multi-select :disabled="disabled" v-model="choferSeleccionado" placeholder="Chofer" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="choferes.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">
                                
                                <template slot="option" slot-scope="props">
                                    <div class="option__desc">
                                        <span class="option__title">{{ props.option.nombre }} {{ props.option.apellido }}</span>
                                        <br>
                                        <span class="option__small">{{ props.option.documento }}</span>
                                    </div>
                                </template>
                            </multi-select>
                        </template>

                        <br> 

                    <template v-if="enfermero()"> 
                            <multi-select :disabled="disabled" v-model="enfermeroSeleccionado" placeholder="Enfermero" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="enfermeros.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">    
                                <template slot="option" slot-scope="props">
                                    <div class="option__desc">
                                        <span class="option__title">{{ props.option.nombre }} {{ props.option.apellido }}</span>
                                        <br>
                                        <span class="option__small">{{ props.option.documento }}</span>
                                    </div>
                                </template>
                            </multi-select>
                        </template>

                        <br>

                        <template v-if="medico()"> 
                            <multi-select :disabled="disabled" v-model="medicoSeleccionado" placeholder="Médico" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="medicos.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">
                                <template slot="option" slot-scope="props">
                                    <div class="option__desc">
                                        <span class="option__title">{{ props.option.nombre }} {{ props.option.apellido }}</span>
                                        <br>
                                        <span class="option__small">{{ props.option.documento }}</span>
                                    </div>
                                </template>
                            </multi-select>
                        </template>         

                        <template v-if="choferEnfermero()"> 
                            <multi-select :disabled="disabled" v-model="choferEnfermeroSeleccionado" placeholder="Chofer enfermero" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="choferesEnfermeros.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">
                                <template slot="option" slot-scope="props">
                                    <div class="option__desc">
                                        <span class="option__title">{{ props.option.nombre }} {{ props.option.apellido }}</span>
                                        <br>
                                        <span class="option__small">{{ props.option.documento }}</span>
                                    </div>
                                </template>
                            </multi-select>
                        </template>        

                        <hr>
                        <br>

                        <div class="list-group">
                            <template v-if="choferSeleccionado">
                                <a :key="index" href="#" class="list-group-item lista-tramos list-group-item-action flex-column align-items-start list-group-flush no-pointer">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">Rol: Chofer</h5>
                                        <template v-if="!disabled">
                                            <small class="small-x-large"><a href="#" @click="removerChofer()"><i class="fas fa-trash"></i></a></small>
                                        </template>
                                    </div>
                                    <p class="mb-1">Nombre: {{ choferSeleccionado.nombre + " " + choferSeleccionado.apellido }} </p>
                                    <small>Documento: {{ choferSeleccionado.documento }}</small>
                                </a>
                            </template>
                            <template v-if="choferEnfermeroSeleccionado">
                                <a :key="index" href="#" class="list-group-item lista-tramos list-group-item-action flex-column align-items-start list-group-flush no-pointer">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1"> Chofer Enfermero</h5>
                                        <template v-if="!disabled">
                                            <small class="small-x-large"><a href="#" @click="removerChoferEnfermero()"><i class="fas fa-trash"></i></a></small>
                                        </template>
                                    </div>
                                    <p class="mb-1">Nombre: {{ choferEnfermeroSeleccionado.nombre + " " + choferEnfermeroSeleccionado.apellido }} </p>
                                    <small>Documento: {{ choferEnfermeroSeleccionado.documento }}</small>
                                </a>
                            </template>
                            <template v-if="enfermeroSeleccionado">
                                <a :key="index" href="#" class="list-group-item lista-tramos list-group-item-action flex-column align-items-start list-group-flush no-pointer">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1"> Enfermero</h5>
                                        <template v-if="!disabled">
                                            <small class="small-x-large"><a href="#" @click="removerEnfermero()"><i class="fas fa-trash"></i></a></small>
                                        </template>
                                    </div>
                                    <p class="mb-1">Nombre: {{ enfermeroSeleccionado.nombre + " " + enfermeroSeleccionado.apellido }} </p>
                                    <small>Documento: {{ enfermeroSeleccionado.documento }}</small>
                                </a>
                            </template>
                            <template v-if="medicoSeleccionado">
                                <a :key="index" href="#" class="list-group-item lista-tramos list-group-item-action flex-column align-items-start list-group-flush no-pointer">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1"> Medico</h5>
                                        <template v-if="!disabled">
                                            <small class="small-x-large"><a href="#" @click="removerMedico()"><i class="fas fa-trash"></i></a></small>
                                        </template>
                                    </div>
                                    <p class="mb-1">Nombre: {{ medicoSeleccionado.nombre + " " + medicoSeleccionado.apellido }} </p>
                                    <small>Documento: {{ medicoSeleccionado.documento }}</small>
                                </a>
                            </template>
                        </div>

                        <template v-if="!disabled">
                            <input type="submit" @click="asignarEmpleados()" value="Asignar" class="btn marginBefore tableHeadingBackground">
                        </template>
                    </form>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Multiselect from 'vue-multiselect'
    import DescargaPlanillaTurnosVue from '../turno/DescargaPlanillaTurnos.vue';

	 export default {
        name: 'AsignarEmpleadosEvento',
            components: { 'multi-select': Multiselect,                      
        },
        mounted(){
            this.loading = true;
            this.evento = this.$parent.evento;
            this.evento.listaEmpleados = [];
            this.cargarRoles();
            this.cargarEmpleados();

        },
        beforeCreate: function () {
            var usuario = this.$session.get('usuario');
            if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
            this.$router.push('/usuario/login')
            } 
        },
        data(){
            return{
                tieneEmpleados: false,
                choferEnfermeroSeleccionado: null,
                enfermeroSeleccionado: null,
                choferSeleccionado: null,
                medicoSeleccionado: null,
                empleadosOriginales: [],
                loading: false,
                erroresForm: [],
                disabled: true,
                mostrarForm: false,
                errorDisponibilidad: '',
                evento: {
                    inicioEvento: '',
                    direccion: '',
                    persona: null,
                    servicio: null,
                    tipo: null,
                    direccion: '',
                    finEvento: '',
                    listaEmpleados: [],
                },
                roles: [],
                enfermeros: { lista: [] },
                choferes: { lista: [] },
                medicos: { lista: [] },
                choferesEnfermeros: { lista: [] },
                rol: null,
                equipo: 3,
                mostrarEquipos: false,
            }
        },
        watch: {
            equipo: function (val) {
                if(val == 2){
                    this.medicoSeleccionado = null;
                    this.choferEnfermeroSeleccionado = null;
                } else if( val == 1){
                    this.medicoSeleccionado = null;
                    this.enfermeroSeleccionado = null;
                } else {
                    this.choferEnfermeroSeleccionado = null;
                }
            }
                
        },
        methods: {
            toggleEditar(){
                this.disabled = !this.disabled;
                this.mostrarEquipos = !this.mostrarEquipos;
            },
            toggleForm(){
                this.mostrarForm = !this.mostrarForm;
                this.disabled = !this.disabled;
                this.mostrarEquipos = !this.mostrarEquipos;
            },
            removerEnfermero(){
                this.enfermeroSeleccionado = null;
            },
            removerChofer(){
                this.choferSeleccionado = null;
            },
            removerChoferEnfermero(){
                this.choferEnfermeroSeleccionado = null;
            },
            removerMedico(){
                this.medicoSeleccionado = null;
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
            cargarEmpleados(){
                axios.get(`${process.env.BASE_URL}/api/evento/lista-empleados-evento`, {
                params: {
                    evento: this.evento,
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        console.log("lista empleados evento");
                        console.log(res.data.listaEmpleados);
                        this.empleadosOriginales = res.data.listaEmpleados;
                        this.tieneEmpleados = true;
                        this.mostrarForm = true;
                        if(res.data.listaEmpleados.length){
                            res.data.listaEmpleados.forEach( empleado => { 
                            var desc = empleado.listaRoles[0].descripcion;
                            switch(desc) {
                                case "AUX. ENF.":
                                    this.enfermeros.lista.push(empleado);
                                    this.enfermeroSeleccionado = empleado;
                                    break;
                                case "CHOF. ESP.":
                                    this.choferes.lista.push(empleado);
                                    this.choferSeleccionado = empleado;
                                    break;
                                case "MED.":
                                    this.medicos.lista.push(empleado);
                                    this.medicoSeleccionado = empleado;
                                    break;
                                case "CHOF. ENF.":
                                    this.choferesEnfermeros.lista.push(empleado);
                                    this.choferEnfermeroSeleccionado = empleado;
                                default:
                                    null;
                            }
                            });
                        };
                    } else {
                        this.resultadoOperacion = "Este evento no tiene empleados asignados."
                    }
                        
                });
                this.loading = false;
            },
            cargarListas(){
                this.cargarEmpleadosDisponibles(this.roles.find(x => x.descripcion == "AUX. ENF."), this.enfermeros);
                this.cargarEmpleadosDisponibles(this.roles.find(x => x.descripcion == "CHOF. ESP."), this.choferes);
                this.cargarEmpleadosDisponibles(this.roles.find(x => x.descripcion == "MED."), this.medicos);
                this.cargarEmpleadosDisponibles(this.roles.find(x => x.descripcion == "CHOF. ENF."), this.choferesEnfermeros);
                
            },
            customLabelEmpleados ({ nombre, documento }) {
                return `${nombre} – ${documento}`
            },
            cargarEmpleadosDisponibles(pRol, array){
                axios.get(`${process.env.BASE_URL}/api/evento/lista-empleados-por-rol-evento`, {
                params: {
                    rol: pRol,
                    evento: this.evento,
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        array.lista = array.lista.concat(res.data.listaEmpleados);
                        array.lista.forEach(function(obj) { obj.disabled = false; });
                    }
                    this.loading = false;
                });
            },
            cambioSelect(){
                var indexRol = this.roles.findIndex((rol => rol.id == pRol.id));
                console.log(indexRol);
                this.roles[indexRol].disabled = false;
            },
            asignarEmpleados(){
                this.evento.listaEmpleados = [];
                if(this.choferSeleccionado){
                    this.choferSeleccionado.listaRoles = [ this.roles.find(x => x.descripcion == "CHOF. ESP.") ];
                    this.evento.listaEmpleados.push(this.choferSeleccionado);
                }
                if(this.enfermeroSeleccionado){
                    this.enfermeroSeleccionado.listaRoles = [ this.roles.find(x => x.descripcion == "AUX. ENF.") ];
                    this.evento.listaEmpleados.push(this.enfermeroSeleccionado)
                }
                if(this.choferEnfermeroSeleccionado){
                    this.choferEnfermeroSeleccionado.listaRoles = [ this.roles.find(x => x.descripcion == "CHOF. ENF.") ];
                    this.evento.listaEmpleados.push(this.choferEnfermeroSeleccionado);
                }
                if(this.medicoSeleccionado){
                    this.medicoSeleccionado.listaRoles = [ this.roles.find(x => x.descripcion == "MED.") ];
                    this.evento.listaEmpleados.push(this.medicoSeleccionado);
                }

                if(this.checkForm()){

                    var params = this.evento;
                    
                    /*
                    var empleadosDelete = this.empleadosOriginales.filter( original => {
                        return this.evento.listaEmpleados.some( n => {
                            console.log(original.id + " " + n.id);
                        return original.id != n.id
                        });
                    });

                    if(empleadosDelete.length){
                        this.eliminarEmpleadosEvento(empleadosDelete);            
                    }*/
                    
                    axios.post(`${process.env.BASE_URL}/api/evento/asignar-empleados-evento`, params) 
                        .then((res)=>{
                            console.log(res);                            
                            if(res.data.resultado == 5806){
                                this.resultadoOperacion = "Empleados asignados satisfactoriamente.";
                                this.limpiarCajas();    
                            } else if (res.data.resultado == 5807){
                                this.resultadoOperacion = "Error en asignación.";
                            }
                        }); 
                    this.loading = false;
                }
            },

            eliminarEmpleadosEvento(empleadosDelete){
                axios.delete(`${process.env.BASE_URL}/api/evento/eliminar-empleados-evento`, { 
                    data: { 
                        id: this.evento.id,
                        listaEmpleados: empleadosDelete 
                        }
                    }) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5808){
                            //this.$router.push({ name: 'PrincipalEvento', params: { resultadoOperacion: "Evento eliminado satisfactoriamente." }});                                                        
                        } else if (res.data.resultado == 5809){
                            //this.$router.push({ name: 'PrincipalEvento', params: { resultadoOperacion: "El evento seleccionado no existe." }});                                                        
                        }
                    });    
            },
            limpiarCajas(){
                errorDisponibilidad: '';
            },
            checkForm() {
                return true;
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
<style>
.lista-tramos{
    width: fit-content;
    min-width: 60%;
}

.no-pointer{
    cursor: default;
}

.small-x-large{
    font-size: larger;
}
</style>