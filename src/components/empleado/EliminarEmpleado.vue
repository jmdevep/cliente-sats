<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar este empleado?</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarEmpleado()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Empleado</label>
                        <input type="text"  class="form-control border-success" v-model="empleado.nombre" id="nombre" disabled="true" >
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
        name: 'EliminarEmpleado',
        mounted(){
            this.empleado = this.$route.params.empleado;
            console.log(this.$route.params.empleado);
            console.log(this.empleado);
        	},
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
            	empleado: {
                    id: 0,
                    nombre: '',
                },
            }
        },
        methods: {
            eliminarEmpleado(){
                axios.delete('https://servidor-sats.herokuapp.com/api/empleado/eliminar-empleado', {data: { id: this.empleado.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 1300){
                            this.$router.push({ name: 'PrincipalEmpleado', params: { resultadoOperacion: "Empleado eliminado satisfactoriamente." }});                            
                        } else if (res.data.resultado == 1301){
                            this.resultadoOperacion = "El empleado seleccionado no existe.";
                        }
                    });
            }
        },    
    }
</script>
