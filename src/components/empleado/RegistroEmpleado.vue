<template>
    <div>
        <h1 class="mainTitle">
        Empleados
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Empleados</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarEmpleado()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre </label>
                        <input type="text" class="form-control border-success" v-model="empleado.nombre" id="nombre" placeholder="Nombre">
                    </div>
                    <div class="form-group">
                        <label for="apellido" class="darkTextCustom">Apellido</label>
                        <input type="text" class="form-control border-success" v-model="empleado.apellido" id="apellido" placeholder="Apellidos">
                    </div>
                    <div class="form-group">
                        <label for="documento" class="darkTextCustom">Documento de Identidad</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="empleado.documento" id="documento" placeholder="Documento">
                        <small id="emailHelp" class="form-text textMutedCustom">Ej: 4.864.007-6</small>                    
                    </div>
                    <div class="form-group">
                        <label for="fechaNacimiento" class="darkTextCustom">Fecha de Nacimiento</label>
                        <input type="date" class="form-control border-success" v-model="empleado.fechaNacimiento" id="fechaNacimiento" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="domicilio" class="darkTextCustom">Domicilio</label>
                        <input type="text" class="form-control border-success" v-model="empleado.domicilio" id="domicilio" placeholder="Domicilio">
                    </div>
                    <div class="form-group">
                        <label for="telefono" class="darkTextCustom">Teléfono</label>
                        <input type="text" class="form-control border-success" v-model="empleado.telefono" id="telefono" placeholder="Teléfono">
                    </div>
                    <div class="form-group">
                        <label for="vencimientoCarnetSalud" class="darkTextCustom">Vencimiento Carnet Salud</label>
                        <input type="date" class="form-control border-success" v-model="empleado.vencimientoCarnetSalud" id="vencimientoCarnetSalud" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="vencimientoCarnetChofer" class="darkTextCustom">Vencimiento Libreta de Conducir</label>
                        <input type="date" class="form-control border-success" v-model="empleado.vencimientoCarnetChofer" id="vencimientoCarnetChofer" placeholder="2019-12-05">
                    </div>
                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'RegistroEmpleado',
        mounted(){

        	},
        data(){
            return{
                erroresForm: [],
                disabled: true,
            	empleado: {
                    nombre: '',
                    apellido: '',
                    documento: '',
                    fechaNacimiento: '',
                    domicilio: '',
                    telefono: '',
                    vencimientoCarnetSalud: '',
                    vencimientoCarnetChofer: '',
                },
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.empleado.documento != ''){
                    axios.get('http://localhost:4567/api/empleado/existe-empleado', {
                        params: {
                        documento: this.empleado.documento,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Documento ya registrado.";
                            } else {
                                this.errorDisponibilidad = "";    
                                this.disabled = false;                              
                            }
                    });
                }
            },
            registrarEmpleado(){
                if(this.checkForm()){
                    var params = this.empeado;
                    console.log(params);
                    axios.post('http://localhost:4567/api/empleado/agregar-empleado', params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.resultado == "empleado_alta_exsitoso"){
                                alert("Empleado agregado satisfactoriamente.");
                                this.limpiarCajas();
                            } else {
                                alert(res.resultado);
                            }

                        });
                }

            },
            limpiarCajas(){
                this.empleado.nombre = '';
                this.empleado.apellido = '';
                this.empleado.documento = '';
                this.empleado.fechaNacimiento = '';
                this.empleado.domicilio = '';
                this.empleado.telefono = '';
                this.empleado.vencimientoCarnetSalud = '';
                this.empleado.vencimientoCarnetChofer = '';
            },

            checkForm() {
                if (this.empleado.nombre && this.empleado.apellido && this.empleado.documento && this.empleado.fechaNacimiento && this.empleado.domicilio
                    && this.emleado.telefono ) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.empleado.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }                
                if (!this.empleado.apellido) {
                    this.erroresForm.push('Apellido requerido.');
                }                
                if (!this.empleado.documento) {
                    this.erroresForm.push('Documento requerido.');
                }      
                if (!this.empleado.fechaNacimiento) {
                    this.erroresForm.push('Fecha de nacimiento requerida.');
                }                
                if (!this.empleado.domicilio) {
                    this.erroresForm.push('Domicilio requerido.');
                }
                if (!this.empleado.telefono) {
                    this.erroresForm.push('Teléfono requerido.');
                }

                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
