<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Asignar Funcionarios</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="asignarEmpleados()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>

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

                    <template v-if="chofer()">
                        <multi-select v-model="choferSeleccionado" placeholder="Chofer" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="choferes.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">
                            
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
                        <multi-select v-model="enfermeroSeleccionado" placeholder="Enfermero" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="enfermeros.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">    
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
                        <multi-select v-model="medicoSeleccionado" placeholder="Médico" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="medicos.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">
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
                        <multi-select v-model="choferEnfermeroSeleccionado" placeholder="Chofer enfermero" :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="choferesEnfermeros.lista" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">
                            <template slot="option" slot-scope="props">
                                <div class="option__desc">
                                    <span class="option__title">{{ props.option.nombre }} {{ props.option.apellido }}</span>
                                    <br>
                                    <span class="option__small">{{ props.option.documento }}</span>
                                </div>
                            </template>
                        </multi-select>
                    </template>        

                    <input type="submit" :disabled="disabled" value="Asignar" class="btn marginBefore tableHeadingBackground">
                    
                </form>
            </div>
        </div>
    </div>
</template>

<script>
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
                equipo: 3
            }
        },
        methods: {
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
