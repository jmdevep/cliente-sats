<template>
    <div>
        <h1 class="mainTitle">
        Turnos
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">¿Seguro desea eliminar este turno de este empleado?</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarPuesto()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre empleado</label>
                        <input type="text"  class="form-control border-success" v-model="nombreEmpleado" id="nombre" disabled="true" >
                    </div>
                    <div class="form-group">
                        <label for="inicio" class="darkTextCustom">Inicio turno</label>
                        <input type="text"  class="form-control border-success" v-model="textoInicio" id="inicio" disabled="true" >
                    </div>
                    <div class="form-group">
                        <label for="fin" class="darkTextCustom">Fin turno</label>
                        <input type="text"  class="form-control border-success" v-model="textoFin" id="fin" disabled="true" >
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
        name: 'EliminarPuesto',
        mounted(){
            this.puesto = this.$route.params.puesto;
            this.textoInicio = this.puesto.inicio;
            this.textoFin = this.puesto.fin;
            this.nombreEmpleado = this.puesto.empleado.nombre + " " + this.puesto.empleado.apellido;
            },
        data(){
            return{
                resultadoOperacion: '',
                erroresForm: [],
                disabled: true,
                puesto: {
                    id: 0,
                    inicio: '',
                    fin: '',
                    rol: {
                        id: 0,
                        nombre: '',
                        descripcion: '',
                    },
                    empleado: null,
                    estado: 0,
                    tipo: 0,
                    idTurno: 0,
                },
                textoInicio: '',
                textoFin: '',
                nombreEmpleado: '',
            }
        },
        methods: {
            eliminarPuesto(){
                axios.delete(`${process.env.BASE_URL}/api/turno/eliminar-puesto`, {data: { id: this.puesto.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 3100){
                            this.$router.push({ name: 'PrincipalTurno', params: { resultadoOperacion: "Turno del empleado eliminado satisfactoriamente." }});                            
                        } else if (res.data.resultado == 3101){
                            this.resultadoOperacion = "El turno del empleado seleccionado no existe.";
                        }
                        else if (res.data.resultado == 3106){
                            this.resultadoOperacion = "Existen eventos relacionados al turno elegido.";
                        }
                        else {
                            this.resultadoOperacion = "Hubo un error al momento de procesar la eliminación, inténtelo nuevamente.";
                        }
                    });
            }
        },    
    }
</script>
