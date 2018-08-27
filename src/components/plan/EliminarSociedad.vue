<template>
    <div>
        <h1 class="mainTitle">
        Socios
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">¿Seguro desea desasociar este cliente? Podrá ser asociado nuevamente a otro plan.</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarSocio()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Cliente</label>
                        <input type="text"  class="form-control border-success" v-model="cliente.nombre" id="nombre" disabled="true" >
                    </div>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Sociedad</label>
                        <input type="text"  class="form-control border-success" v-model="cliente.sociedad.nombre" id="nombre" disabled="true" >
                    </div>
                    <input type="submit" value="Desasociar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EliminarSociedad',
        mounted(){
            this.cliente = this.$route.params.cliente;
            console.log(this.$route.params.cliente);
            console.log(this.cliente);
        	},
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
            	cliente: {
                    id: 0,
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    fechaIngreso: '',
                    sociedad:{
                        id: 0,
                        nombre: '',
                        fechaInicio: '',
                        fechaFin: '',
                        plan:{
                            id: 0,
                            nombre: '',
                            cuota: 0,
                            convenio: {
                                id: 0,
                                nombreDescriptivo: '',
                                fechaInicio: '',
                                fechaFin: '',
                                empresa: {
                                    nombre: '',
                                    direccion: '',
                                    telefono: '',
                                    rut: '',
                                },
                            }
                        }
                    }
                },
            }
        },
        methods: {
            eliminarSocio(){
                axios.post('http://localhost:4567/api/cliente/eliminar-sociedad', {data: { cliente: this.cliente }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5420){
                            this.$router.push({ name: 'AsociarCliente', params: { resultadoOperacion: "Cliente desasociado satisfactoriamente." }});                            
                        } else if (res.data.resultado == 5421){
                            this.resultadoOperacion = "El cliente no se encuentra asociado a ese plan.";
                        }
                    });
            }
        },    
    }
</script>