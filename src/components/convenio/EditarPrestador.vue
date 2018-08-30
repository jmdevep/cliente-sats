<template>
    <div>
        <h1 class="mainTitle">
        Prestadores
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Editar prestador</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarPrestador()">
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
        name: 'Editarprestador',
        mounted(){ 
            this.prestador= this.$route.params.prestador;
            this.nombreOriginal = this.$route.params.prestador.nombreDescriptivo;
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
            	prestador: {
                    id: 0,
                    nombreDescriptivo: '',
                    activo: '',
                    esConvenio: '',
                },
                errorDisponibilidad: '',
                nombreOriginal: '',
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.prestador && this.prestador.nombreDescriptivo && this.prestador.nombreDescriptivo != this.nombreOriginal){
                    console.log("nombre -" + this.prestador.nombreDescriptivo)
                    axios.get('http://localhost:4567/api/cliente/existe-prestador', {
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
                else if(this.prestador.nombreDescriptivo == this.nombreOriginal){
                    this.errorDisponibilidad = "Sin cambios.";    
                    this.disabled = false;     
                }
            },
            modificarPrestador(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.prestador;
                    console.log(params);
                    axios.post('http://localhost:4567/api/cliente/modificar-prestador', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5420 || res.data.resultado == 5424){
                                this.$router.push({ name: 'ListadoPrestador', params: { resultadoOperacion: "Prestador modificado satisfactoriamente." }});  
                            } else if (res.data.resultado == 5421 || res.data.resultado == 5425){
                                
                                this.resultadoOperacion = "Ya existe un prestador con ese nombre.";
                            }
                            else{
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
                    activo: '',
                    esConvenio: '',
                }
                this.errorDisponibilidad = '';
            },
            limpiarMensajes(){
                this.resultadoOperacion = "";
                this.erroresForm = [];
            },
            checkForm() {
                this.limpiarMensajes();
                if (this.prestador.nombreDescriptivo && this.prestador.fechaInicio && this.prestador.empresa && this.prestador.empresa.id != 0) {
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