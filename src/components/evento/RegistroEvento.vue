<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Eventos</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarEvento()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>

                    
                    <multi-select v-model="personaSeleccionada" placeholder="Personas"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="personas" :option-height="104" :custom-label="customLabelPersonas" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.documento }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <br> 
                    
                    <multi-select v-model="servicioSeleccionado" placeholder="Servicios" :optionsLimit="3" :tabindex="2" track-by="nombre" :options="servicios" :option-height="104" :custom-label="customLabelServicios" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.descripcion }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <br>

                    <multi-select v-model="tipoEventoSeleccionado" placeholder="Tipo Evento"  :optionsLimit="3" :tabindex="3" track-by="nombre" :options="tiposEventos" :option-height="104" :custom-label="customLabelTiposEventos" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.descripcion }}</span>
                            </div>
                        </template>
                    </multi-select>
                
                    <div class="form-group">
                        <label for="fecha" class="darkTextCustom">Fecha</label>
                        <input type="date" class="form-control border-success" v-model="fechaInicio" id="fecha" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaI" class="darkTextCustom">Hora Inicio</label>
                        <input type="time"  class="form-control border-success" id="horaI" v-model="horaInicio"/>
                    </div>
                    <div class="form-group">
                        <label for="fechaF" class="darkTextCustom">Fecha Finalización</label>
                        <input type="date" class="form-control border-success" v-model="fechaFin" id="fechaF" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaF" class="darkTextCustom">Hora Finalización (Opcional) </label>
                        <input type="time"  class="form-control border-success" id="horaF" v-model="horaFin"/>
                    </div>
                    <div class="form-group">
                        <label for="direccion" class="darkTextCustom">Dirección</label>
                        <input type="text" class="form-control border-success" v-model="evento.direccion" id="direccion" placeholder="direccion">
                    </div>

                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Multiselect from 'vue-multiselect'


	 export default {
        name: 'RegistroEvento',
        components: { 'multi-select': Multiselect,                      
        },
        mounted(){
            this.loading = true;
            this.cargarPersonas();
            this.cargarServicios();
            this.cargarTiposEventos();
            },
        beforeCreate: function () {
            var usuario = this.$session.get('usuario');
            if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
            this.$router.push('/usuario/login')
            } 
        },
        data(){
            return{
                personaSeleccionada: null,
                servicioSeleccionado: null,
                tipoEventoSeleccionado: null,
                loading: false,
                resultadoOperacion: '',
                erroresForm: [],
                disabled: false,
            	localidades: [],
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
                personas: [],
                servicios: [],
                tiposEventos: [],
                horaInicio: null,
                horaFin: null,
                fechaInicio: null,
                fechaFin: null,
            }
        },
        methods: {
            customLabelPersonas ({ nombre, documento }) {
                return `${nombre} – ${documento}`
            },
            customLabelServicios ({ nombre, descripcion }) {
                return `${nombre} – ${descripcion}`
            },
            customLabelTiposEventos ({ nombre }) {
                return `${nombre}`
            },
            cargarPersonas(){
                axios.get(`${process.env.BASE_URL}/api/cliente/lista-personas`, {
                params: {
                    }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.personas = res.data.listaPersonas;
                    }
                    this.loading = false;
        	    });         
            },
            cargarServicios(){
                axios.get(`${process.env.BASE_URL}/api/servicio/lista-servicios`, {
                params: {
                    }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.servicios = res.data.listaServicios;
                    }
                    this.loading = false;
        	    });         
            },
            cargarTiposEventos(){
                axios.get(`${process.env.BASE_URL}/api/evento/lista-tipos-eventos`, {
                params: {
                    }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.tiposEventos = res.data.listaTiposEventos;
                    }
                    this.loading = false;
        	    });         
            },
            registrarEvento(){
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
                    
                    axios.post(`${process.env.BASE_URL}/api/evento/agregar-evento`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5802){
                                this.resultadoOperacion = "Evento agregado satisfactoriamente.";
                                this.limpiarCajas();    
                            } else if (res.data.resultado == 5803){
                                this.resultadoOperacion = "Error en el alta.";
                            }
                        }); 
                    this.loading = false;
                }
            },
            limpiarCajas(){
                errorDisponibilidad: '';
            },
            checkForm() {
                if (this.fechaInicio && this.horaInicio && this.direccion != ''
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
            }
    
        },    
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>