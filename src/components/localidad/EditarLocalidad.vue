<template>
    <div>
        <h1 class="mainTitle">
        Localidades
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modifcar Localidad</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarLocalidad()">
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
                    <input type="submit" value="Modificar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EditarLocalidad',
        mounted(){
            this.localidad = this.$route.params.localidad;
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
            modificarLocalidad(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.localidad;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/localidad/modificar-localidad`, params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5604){
                            this.$router.push({ name: 'ListadoLocalidad', params: { resultadoOperacion: "Localidad modificada satisfactoriamente." }});                               
                            } else if(res.data.resultado == 5605){
                                this.resultadoOperacion = "Error en la modificación.";
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
