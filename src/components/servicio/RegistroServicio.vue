<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Servicios</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarServicio()">
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
                        <input type="text" class="form-control border-success" v-model="servicio.nombre" id="nombre" placeholder="Nombre">
                    </div>
                    <div class="form-group">
                        <label for="descripcion" class="darkTextCustom">Descripción</label>
                        <input type="text" class="form-control border-success" v-model="servicio.descripcion" id="descripcion" placeholder="descripcion">
                    </div>
                    <div class="form-group">
                        <label for="costo" class="darkTextCustom">Costo</label>
                        <input type="text" class="form-control border-success" v-model="servicio.costo" id="costo" placeholder="Costo">            
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
        name: 'RegistroServicio',
        mounted(){

        	},
        data(){
            return{
                loading: false,
                resultadoOperacion: null,
                erroresForm: [],
            	servicio: {
                    nombre: '',
                    descripcion: '',
                    costo: 0,
                },
            }
        },
        methods: {
            registrarServicio(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.servicio;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/servicio/agregar-servicio`, params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5502){
                                this.resultadoOperacion = "Alta de servicio exitosa.";
                                this.limpiarCajas();
                            } else if(res.data.resultado == 5503){
                                this.resultadoOperacion = "Error en el alta."
                            }
                        });
                        this.loading = false;
                }
            },
            limpiarCajas(){
                this.servicio.nombre = '';
                this.servicio.descripcion = '';
                this.servicio.costo = '';
            },
            checkForm() {
                if (this.servicio.nombre && this.servicio.descripcion && this.servicio.costo) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.servicio.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }                
                if (!this.servicio.descripcion) {
                    this.erroresForm.push('Descripción requerida.');
                }                
                if (!this.servicio.costo) {
                    this.erroresForm.push('Costo requerido.');
                }      
                return false;
            }
        },    
    }
</script>
