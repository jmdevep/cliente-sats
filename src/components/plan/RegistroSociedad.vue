<template>
    <div>
        <h1 class="mainTitle">
        Sociedades
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Nuevo socio</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarSocio()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Cliente</label>
                        <input type="text"  class="form-control border-success" v-model="cliente.nombre" id="nombre" disabled="true" >
                    </div>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre descriptivo</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="cliente.sociedad.nombre" id="nombre" placeholder="Nombre descriptivo">
                        <small id="nameHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div v-if="planes.length" class="form-group">
                        <label>Seleccione el plan a asociar:</label>
                        <select id="planes" class="form-control" v-model="cliente.sociedad.plan.id">
                            <option value="0" selected> 
                                Aún no hay selección
                            </option>
                            <option  v-for="(plan,index) in planes" :key="index" v-bind:value="plan.id" :disabled="false">
                                {{ plan.nombre }}, cuota: ${{plan.cuota}}
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
        name: 'RegistroSociedad',
        mounted(){ 
            this.loading = true;
            this.cliente = this.$route.params.cliente;
            this.cliente.sociedad = {
                id: 0,
                nombre: '',
                fechaInicio: '',
                fechaFin: '',
                plan:{
                    id: 0,
                    nombre: '',
                    cuota: 0,
                    convenio: {
                        id: 0,
                        nombreDescriptivo: '',
                        fechaInicio: '',
                        fechaFin: '',
                        empresa: {
                            id: 0,
                            nombre: '',
                            direccion: '',
                            telefono: '',
                            rut: '',
                        },
                    }
                }
            };
            console.log(this.cliente);
            axios.get(`${process.env.BASE_URL}/api/cliente/lista-planes`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.planes = res.data.planes;
                        console.log(this.planes);
                    }
                    this.loading = false;
            });
            this.loading = false;
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
            	cliente: {
                    id: 0,
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    fechaIngreso: '',
                    sociedad:{
                        id: 0,
                        nombre: '',
                        fechaInicio: '',
                        fechaFin: '',
                        plan:{
                            id: 0,
                            nombre: '',
                            cuota: 0,
                            convenio: {
                                id: 0,
                                nombreDescriptivo: '',
                                fechaInicio: '',
                                fechaFin: '',
                                empresa: {
                                    nombre: '',
                                    direccion: '',
                                    telefono: '',
                                    rut: '',
                                },
                            }
                        }
                    }
                },
                errorDisponibilidad: '',
                planes:[],
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.cliente && this.cliente.sociedad && this.cliente.sociedad.nombre){
                    this.loading = true;
                    console.log("nombre -" + this.cliente.sociedad.nombre)
                    axios.get(`${process.env.BASE_URL}/api/cliente/existe-sociedad`, {
                        params: {
                            nombre: this.cliente.sociedad.nombre,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Ya existe una sociedad registrada con ese nombre.";
                            } else {
                                this.errorDisponibilidad = "Nombre disponible.";    
                                this.disabled = false;                              
                            }
                    });
                }
                else{
                    this.errorDisponibilidad = "Debe completar este campo.";  
                    disabled = true;
                }
                this.loading = false;
            },
            registrarSocio(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.cliente;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/cliente/agregar-sociedad`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5422){
                                this.$router.push({ name: 'PrincipalPlan', params: { resultadoOperacion: "Cliente asociado satisfactoriamente." }});  
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5423 || res.data.resultado == 5420){
                                this.resultadoOperacion = "El cliente ya se encuentra asociado.";
                            }
                            else if(res.data.resultado == 4){
                                this.resultadoOperacion = "Hubo un error durante el proceso. Vuelve a intentarlo. Si persiste el problema, contacta al soporte.";
                            }
                        });
                }
                this.loading = false;
            },
            limpiarCajas(){
                this.cliente = {
                    id: '',
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    fechaIngreso: '',
                    sociedad:{
                        id: 0,
                        nombre: '',
                        fechaInicio: '',
                        fechaFin: '',
                        plan:{
                            id: 0,
                            nombre: '',
                            cuota: 0,
                            convenio: {
                                id: 0,
                                nombreDescriptivo: '',
                                fechaInicio: '',
                                fechaFin: '',
                                empresa: {
                                    nombre: '',
                                    direccion: '',
                                    telefono: '',
                                    rut: '',
                                },
                            }
                        }
                    }
                };
                this.errorDisponibilidad = '';
            },
            limpiarMensajes(){
                this.resultadoOperacion = "";
                this.erroresForm = [];
            },
            checkForm() {
                this.limpiarMensajes();
                
                if (this.cliente && this.cliente.id && this.cliente.id != 0 && this.cliente.sociedad.nombre && this.cliente.sociedad.plan && this.cliente.sociedad.plan.id != 0) {
                    this.cliente.sociedad.fechaInicio = new Date();
                    return true;
                }

                if (!this.cliente || this.cliente.id == 0) {
                    this.erroresForm.push('Debe seleccionarse un cliente');
                }
                if (!this.cliente.sociedad.nombre) {
                    this.erroresForm.push('Debe asignar al plan un nombre que permita identificarlo.');
                }
                if(!this.cliente.sociedad.plan || this.cliente.sociedad.plan.id == 0){
                    this.erroresForm.push('Debe seleccionar un plan.');
                }
                
                this.disabled = false;
                return false;
            }
        },    
    }
</script>