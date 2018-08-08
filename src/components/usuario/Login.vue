<template>
    <div>
        <h1 class="mainTitle">
        Usuario
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Iniciar Sesión</div>
            {{ resultadoOperacion }}
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="login()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario</label>
                        <input type="text" class="form-control border-success" v-model="usuario.nombre" id="nombre" placeholder="Nombre de Usuario">
                    </div>
                    <div class="form-group">
                        <label for="contrasena" class="darkTextCustom">Contraseña</label>
                        <input type="password" class="form-control border-success" v-model="usuario.contrasena" id="contrasena" placeholder="Contraseña">
                    </div>
                    <input type="submit" value="Iniciar Sesión" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'Login',
        mounted(){
            
        	},
        data(){
            return{
                loading: false,
                resultadoOperacion: '',
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
                errorDisponibilidad: '',
            }

        },
        methods: {
            login() {
                
                if(this.usuario.nombre != ''){
                    var params = this.usuario;
                    console.log(params);
                    axios.post('http://localhost:4567/api/usuario/validar-usuario', params)
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 1110){
                                this.disabled = true;
                                this.$session.start();
                                this.$session.set('usuario', res.data.usuario);
                                this.$router.push('/');
                            } else {
                                this.resultadoOperacion = "Error en los datos de acceso.";                              
                            }
                    });
                }
            },

            limpiarCajas(){
                this.usuario.nombre = '';
                this.usuario.contrasena = '';
                this.usuario.idEmpleado = 0;
                errorDisponibilidad: '';
            },
            cargarEmpleadosDisponibles(){

            },
            checkForm() {
                if (this.usuario.nombre && this.usuario.contrasena ) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.usuario.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }
                if (!this.usuario.contrasena) {
                    this.erroresForm.push('Contraseña requerida.');
                }
                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
