<template>
    <div>
        <h1 class="mainTitle">
        Empresa
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar esta empresa?</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarEmpresa()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Razón Social</label>
                        <input type="text"  class="form-control border-success" v-model="empresa.nombre" id="nombre" disabled="true" >
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
        name: 'EliminarEmpresa',
        mounted(){
            this.empresa = this.$route.params.empresa;
            console.log(this.$route.params.empresa);
            console.log(this.empresa);
        	},
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
            	empresa: {
                    id: 0,
                    nombre: '',
                },
            }
        },
        methods: {
            eliminarEmpresa(){
                axios.delete('https://servidor-sats.herokuapp.com/api/cliente/eliminar-empresa', {data: { id: this.empresa.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5200){
                            this.$router.push({ name: 'ListadoEmpresa', params: { resultadoOperacion: "Empresa eliminada satisfactoriamente." }});                            
                        } else if (res.data.resultado == 5201){
                            this.resultadoOperacion = "La empresa seleccionada existe.";
                        }
                    });
            }
        },    
    }
</script>
