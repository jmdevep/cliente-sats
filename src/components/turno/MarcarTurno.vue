<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">
                <template v-if="activacionReten">
                    Marcar activación retén
                </template>
                <template v-if="ingreso">
                    Marcar ingreso turno
                </template>
                <template v-else>
                    Marcar salida turno
                </template>
            </div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="marcarTurno()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <div class="form-group">
                        <label for="inicioTurno" class="darkTextCustom">Inicio turno</label>
                        <input type="text" class="form-control border-success" v-model="turno.inicio" id="inicioTurno" placeholder="Inicio turno" disabled="true">
                        <small id="nameHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="finTurno" class="darkTextCustom">Fin turno</label>
                        <input type="text" class="form-control border-success" v-model="turno.fin" id="finTurno" placeholder="Fin turno" disabled="true">
                    </div>
                    <div class="form-group">
                        <label for="fecha" class="darkTextCustom">Fecha a marcar</label>
                        <input type="date" class="form-control border-success" v-model="empleado.fechaNacimiento" id="fecha" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="hora" class="darkTextCustom">Hora a marcar</label>
                        <input type="text" class="form-control border-success" v-model="plan.cuota" id="hora" placeholder="Hora">
                    </div>
                    <input type="submit" :disabled="disabled" value="Marcar" class="btn marginBefore btn-success">
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
            this.activacionReten = this.$route.params.activacionReten;
            this.ingreso = this.$route.params.ingreso;
            this.turno = this.$route.params.turno;
            this.puesto = this.$route.params.puesto;
            this.loading = true;    
            console.log(this.plan);
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
                fecha: '',
                ingreso: false,
                activacionReten: false,
                turno:{},
                puesto:{},
                errorDisponibilidad: '',
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
                    axios.get(`${process.env.BASE_URL}/api/cliente/existe-plan`, {
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
                    axios.post(`${process.env.BASE_URL}/api/cliente/modificar-plan`, params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 5400){
                            this.$router.push({ name: 'PrincipalTurno', params: { resultadoOperacion: "Plan modificado satisfactoriamente." }});
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