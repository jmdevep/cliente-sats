<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Llamado</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registarLlamado()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>

                    
                    <multi-select v-model="llamado.paciente" placeholder="Personas"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="personas" :option-height="104" :custom-label="customLabelPersonas" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.documento }}</span>
                            </div>
                        </template>
                    </multi-select>

                    <br> 
                    
                    <label>Clasificación:</label>
                    <select  class="form-control" v-model="llamado.clasificacion">
                        <option v-for="(c, index) in clasificaciones" :key="index" v-bind:value="c.id">
                            {{ c.nombre }}
                        </option>
                    </select>


                    <div class="form-group">
                        <label for="ubicacionPaciente" class="darkTextCustom">Ubicación paciente</label>
                        <input type="text" class="form-control border-success" v-model="llamado.ubicacionPaciente" id="ubicacionPaciente" placeholder="Ubicación del paciente">
                    </div>
                    <div class="form-group">
                        <label for="destinoPaciente" class="darkTextCustom">Destino paciente</label>
                        <input type="text" class="form-control border-success" v-model="llamado.destinoPaciente" id="destinoPaciente" placeholder="Destino del paciente">
                    </div>

                    <div class="form-group">
                        <label for="motivo" class="darkTextCustom">Motivo del llamado</label>
                        <input type="text" class="form-control border-success" v-model="llamado.motivo" id="motivo" placeholder="motivo">
                    </div>

                    <p>Cobertura de: </p>
                    <multi-select v-model="llamado.prestadorCobertura" placeholder="Cobertura de"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="prestadores" :option-height="104" :custom-label="customLabelPrestadores" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">Nombre: {{ props.option.nombreDescriptivo }}</span>
                            </div>
                        </template>
                    </multi-select>

                    <div class="form-group">
                        <label for="fecha" class="darkTextCustom">Fecha recibido</label>
                        <input type="date" class="form-control border-success" v-model="fechaRecibido" id="fecha" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaI" class="darkTextCustom">Hora recibido</label>
                        <input type="time"  class="form-control border-success" id="horaI" v-model="horaRecibido"/>
                    </div>

                    <hr>

                    <div class="form-group">
                        <label for="fechaSalida" class="darkTextCustom">Fecha salida móvil</label>
                        <input type="date" class="form-control border-success" v-model="fechaSalida" id="fechaSalida" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaSalida" class="darkTextCustom">Hora salida móvil</label>
                        <input type="time"  class="form-control border-success" id="horaSalida" v-model="horaSalida"/>
                    </div> 

                    <div class="form-group">
                        <label for="fechaLlegadaAsistencia" class="darkTextCustom">Fecha de llegada al lugar de asistencia</label>
                        <input type="date" class="form-control border-success" v-model="fechaLlegadaAsistencia" id="fechaLlegadaAsistencia" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaLlegadaAsistencia" class="darkTextCustom">Hora de llegada al lugar de asistencia</label>
                        <input type="time"  class="form-control border-success" id="horaLlegadaAsistencia" v-model="horaLlegadaAsistencia"/>
                    </div> 

                    <div class="form-group">
                        <label for="fechaLlegadaDestino" class="darkTextCustom">Fecha de llegada a destino del paciente</label>
                        <input type="date" class="form-control border-success" v-model="fechaLlegadaDestino" id="fechaLlegadaDestino" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaLlegadaDestino" class="darkTextCustom">Hora de llegada a destino del paciente</label>
                        <input type="time"  class="form-control border-success" id="horaLlegadaDestino" v-model="horaLlegadaDestino"/>
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
        name: 'RegistroLlamado',
        components: { 'multi-select': Multiselect,                      
        },
        mounted(){
            this.loading = true;
            this.cargarPersonas();
            this.cargarPrestadores();

            },
        beforeCreate: function () {
            var usuario = this.$session.get('usuario');
            if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
            this.$router.push('/usuario/login')
            } 
        },
        data(){
            return{
                loading: false,
                resultadoOperacion: '',
                erroresForm: [],
                disabled: false,
                prestadores: [],
                personas: [],
                clasificaciones: [],
                errorDisponibilidad: '',
                llamado: {
                    paciente: null,
                    ubicacionPaciente: '',
                    destinoPaciente: '',
                    motivo: '',
                    prestadorCobertura: null,
                }
                
            }
        },
        methods: {
             cargarPrestadores(){
                axios.get(`${process.env.BASE_URL}/api/cliente/lista-prestadores`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.prestadores = res.data.prestadores;
                    }
                    this.loading = false;
                });
            },
            customLabelPersonas ({ nombre, documento }) {
                return `${nombre} – ${documento}`
            },
            customLabelPrestadores ({ nombreDescriptivo }) {
                return `${ nombreDescriptivo } `
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