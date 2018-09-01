<template>
    <div>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar este servicio?</div>
            {{ resultadoOperacion }}
            
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarServicio()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Servicio</label>
                        <input type="text"  class="form-control border-success" v-model="servicio.nombre" id="nombre" disabled="true" placeholder="Nombre de Servicio">
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
        name: 'EliminarServicio',
        mounted(){
            this.servicio = this.$route.params.servicio;
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
            	servicio: {
                    id: 0,
                    nombre: '',
                },
            }
        },
        methods: {
            eliminarServicio(){
                axios.delete(`${process.env.BASE_URL}/api/servicio/eliminar-servicio`, {data: { id: this.servicio.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5500){
                            this.$router.push({ name: 'PrincipalEvento', params: { resultadoOperacion: "Servicio eliminado satisfactoriamente." }});
                        } else if (res.data.resultado == 5501){
                            this.resultadoOperacion = "El Servicio seleccionado ya no existe.";
                        }
                    });
            }
        },    
    }
</script>
