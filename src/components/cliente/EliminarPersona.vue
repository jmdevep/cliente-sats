<template>
    <div>
        <h1 class="mainTitle">
        Persona
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar esta persona?</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarPersona()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Persona</label>
                        <input type="text"  class="form-control border-success" v-model="persona.nombre" id="nombre" disabled="true" >
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
        name: 'EliminarPersona',
        mounted(){
            this.persona = this.$route.params.persona;
            console.log(this.$route.params.persona);
            console.log(this.persona);
        	},
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
            	persona: {
                    id: 0,
                    nombre: '',
                },
            }
        },
        methods: {
            eliminarPersona(){
                axios.delete(`${process.env.BASE_URL}/api/cliente/eliminar-persona`, {data: { id: this.persona.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5300){
                            this.$router.push({ name: 'PrincipalCliente', params: { resultadoOperacion: "Persona eliminada satisfactoriamente." }});                            
                        } else if (res.data.resultado == 5301){
                            this.resultadoOperacion = "La persona seleccionada existe.";
                        }
                    });
            }
        },    
    }
</script>
