<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Llamado</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarLlamado()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>

       
                <!--    <multi-select v-model="llamado.paciente" placeholder="Personas"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="personas" :option-height="104" :custom-label="customLabelPersonas" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.documento }}</span>
                            </div>
                        </template>
                    </multi-select>
                -->
                    <br> 
                    
                    <label>Clasificación: *</label>
                    <select  class="form-control" v-model="llamado.clasificacion">
                        <option v-for="(c, index) in clasificaciones" :key="index" v-bind:value="c.id">
                            {{ c.nombre }}
                        </option>
                    </select>

                    <div class="form-group">
                        <label for="ubicacionPaciente" class="darkTextCustom">Ubicación paciente *</label>
                        <input type="text" maxlength="150" class="form-control border-success" v-model="llamado.ubicacionPaciente" id="ubicacionPaciente" placeholder="Ubicación del paciente">
                    </div>
                    <div class="form-group">
                        <label for="destinoPaciente" class="darkTextCustom">Destino paciente *</label>
                        <input type="text" maxlength="150" class="form-control border-success" v-model="llamado.destinoPaciente" id="destinoPaciente" placeholder="Destino del paciente">
                    </div>

                    <div class="form-group">
                        <label for="motivo" class="darkTextCustom">Motivo del llamado *</label>
                        <input type="text" maxlength="150" class="form-control border-success" v-model="llamado.motivoLlamado" id="motivo" placeholder="motivo">
                    </div>
                    <div class="form-group">
                        <label for="fecha" class="darkTextCustom">Fecha recibido *</label>
                        <input type="date" class="form-control border-success" v-model="fechaRecibido" id="fecha" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaI" class="darkTextCustom">Hora recibido *</label>
                        <input type="time"  class="form-control border-success" id="horaI" v-model="horaRecibido"/>
                    </div>
 <!--
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
                    </div> -->

                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Multiselect from 'vue-multiselect'
    const moment = require('moment-timezone');

	 export default {
        name: 'RegistroLlamado',
        components: { 'multi-select': Multiselect,                      
        },
        mounted(){
            this.loading = true;
            this.cargarPersonas();
            this.cargarPrestadores();

            this.fechaRecibido = this.obtenerFechaActual();
            this.horaRecibido = this.obtenerHoraActual();
            this.fechaSalida = this.obtenerFechaActual();
            this.horaSalida = this.obtenerHoraActual();
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
                clasificaciones: [
                    {nombre: "CLAVE 1", id:  1},
                    {nombre: "CLAVE 2", id: 2},
                    {nombre: "CLAVE 3", id: 3},
                ],
                errorDisponibilidad: '',
                llamado: {
                    paciente: null,
                    ubicacionPaciente: '',
                    destinoPaciente: '',
                    motivoLlamado: '',
                    prestadorCobertura: null,
                    fechaRecibido: null,
                    fechaLlegadaAsistencia: null,
                    fechaSalidaMovil: null,
                    fechaLlegadaDestinoPaciente: null
                },
                fechaRecibido: null,
                horaRecibido: null,
                fechaSalida: null,
                horaSalida: null,
                fechaLlegadaAsistencia: null,
                horaLlegadaAsistencia: null,
                fechaLlegadaDestino: null,
                horaLlegadaDestino: null,
            }
        },
        methods: {
            obtenerFechaActual(){
                var fechaActual = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                fechaActual.tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss');
                console.log(fechaActual);
                return moment.parseZone(fechaActual).format('YYYY-MM-DD');
            },
            obtenerHoraActual(){
                var horaActual = moment(new Date(), 'HH:mm:ss');
                horaActual.tz("America/Argentina/Buenos_Aires").format('HH:mm:ss');
                console.log(horaActual);
                return moment.parseZone(horaActual).format('HH:mm');
            },
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
            registrarLlamado(){
                this.llamado.fechaRecibido = moment(`${this.fechaRecibido} ${this.horaRecibido}`,'YYYY-MM-DD HH:mm:ss').format();
                this.llamado.fechaLlegadaAsistencia = moment(`${this.fechaLlegadaAsistencia} ${this.horaLlegadaAsistencia}`,'YYYY-MM-DD HH:mm:ss').format();
                this.llamado.fechaSalidaMovil = moment(`${this.fechaSalida} ${this.horaSalida}`,'YYYY-MM-DD HH:mm:ss').format();
                this.llamado.fechaLlegadaDestinoPaciente = moment(`${this.fechaLlegadaDestino} ${this.horaLlegadaDestino}`,'YYYY-MM-DD HH:mm:ss').format();
                
                var params = this.llamado;

                this.loading = true;

                console.log(params);

                if(this.checkForm()){

                    axios.post(`${process.env.BASE_URL}/api/llamado/agregar-llamado`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 6002){
                                this.resultadoOperacion = "Evento agregado satisfactoriamente.";
                                this.limpiarCajas();    
                            } else if (res.data.resultado == 6003){
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
                return true;
            }
    
        },    
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>