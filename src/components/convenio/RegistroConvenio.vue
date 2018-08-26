<template>
    <div>
        <h1 class="mainTitle">
        Convenios
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Convenio</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarConvenio()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Empresa</label>
                        <input type="text"  class="form-control border-success" v-model="convenio.empresa.nombre" id="nombre" disabled="true" >
                    </div>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre descriptivo</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="convenio.nombreDescriptivo" id="nombre" placeholder="Nombre descriptivo">
                        <small id="nameHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="fechaInicio" class="darkTextCustom">Fecha de Inicio</label>
                        <input type="date" class="form-control border-success" v-model="convenio.fechaInicio" id="fechaInicio" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="fechaFin" class="darkTextCustom">Fecha de Fin</label>
                        <input type="date" class="form-control border-success" v-model="convenio.fechaFin" id="fechaFin" placeholder="2019-12-05">
                    </div>
                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore btn-success">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'RegistroConvenio',
        mounted(){ 
            this.convenio.empresa = this.$route.params.empresa;
            console.log(this.empresa);
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
                disabled: true,
            	convenio: {
                    id: 0,
                    nombreDescriptivo: '',
                    fechaInicio: '',
                    fechaFin: '',
                    empresa:{
                        id: 0,
                        nombre: '',
                        direccion: '',
                        telefono: '',
                        rut: '',
                    },
                },
                errorDisponibilidad: '',
                convenios:[],
                convenioSeleccionado: null,
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.convenio != null && this.convenio.nombreDescriptivo != ''){
                    console.log("nombre -" + this.convenio.nombreDescriptivo)
                    axios.get('http://localhost:4567/api/cliente/existe-convenio', {
                        params: {
                        nombre: this.convenio.nombreDescriptivo,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Ya existe un convenio registrado con ese nombre.";
                            } else {
                                this.errorDisponibilidad = "Nombre disponible.";    
                                this.disabled = false;                              
                            }
                    });
                }
            },
            registrarConvenio(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.convenio;
                    console.log(params);
                    axios.post('http://localhost:4567/api/cliente/agregar-convenio', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5422){
                                this.$router.push({ name: 'ListadoConvenio', params: { resultadoOperacion: "Convenio creado satisfactoriamente." }});  
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5423 || res.data.resultado == 5420){
                                this.resultadoOperacion = "Ya existe un convenio con ese nombre.";
                            }
                            else if(res.data.resultado == 4){
                                this.resultadoOperacion = "Hubo un error durante el proceso. Vuelve a intentarlo. Si persiste el problema, contacta al soporte.";
                            }
                        });
                }
                this.loading = false;
            },
            limpiarCajas(){
                this.convenio = {
                    id: 0,
                    nombreDescriptivo: '',
                    fechaInicio: '',
                    fechaFin: '',
                    empresa:{
                        id: 0,
                        nombre: '',
                        direccion: '',
                        telefono: '',
                        rut: '',
                    },
                }
                this.errorDisponibilidad = '';
            },
            limpiarMensajes(){
                this.resultadoOperacion = "";
                this.erroresForm = [];
            },
            checkForm() {
                this.limpiarMensajes();

                if (this.convenio.nombreDescriptivo && this.convenio.fechaInicio && this.convenio.empresa && this.convenio.empresa.id != 0) {
                    return true;
                }

                if (!this.convenio.nombreDescriptivo) {
                    this.erroresForm.push('Nombre descriptivo requerido.');
                }
                if (!this.convenio.fechaInicio) {
                    this.erroresForm.push('Fecha de inicio requerida.');
                }
                if(!this.convenio.empresa || this.convenio.empresa.id == 0){
                    this.erroresForm.push('Debe seleccionar una empresa.');
                }
                
                this.disabled = false;
                return false;
            }
        },    
    }
</script>