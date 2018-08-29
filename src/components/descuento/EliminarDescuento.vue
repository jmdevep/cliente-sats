<template>
    <div>
        <h1 class="mainTitle">
        Clientes
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">¿Seguro desea eliminar este descuento?</div>
            {{ resultadoOperacion }}
            
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarDescuento()">
                    <div class="form-group">
                        <label for="motivo" class="darkTextCustom">Motivo del descuento</label>
                        <input type="text"  class="form-control border-success" v-model="descuento.motivo" id="motivo" disabled="true" placeholder="Motivo del descuento">
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
        name: 'EliminarDescuento',
        mounted(){
            this.descuento = this.$route.params.descuento;
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
            	descuento:{
                    id: 0,
                    motivo: '',
                    porcentaje: 0,
                },
            }
        },
        methods: {
            eliminarDescuento(){
                axios.delete('https://servidor-sats.herokuapp.com/api/cliente/eliminar-descuento', {data: { id: this.descuento.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5450){
                            this.$router.push({ name: 'ListadoDescuento', params: { resultadoOperacion: "Descuento eliminado satisfactoriamente." }});
                        } else if (res.data.resultado == 5451){
                            this.resultadoOperacion = "El descuento seleccionado no existe.";
                        }
                    });
            }
        },    
    }
</script>