<template>
    <div>
        <h1 class="mainTitle">
        Usuarios
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Usuarios</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarUsuario()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <select v-model="usuario.tipo.id" @change="cambioSelect">
                        <option value="" selected="selected">Tipo de Usuario</option>
                        <option v-for="(tipo,index) in tiposUsuario" :key="index" v-bind:value="tipo.id">
                            {{ tipo.nombre }}
                        </option>
                    </select>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="usuario.nombre" id="nombre" placeholder="Nombre de Usuario">
                        <small id="emailHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="contrasena" class="darkTextCustom">Contraseña</label>
                        <input type="password" class="form-control border-success" v-model="usuario.contrasena" id="contrasena" placeholder="Contraseña">
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
        name: 'RegistroUsuario',
        mounted(){
            axios.get('http://localhost:4567/api/tipo-usuario/lista-tipos')
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado = 'general_listado_hay_datos'){
                        this.tiposUsuario = res.data.tiposUsuario;
                    }
        	});

        	},
        data(){
            return{
                erroresForm: [],
                disabled: true,
            	usuario: {
                    nombre: '',
                    contrasena: '',
                    tipo: {
                        id: 0,
                    },
                    idEmpleado: 0,
                },
                tiposUsuario: [],
                empleados: [],
                errorDisponibilidad: '',
            }

        },
        methods: {
            cambioSelect () {
                    if(this.usuario.tipo.id == 1){
                        this.cargarEmpleadosDisponibles();
                    }
            },
            verificarDisponibilidad() {
                if(this.usuario.nombre != ''){
                    axios.get('http://localhost:4567/api/usuario/existe-usuario', {
                        params: {
                        nombreUsuario: this.usuario.nombre,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Nombre de usuario ya se encuentra en uso.";
                            } else {
                                this.errorDisponibilidad = "Nombre de usuario disponible.";    
                                this.disabled = false;                              
                            }
                    });
                }
            },
            registrarUsuario(){
                if(this.checkForm()){
                    var params = this.usuario;
                    console.log(params);
                    axios.post('http://localhost:4567/api/usuario/agregar-usuario', params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.resultado == "usuario_alta_existoso"){
                                alert("Usuario agregado satisfactoriamente.");
                                this.limpiarCajas();
                            } else if (res.resultado == "usuario_existe"){
                                alert("Ya existe un usuario con ese nombre.");
                            }

                        });
                }

            },
            limpiarCajas(){
                this.usuario.nombre = '';
                this.usuario.contrasena = '';
                this.usuario.tipo.id = 0;
                this.usuario.idEmpleado = 0;
                this.empleados = this.cargarEmpleadosDisponibles();
                errorDisponibilidad: '';
            },
            cargarEmpleadosDisponibles(){

            },
            checkForm() {
                if (this.usuario.nombre && this.usuario.contrasena && this.usuario.tipo.id != 0) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.usuario.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }
                if (!this.usuario.contrasena) {
                    this.erroresForm.push('Contraseña requerida.');
                }
                if (!this.usuario.tipo.id == 0) {
                    this.erroresForm.push('Debes seleccionar un tipo de usuario.');
                }
                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
