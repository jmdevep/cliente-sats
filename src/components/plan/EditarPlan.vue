<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Editar Plan</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarPlan()">
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
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="plan.nombre" id="nombre" placeholder="Nombre descriptivo">
                        <small id="nameHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="cuota" class="darkTextCustom">Valor cuota</label>
                        <input type="text" class="form-control border-success" v-model="plan.cuota" id="cuota" placeholder="Valor cuota">
                    </div>
                    <div v-if="descuentos.length" class="form-group">
                        <label>Seleccione el descuento aplicado al plan:</label>
                        <select id="roles" class="form-control" v-model="plan.descuento.id">
                            <option value="0" selected> 
                                Aún no hay selección
                            </option>
                            <option  v-for="(descuento,index) in descuentos" :key="index" v-bind:value="descuento.id" :disabled="descuento.disabled">
                                {{ descuento.motivo }} - {{descuento.porcentaje}}% 
                            </option>
                        </select>
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
        name: 'EditarPlan',
        mounted(){
            this.plan = this.$route.params.plan;
            this.nombreOriginal = this.$route.params.plan.nombre;
            this.loading = true;    
            console.log(this.plan);
            axios.get('${process.env.BASE_URL}/api/cliente/lista-descuentos')
            .then((res)=>{
                console.log(res);
                if(res.data.resultado == 100){
                    this.descuentos = res.data.descuentos;
                    this.descuentos.forEach(function(obj) { obj.disabled = false; });
                }
                this.loading = false;
        	});
            //this.usuario = this.$router.params.usuario;
            //console.log(this.usuario);
            console.log(this.$route.params.plan);
            this.plan = this.$route.params.plan;
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
            	plan: {
                    id: 0,
                    nombre: '',
                    cuota: 0,
                    convenio:{ 
                        id: 0,
                        nombre: '',
                        fechaInicio: null,
                        fechaFin: null,
                        empresa:{
                            id: 0,
                            nombre: '',
                            direccion: '',
                            telefono: '',
                            rut: '',
                        }
                    },
                    descuento:{
                        id: 0,
                        motivo: '',
                        porcentaje: 0,
                    }
                },
                errorDisponibilidad: '',
                descuentos:[],
                nombreOriginal: '',
            }
        },
        methods: {
            cambioSelect () {

            },
             verificarDisponibilidad() {
                 console.log(this.nombreOriginal);
                 console.log(this.plan.nombre);
                if(this.plan != null && this.plan.nombre != '' && this.nombreOriginal != this.plan.nombre){
                    this.loading = true;
                    axios.get('${process.env.BASE_URL}/api/cliente/existe-plan', {
                        params: {
                        nombre: this.plan.nombre,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Ya existe un plan registrado con ese nombre.";
                            } else {
                                this.errorDisponibilidad = "Nombre disponible.";    
                                this.disabled = false;                              
                            }
                    });
                    this.loading = false;
                }
                else if(this.nombreOriginal == this.plan.nombre){
                    this.errorDisponibilidad = "Sin cambios.";
                    this.disabled = false;
                }
            },
            modificarPlan(){
                if(this.checkForm()){
                    var params = this.plan;
                    console.log(params);
                    axios.post('${process.env.BASE_URL}/api/cliente/modificar-plan', params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5400){
                            this.$router.push({ name: 'PrincipalPlan', params: { resultadoOperacion: "Plan modificado satisfactoriamente." }});
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5401){
                                this.resultadoOperacion = "El plan seleccionado no existe.";
                            }
                        });
                }

            },
            limpiarCajas(){
                this.plan.id = 0;
                this.plan.nombre = '',
                this.plan.cuota = 0,
                this.plan.convenio = { 
                        id: 0,
                        nombre: '',
                        fechaInicio: null,
                        fechaFin: null,
                        empresa:{
                            id: 0,
                            nombre: '',
                            direccion: '',
                            telefono: '',
                            rut: '',
                        },
                        descuento:{
                            id: 0,
                            motivo: '',
                            porcentaje: 0,
                        }
                    }
                this.errorDisponibilidad = '';
            },
            limpiarMensajes(){
                this.resultadoOperacion = "";
                this.erroresForm = [];
            },
            checkForm() {
                this.limpiarMensajes();

                if (this.plan.nombre && this.plan.cuota && this.plan.cuota >= 0 && this.plan.descuento && this.plan.descuento.id != 0) {
                    return true;
                }

                if (!this.plan.nombre) {
                    this.erroresForm.push('Nombre descriptivo requerido.');
                }
                if (!this.plan.cuota) {
                    this.erroresForm.push('Valor de la cuota requerida.');
                }
                else if(this.plan.cuota < 0){
                    this.erroresForm.push('Valor de la cuota debe ser un número positivo.');
                }
                if(!this.plan.descuento || this.plan.descuento.id == 0){
                    this.erroresForm.push('Debe seleccionar un descuento.');
                }
                
                this.disabled = false;
                return false;
            }
        },    
    }
</script>