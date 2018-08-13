<template>
    <div>
        <h1 class="mainTitle">
        Usuarios
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar este usuario?</div>
            {{ resultadoOperacion }}
            
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarUsuario()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario</label>
                        <input type="text"  class="form-control border-success" v-model="usuario.nombre" id="nombre" disabled="true" placeholder="Nombre de Usuario">
                    </div>
                    <input type="submit" value="Eliminar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EliminarUsuario',
        mounted(){
            this.usuario = this.$route.params.usuario;
            },
            beforeCreate: function () {
                var usuario = this.$session.get('usuario');
                if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
                this.$router.push('/usuario/login')
                } 
        },
        data(){
            return{
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
            }
        },
        methods: {
            eliminarUsuario(){
                axios.delete('https://servidor-sats.herokuapp.com/api/usuario/eliminar-usuario', {data: { id: this.usuario.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 1100){
                            this.$router.push({ name: 'ListadoUsuario', params: { resultadoOperacion: "Usuario eliminado satisfactoriamente." }});
                        } else if (res.data.resultado == 1101){
                            this.resultadoOperacion = "El usuario seleccionado no existe.";
                        }
                    });
            }
        },    
    }
</script>
