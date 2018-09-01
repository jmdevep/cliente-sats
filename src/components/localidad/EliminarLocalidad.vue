<template>
    <div>
        <h1 class="mainTitle">
        Localidades
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar esta localidad?</div>
            {{ resultadoOperacion }}
            
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminiarLocalidad()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Localidad</label>
                        <input type="text"  class="form-control border-success" v-model="localidad.nombre" id="nombre" disabled="true" placeholder="Nombre de Localidad">
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
        name: 'EliminarLocalidad',
        mounted(){
            this.localidad = this.$route.params.localidad;
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
            	localidad: {
                    id: 0,
                    nombre: '',
                },
            }
        },
        methods: {
            eliminarLocalidad(){
                axios.delete('${process.env.BASE_URL}/api/localidad/eliminar-localidad', {data: { id: this.localidad.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5600){
                            this.$router.push({ name: 'ListadoLocalidad', params: { resultadoOperacion: "Localidad eliminada satisfactoriamente." }});
                        } else if (res.data.resultado == 5601){
                            this.resultadoOperacion = "La localidad seleccionada ya no existe.";
                        }
                    });
            }
        },    
    }
</script>
