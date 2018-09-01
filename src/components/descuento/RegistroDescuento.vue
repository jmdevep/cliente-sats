<template>
    <div>
        <h1 class="mainTitle">
        Clientes
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de descuento</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarDescuento()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <div class="form-group">
                        <label for="motivo" class="darkTextCustom">Motivo del descuento</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="descuento.motivo" id="motivo" placeholder="Motivo descriptivo del descuento">
                        <small id="nameHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="porcentaje" class="darkTextCustom">Porcentaje de descuento</label>
                        <input type="text" class="form-control border-success" v-model="descuento.porcentaje" id="porcentaje" placeholder="Porcentaje descuento">
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
        name: 'RegistroDescuento',
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
            	descuento: {
                    id: 0,
                    motivo: '',
                    porcentaje: '',
                },
                errorDisponibilidad: '',
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.descuento != null && this.descuento.motivo != ''){
                    console.log("motivo -" + this.descuento.motivo)
                    axios.get('${process.env.BASE_URL}/api/cliente/existe-descuento', {
                        params: {
                        motivo: this.descuento.motivo,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Ya existe un descuento registrado con ese motivo.";
                            } else {
                                this.errorDisponibilidad = "Motivo disponible.";    
                                this.disabled = false;                              
                            }
                    });
                }
            },
            registrarDescuento(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.descuento;
                    console.log(params);
                    axios.post('${process.env.BASE_URL}/api/cliente/agregar-descuento', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5452){
                                this.resultadoOperacion = "Descuento agregado satisfactoriamente.";
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5453){
                                this.resultadoOperacion = "Ya existe un descuento con ese motivo.";
                            }
                            else if(res.data.resultado == 4){
                                this.resultadoOperacion = "Hubo un error durante el proceso. Vuelve a intentarlo. Si persiste el problema, contacta al soporte.";
                            }
                        });
                }
                this.loading = false;
            },
            limpiarCajas(){
                this.descuento = {
                    id: 0,
                    motivo: '',
                    porcentaje: 0,
                },
                this.erroresForm = [];
                this.errorDisponibilidad = '';
            },
            limpiarMensajes(){
                this.resultadoOperacion = "";
                this.erroresForm = [];
            },
            checkForm() {
                limpiarMensajes();
                if (this.descuento.motivo && this.descuento.porcentaje && this.descuento.porcentaje >= 0 && this.descuento.porcentaje <= 100) {
                    return true;
                }

                if (!this.descuento.motivo) {
                    this.erroresForm.push('Motivo descriptivo requerido.');
                }
                if (!this.descuento.porcentaje) {
                    this.erroresForm.push('Porcentaje de descuento requerido.');
                }
                else if(this.descuento.porcentaje < 0 || this.descuento.porcentaje > 100){
                    this.erroresForm.push('El valor del porcentaje debe ser un número entre 0 y 100.');
                }

                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>