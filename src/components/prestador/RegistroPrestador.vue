<template>
    <div>
        <h1 class="mainTitle">
        Prestadores
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de prestador</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarPrestador()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre descriptivo</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="prestador.nombreDescriptivo" id="nombre" placeholder="Nombre descriptivo">
                        <small id="nameHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="convenio" class="darkTextCustom">Tiene convenio</label>
                        <input type="checkbox" class="form-control border-success" id="convenio" v-model="checked">
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
        name: 'RegistroPrestador',
        mounted(){ 
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
            	prestador: {
                    id: 0,
                    nombreDescriptivo: '',
                    esprestador: '',
                },
                errorDisponibilidad: '',
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.prestador && this.prestador.nombreDescriptivo != ''){
                    console.log("nombre -" + this.prestador.nombreDescriptivo)
                    axios.get('${process.env.BASE_URL}/api/cliente/existe-prestador', {
                        params: {
                        nombre: this.prestador.nombreDescriptivo,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Ya existe un prestador registrado con ese nombre.";
                            } else {
                                this.errorDisponibilidad = "Nombre disponible.";    
                                this.disabled = false;                              
                            }
                    });
                }
            },
            registrarPrestador(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.prestador;
                    console.log(params);
                    axios.post('${process.env.BASE_URL}/api/cliente/agregar-prestador', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5422){
                                this.$router.push({ name: 'ListadoPrestador', params: { resultadoOperacion: "Prestador creado satisfactoriamente." }});  
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5423 || res.data.resultado == 5420){
                                this.resultadoOperacion = "Ya existe un prestador con ese nombre.";
                            }
                            else if(res.data.resultado == 4){
                                this.resultadoOperacion = "Hubo un error durante el proceso. Vuelve a intentarlo. Si persiste el problema, contacta al soporte.";
                            }
                        });
                }
                this.loading = false;
            },
            limpiarCajas(){
                this.prestador = {
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

                if (this.prestador.nombreDescriptivo) {
                    return true;
                }

                if (!this.prestador.nombreDescriptivo) {
                    this.erroresForm.push('Nombre descriptivo requerido.');
                }
                
                this.disabled = false;
                return false;
            }
        },    
    }
</script>