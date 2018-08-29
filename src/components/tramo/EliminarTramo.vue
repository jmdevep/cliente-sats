<template>
    <div>
        <h1 class="mainTitle">
        Tramos
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar este tramo?</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarTramo()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Tramo</label>
                        <input type="text"  class="form-control border-success" v-model="textoTramo" id="nombre" disabled="true" >
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
        name: 'EliminarTramo',
        mounted(){
            this.tramo = this.$route.params.tramo;
            this.textoTramo = this.tramo.localidadOrigen.nombre + " - " + this.tramo.localidadDestino.nombre;
            },
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
                tramo: {
                    localidadOrigen: null,
                    localidadDestino: null,
                    cantidadKm: null
                },
                textoTramo: ''
            }
        },
        methods: {
            eliminarTramo(){
                axios.delete('http://localhost:4567/api/tramo/eliminar-tramo', {data: { id: this.tramo.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5700){
                            this.$router.push({ name: 'ListadoTramo', params: { resultadoOperacion: "Tramo eliminado satisfactoriamente." }});                            
                        } else if (res.data.resultado == 5701){
                            this.resultadoOperacion = "El tramo seleccionado no existe.";
                        }
                    });
            }
        },    
    }
</script>
