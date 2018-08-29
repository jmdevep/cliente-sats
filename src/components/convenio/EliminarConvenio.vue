<template>
    <div>
        <h1 class="mainTitle">
        Convenios
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">¿Seguro desea eliminar este convenio?</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarConvenio()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Razón Social</label>
                        <input type="text"  class="form-control border-success" v-model="convenio.nombreDescriptivo" id="nombre" disabled="true" >
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
        name: 'EliminarConvenio',
        mounted(){
            this.convenio = this.$route.params.convenio;
            console.log(this.$route.params.convenio);
            console.log(this.convenio);
        	},
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
            	convenio: {
                    id: 0,
                    nombre: '',
                },
            }
        },
        methods: {
            eliminarConvenio(){
                axios.delete('https://servidor-sats.herokuapp.com/api/cliente/eliminar-convenio', {data: { id: this.convenio.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5420){
                            this.$router.push({ name: 'ListadoConvenio', params: { resultadoOperacion: "Convenio eliminado satisfactoriamente." }});                            
                        } else if (res.data.resultado == 5421){
                            this.resultadoOperacion = "El convenio seleccionado no existe.";
                        }
                    });
            }
        },    
    }
</script>
