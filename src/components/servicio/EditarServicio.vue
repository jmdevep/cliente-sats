<template>
    <div>
        <div class="card mb-3">
            <div class="card-body darkTextCustom">
                <form>
                    <button @click="disabled = !disabled" class="btn marginBefore tableHeadingBackground">
                        {{ disabled ? "Editar" : "Cancelar"}}
                    </button>
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
                        <input type="text" :disabled="disabled" class="form-control border-success" v-model="servicio.nombre" id="nombre" placeholder="Nombre">
                        <small id="nombreDisponibilidad" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small> 
                    </div>
                    <div class="form-group">
                        <label for="descripcion" class="darkTextCustom">Descripción</label>
                        <input type="text" :disabled="disabled" class="form-control border-success" v-model="servicio.descripcion" id="descripcion" placeholder="descripcion">
                    </div>
                    <div class="form-group">
                        <label for="costo" class="darkTextCustom">Costo</label>
                        <input type="text" :disabled="disabled" class="form-control border-success" v-model="servicio.costo" id="costo" placeholder="Costo">            
                    </div>
                    <template v-if="!disabled">
                       <input type="submit" value="Modificar" @click="modificarServicio()" class="btn marginBefore tableHeadingBackground">
                    </template>
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
            this.servicio = this.$route.params.servicio;
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
                disabled: true,
                alerta: false,
                informacion: false,
            }
        },
        methods: {
            modificarServicio(){
                this.loading = true;
                this.limpiarResultado();
                if(this.checkForm()){
                    var params = this.servicio;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/servicio/modificar-servicio`, params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5504){
                            this.$router.push({ name: 'PrincipalEvento', params: { resultadoOperacion: "Servicio modificado satisfactoriamente." }});
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5505){
                                this.alerta = true;
                                this.resultadoOperacion = "Error en la modificación.";
                            }
                            else {
                               this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                               this.alerta = true;
                            }
                            this.loading = false;
                        })
                        .catch((error)=>{
                            this.alerta = true;
                            this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                            console.log(error);
                            this.loading = false;
                    });
                        
                }
            },
            verificarDisponibilidad() {
                this.errorDisponibilidad = "Verificando...";
                //this.disabled = true;
                if(this.localidad.nombre != ''){
                    axios.get(`${process.env.BASE_URL}/api/servicio/existe-servicio`, {
                        params: {
                            nombre: this.servicio.nombre,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true || res.data.resultado == '5500'){
                                //this.disabled = true;
                                this.errorDisponibilidad = "Servicio ya registrado.";
                            } else {
                                this.errorDisponibilidad = "";    
                                //this.disabled = false;                              
                            }
                    })
                    .catch((error)=>{
                        this.errorDisponibilidad = 'Ha surgido un error durante la verificación. Inténtelo nuevamente.';
                        console.log(error);
                        this.loading = false;
                        //this.disabled = true;
                    });
                }
            },
            limpiarResultado(){
                this.resultadoOperacion = '';
                this.alerta = false;
                this.informacion = false;
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
