<template>
    <div>
        <h1 class="mainTitle">
        Clientes
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Plan</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarPlan()">
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
                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore btn-success">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'RegistroPlan',
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
                    }
                },
                errorDisponibilidad: '',
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.plan != null && this.plan.nombre != ''){
                    console.log("nombre -" + this.plan.nombre)
                    axios.get('http://localhost:4567/api/cliente/existe-plan', {
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
                }
            },
            registrarPlan(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.plan;
                    console.log(params);
                    axios.post('http://localhost:4567/api/cliente/agregar-plan', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5402){
                                this.resultadoOperacion = "Plan agregado satisfactoriamente.";
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5303){
                                this.resultadoOperacion = "Ya existe un plan con ese nombre.";
                            }
                            else if(res.data.resultado == 4){
                                this.resultadoOperacion = "Hubo un error durante el proceso. Vuelve a intentarlo. Si persiste el problema, contacta al soporte.";
                            }
                        });
                    this.loading = false;
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
                        }
                    }
                this.errorDisponibilidad = '';
            },
            checkForm() {
                if (this.plan.nombre && this.plan.cuota && this.plan.cuota >= 0) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.plan.nombre) {
                    this.erroresForm.push('Nombre descriptivo requerido.');
                }
                if (!this.plan.cuota) {
                    this.erroresForm.push('Valor de la cuota requerida.');
                }
                else if(this.plan.cuota < 0){
                    this.erroresForm.push('Valor de la cuota debe ser un número positivo.');
                }

                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>