<template>
    <div>
        <h1 class="mainTitle">
        Prestadores
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">¿Seguro desea eliminar este prestador?</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarPrestador()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Razón Social</label>
                        <input type="text"  class="form-control border-success" v-model="prestador.nombreDescriptivo" id="nombre" disabled="true" >
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
        name: 'EliminarPrestador',
        mounted(){
            this.prestador = this.$route.params.prestador;
            console.log(this.$route.params.prestador);
            console.log(this.prestador);
        	},
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
            	prestador: {
                    id: 0,
                    nombre: '',
                },
            }
        },
        methods: {
            eliminarPrestador(){
                axios.delete('http://localhost:4567/api/cliente/eliminar-prestador', {data: { id: this.prestador.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5420){
                            this.$router.push({ name: 'ListadoPrestador', params: { resultadoOperacion: "Prestador eliminado satisfactoriamente." }});                            
                        } else if (res.data.resultado == 5421){
                            this.resultadoOperacion = "El prestador seleccionado no existe.";
                        }
                    });
            }
        },    
    }
</script>
