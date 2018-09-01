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
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <p v-if="resultadoOperacion">{{ resultadoOperacion }}</p>

                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre </label>
                        <input type="text" class="form-control border-success" v-model="localidad.nombre" id="nombre" placeholder="Nombre">
                    </div>  
                    <input type="submit" value="Registrar" class="btn marginBefore tableHeadingBackground">
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
            }
        },
        methods: {
            registrarLocalidad(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.localidad;
                    console.log(params);
                    axios.post('${process.env.BASE_URL}/api/localidad/agregar-localidad', params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5602){
                                this.resultadoOperacion = "Alta de localidad exitosa.";
                                this.limpiarCajas();
                            } else if(res.data.resultado == 5603){
                                this.resultadoOperacion = "Error en el alta."
                            }
                        });
                        this.loading = false;
                }
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
