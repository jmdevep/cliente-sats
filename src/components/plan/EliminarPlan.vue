<template>
    <div>
        <h1 class="mainTitle">
        Usuarios
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">¿Seguro desea eliminar este plan?</div>
            {{ resultadoOperacion }}
            
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarPlan()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario</label>
                        <input type="text"  class="form-control border-success" v-model="plan.nombre" id="nombre" disabled="true" placeholder="Nombre del plan">
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
        name: 'EliminarPlan',
        mounted(){
            this.plan = this.$route.params.plan;
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
            	plan: {
                    id: 0,
                    nombre: '',
                    cuota: 0,
                    convenio:{ 
                        id: 0,
                        nombre: '',
                        fechaInicio: null,
                        fechaFin: null,
                        empresa:{
                            id: 0,
                            nombre: '',
                            direccion: '',
                            telefono: '',
                            rut: '',
                        }
                    },
                    descuento:{
                        id: 0,
                        motivo: '',
                        porcentaje: 0,
                    }
                },
            }
        },
        methods: {
            eliminarPlan(){
                axios.delete('https://servidor-sats.herokuapp.com/api/cliente/eliminar-plan', {data: { id: this.plan.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5400){
                            this.$router.push({ name: 'ListadoPlan', params: { resultadoOperacion: "Plan eliminado satisfactoriamente." }});
                        } else if (res.data.resultado == 5401){
                            this.resultadoOperacion = "El plan seleccionado no existe.";
                        }
                    });
            }
        },    
    }
</script>