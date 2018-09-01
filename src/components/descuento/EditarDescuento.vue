<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modificar descuento</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarDescuento()">
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
                    <input type="submit" :disabled="disabled" value="Modificar" class="btn marginBefore btn-success">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EditarMotivo',
        mounted(){
            this.descuento = this.$route.params.descuento;
            this.nombreOriginal = this.$route.params.descuento.motivo;
            //this.loading = true;    
            console.log(this.descuento);
            /*axios.get('${process.env.BASE_URL}/api/cliente/lista-descuentos')
            .then((res)=>{
                console.log(res);
                if(res.data.resultado == 100){
                    this.descuentos = res.data.descuentos;
                    this.descuentos.forEach(function(obj) { obj.disabled = false; });
                }
                this.loading = false;
        	});
            console.log(this.$route.params.plan);
            this.plan = this.$route.params.plan;*/
            },
        beforeCreate: function () {
            if (!this.$session.exists()) {
            this.$router.push('/usuario/login')
            }
        },
        data(){
            return{
                loading: false,
                resultadoOperacion: '',
                erroresForm: [],
                disabled: false,
            	descuento: {
                    id: 0,
                    motivo: '',
                    porcentaje: '',
                },
                errorDisponibilidad: '',
                nombreOriginal: '',
            }
        },
        methods: {
            cambioSelect () {

            },
             verificarDisponibilidad() {
                 console.log(this.nombreOriginal);
                 console.log(this.descuento.motivo);
                if(this.descuento != null && this.descuento.motivo != '' && this.nombreOriginal != this.descuento.motivo){
                    this.loading = true;
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
                    this.loading = false;
                }
                else if(this.nombreOriginal == this.descuento.motivo){
                    this.errorDisponibilidad = "Sin cambios.";
                    this.disabled = false;
                }
            },
            modificarDescuento(){
                if(this.checkForm()){
                    var params = this.descuento;
                    console.log(params);
                    axios.post('${process.env.BASE_URL}/api/cliente/modificar-descuento', params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5450){
                            this.$router.push({ name: 'PrincipalPlan', params: { resultadoOperacion: "Descuento modificado satisfactoriamente." }});
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5451){
                                this.resultadoOperacion = "El descuento seleccionado no existe.";
                            }
                        });
                } 
            },
            limpiarCajas(){
                this.descuento = {
                    id: 0,
                    motivo: '',
                    porcentaje: '',
                },
                this.errorDisponibilidad = '';
            },
            limpiarMensajes(){
                this.resultadoOperacion = "";
                this.erroresForm = [];
            },
            checkForm() {
                this.limpiarMensajes();
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