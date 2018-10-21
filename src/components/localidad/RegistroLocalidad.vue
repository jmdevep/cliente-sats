<template>
    <div>
        <h1 class="mainTitle">
        Localidades
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Localidades</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarLocalidad()">
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p class="text-danger" v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>

                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre </label>
                        <input @blur="verificarDisponibilidad()" type="text" maxlength="45" class="form-control border-success" v-model="localidad.nombre" id="nombre" placeholder="Nombre">
                        <small id="nombreDisponibilidad" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>   
                    </div>  
                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'RegistroLocalidad',
        mounted(){

        	},
        data(){
            return{
                loading: false,
                resultadoOperacion: null,
                erroresForm: [],
            	localidad: {
                    nombre: '',
                },
                alerta: false,
                informacion: false,
                errorDisponibilidad: '',
                disabled: true,
            }
        },
        methods: {
            registrarLocalidad(){
                this.limpiarResultado;
                this.loading = true;
                if(this.checkForm()){
                    var params = this.localidad;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/localidad/agregar-localidad`, params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5602){
                                this.informacion = true;
                                this.resultadoOperacion = "Alta de localidad exitosa.";
                                this.limpiarCajas();
                            } else if(res.data.resultado == 5603){
                                this.alerta = true;
                                this.resultadoOperacion = "Error en el alta."
                            }else{
                                this.resultadoOperacion = "Ha surgido un error en el proceso. Inténtelo nuevamente.";
                                this.alerta = true;
                            }
                            this.loading = false;
                        })
                        .catch((error)=>{
                        this.alerta = true;
                        this.resultadoOperacion = 'Ha surgido un error en el sistema. Inténtelo nuevamente.';
                        console.log(error);
                        this.loading = false;
                    });
                }
            },
            verificarDisponibilidad() {
                this.errorDisponibilidad = "Verificando...";
                this.disabled = true;
                if(this.localidad.nombre != ''){
                    axios.get(`${process.env.BASE_URL}/api/localidad/existe-localidad`, {
                        params: {
                            nombre: this.localidad.nombre,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true || res.data.resultado == '5600'){
                                this.disabled = true;
                                this.errorDisponibilidad = "Localidad ya registrada.";
                            } else {
                                this.errorDisponibilidad = "";    
                                this.disabled = false;                              
                            }
                    })
                    .catch((error)=>{
                        this.errorDisponibilidad = 'Ha surgido un error durante la verificación. Inténtelo nuevamente.';
                        console.log(error);
                        this.loading = false;
                        this.disabled = true;
                    });
                }
            },
            limpiarResultado(){
                this.alerta = false;
                this.informacion = false;
                this.resultadoOperacion = '';
            },
            limpiarCajas(){
                this.localidad.nombre = '';
            },
            checkForm() {
                if (this.localidad.nombre) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.localidad.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }                

                return false;
            }
        },    
    }
</script>
