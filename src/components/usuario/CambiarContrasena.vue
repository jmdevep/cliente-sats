<template>
    <div>
        <h1 class="mainTitle">
            Gestión de contraseña
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modificar contraseña</div>
            <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
            <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarContrasena()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>                    
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario</label>
                        <input type="text" class="form-control border-success" disabled="true" v-model="usuario.nombre" id="nombre" placeholder="Nombre de Usuario">
                        <small id="emailHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="contrasenaVieja" class="darkTextCustom">Contraseña actual</label>
                        <input type="password" class="form-control border-success" v-model="contrasenaVieja" id="contrasenaVieja" placeholder="Contraseña actual">
                    </div>
                    <div class="form-group">
                        <label for="contrasenaNueva" class="darkTextCustom">Contraseña nueva</label>
                        <input type="password" class="form-control border-success" v-model="contrasenaNueva" id="contrasenaNueva" placeholder="Contraseña nueva">
                    </div>
                    <div class="form-group">
                        <label for="repetirContrasenaNueva" class="darkTextCustom">Repetir contraseña nueva</label>
                        <input type="password" class="form-control border-success" v-model="contrasenaNuevaRepetida" id="repetirContrasenaNueva" placeholder="Repetir contraseña nueva">
                    </div>
                    <input type="submit" value="Modificar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EditarUsuario',
        mounted(){
            var usuario = this.$session.get('usuario');
            console.log(usuario);
            this.usuario = usuario;
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
                contrasenaVieja: '',
                contrasenaNueva: '',
                contrasenaNuevaRepetida: '',
                usuario: {
                    nombre: '',
                    contrasena: '',
                    tipo: {
                        id: 0,
                    },
                    idEmpleado: 0,
                },
                informacion: false,
                alerta: false,
            }
        },
        methods: {
            modificarContrasena(){
                this.loading = true;
                this.alerta = false;
                this.informacion = false;
                if(this.checkForm()){
                    axios.get(`${process.env.BASE_URL}/api/usuario/cambiar-contrasena`, {
                        params: {
                            idUsuario: this.usuario.id,
                            contrasenaVieja: this.contrasenaVieja,
                            contrasenaNueva: this.contrasenaNueva,
                        }
                    }) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 1114){
                                this.$router.push({ name: 'PrincipalEmpleado', params: { resultadoOperacion: "Contraseña modificada satisfactoriamente." }});
                                this.limpiarCajas();
                                this.informacion = true;
                                this.alerta = false;
                            } else if (res.data.resultado == 1113){
                                this.alerta = true;
                                this.informacion = false;
                                this.resultadoOperacion = "Su actual contraseña es incorrecta, verifíquela e inténtelo nuevamente.";
                            }
                            else{
                                this.alerta = true;
                                this.informacion = false;
                                this.resultadoOperacion = "Hubo un error al modificar su contraseña, inténtelo nuevamente. Contacte al soporte si el problema persiste.";
                            }
                        });
                    this.loading = false;
                }
            },
            limpiarCajas(){
                contrasenaVieja = '';
                contrasenaNueva = '';
                contrasenaNuevaRepetida = '';
                errorDisponibilidad = '';
                informacion = false;
                alerta = false;
            },
            limpiarMensaje(){
                this.resultadoOperacion = '';
                this.erroresForm = [];
            },
            checkForm() {
                this.limpiarMensaje();
                if (this.contrasenaVieja && this.contrasenaNueva && this.contrasenaNuevaRepetida && this.contrasenaNueva == this.contrasenaNuevaRepetida && this.usuario != null && this.usuario.id > 0) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.contrasenaVieja) {
                    this.erroresForm.push('Contraseña actual requerida.');
                }
                if (!this.contrasenaNueva) {
                    this.erroresForm.push('Contraseña nueva requerida.');
                }
                if (!this.contrasenaNuevaRepetida) {
                    this.erroresForm.push('Segundo ingreso de nueva contraseña requerido.');
                }
                if(this.contrasenaNueva != this.contrasenaNuevaRepetida){
                    this.erroresForm.push('La contraseña nueva y su repetición deben ser iguales.');
                }
                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
