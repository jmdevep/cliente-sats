<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modificar Usuario</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarUsuario()">
                    <p class="text-danger" v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>   
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>                 
                    <label>Seleccione el tipo de Usuario *</label>
                    <select  class="form-control" v-model="usuario.tipo.id" @change="cambioSelect">
                        <option value="" selected="selected">Tipo de Usuario</option>
                        <option v-for="(tipo,index) in tiposUsuario" :key="index" v-bind:value="tipo.id">
                            {{ tipo.nombre }}
                        </option>
                    </select>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario *</label>
                        <input type="text" maxlength="25" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="usuario.nombre" id="nombre" placeholder="Nombre de Usuario">
                        <small id="emailHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="contrasena" maxlength="16" class="darkTextCustom">Contraseña</label>
                        <input type="password" class="form-control border-success" v-model="usuario.contrasena" id="contrasena" placeholder="Contraseña">
                    </div>
                    <input type="submit" :disabled="disabled" value="Modificar" class="btn marginBefore btn-success">
                </form>
            </div>
            <p class="text-info"><i class="fas fa-info-circle"></i>&nbsp; &nbsp;Si no desea modificar la contraseña, déjela vacía.</p>                 
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EditarUsuario',
        mounted(){

            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/tipo-usuario/lista-tipos`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado = 'general_listado_hay_datos'){
                        this.tiposUsuario = res.data.tiposUsuario;
                    }
                    this.loading = false;
        	});
            //this.usuario = this.$router.params.usuario;
            //console.log(this.usuario);
            console.log(this.$route.params.usuario);
            this.usuario = this.$route.params.usuario;
            this.nombreOriginal = this.$route.params.usuario.nombre;
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
                disabled: true,
            	usuario: {
                    id: 0,
                    nombre: '',
                    contrasena: '',
                    tipo: {
                        id: 0,
                    },
                    idEmpleado: 0,
                },
                tiposUsuario: [],
                errorDisponibilidad: '',
                nombreOriginal: '',
                alerta: false,
                informacion: false,
            }
        },
        methods: {
            cambioSelect () {

            },
            verificarDisponibilidad() {
                if(this.usuario.nombre != '' && this.usuario.nombre != this.nombreOriginal){
                    axios.get(`${process.env.BASE_URL}/api/usuario/existe-usuario`, {
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
                } else {
                    this.disabled = false;
                }
            },
            modificarUsuario(){
                if(this.checkForm()){
                    var params = this.usuario;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/usuario/modificar-usuario`, params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 1100){
                            this.$router.push({ name: 'PrincipalEmpleado', params: { resultadoOperacion: "Usuario modificado satisfactoriamente." }});
                                this.limpiarCajas();
                            } else if (res.data.resultado == 1101){
                                this.alerta = true;
                                this.resultadoOperacion = "El usuario seleccionado no existe.";
                            }
                           else{
                                this.alerta = true;
                                this.resultadoOperacion = 'Ha ocurrido un error, por favor comuníquese con el soporte.';
                            }
                        })
                        .catch((error)=>{
                            this.alerta = true;
                            this.resultadoOperacion = 'Ha surgido un error en el sistema. Inténtelo nuevamente.';
                            console.log(error);
                            this.loading = false;
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
            validarTexto(texto){
                var reg = new RegExp('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1])[a-zA-ZÀ-ÿ\u00f1\u00d1]+$');
                return reg.test(texto);
            },
            validarContrasena(texto){
                var reg = new RegExp("^(?=[a-zA-Z0-9?@.-]{8,16}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*");
                return reg.test(texto);
            },
            checkForm() {
               var nombreValido = this.validarTexto(this.usuario.nombre);
                var contrasenaValida = this.validarContrasena(this.usuario.contrasena);
                this.erroresForm = [];
                if (this.usuario.nombre && nombreValido && (!this.usuario.contrasena || (this.usuario.contrasena && contrasenaValida)) && this.usuario.tipo.id != 0) {
                    return true;
                }

                if (!this.usuario.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }
                else if(!nombreValido){
                    this.erroresForm.push('Evite ingresar caracteres que no sean letras en el nombre.');
                }
                if(this.usuario.contrasena && !contrasenaValida){
                    this.erroresForm.push('La contraseña debe contener entre 8 y 16 caracteres: al menos una letra mayúscula, una minúscula y un número. Puede contener caracteres especiales como "?", "@", "." y "-".');
                }
                if (this.usuario.tipo.id <= 0) {
                    this.erroresForm.push('Debe seleccionar un tipo de usuario.');
                }
                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
