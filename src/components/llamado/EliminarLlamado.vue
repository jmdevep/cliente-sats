<template>
    <div>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar este llamado?</div>
            {{ resultadoOperacion }}
            
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarLlamado()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Llamado</label>
                        <input type="text"  class="form-control border-success" v-model="llamado.fechaRecibido" id="nombre" disabled="true" placeholder="Nombre de Servicio">
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
        name: 'EliminarLlamado',
        mounted(){
            this.llamado = this.$route.params.llamado;
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
            	llamado: {
                    id: 0,
                    fechaRecibido: '',
                },
            }
        },
        methods: {
            eliminarLlamado(){
                axios.delete(`${process.env.BASE_URL}/api/llamado/eliminar-llamado`, {data: { id: this.llamado.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 6000){
                            this.$router.push({ name: 'PrincipalEvento', params: { resultadoOperacion: "Llamado eliminado satisfactoriamente." }});
                        } else if (res.data.resultado == 6001){
                            this.resultadoOperacion = "El Llamado seleccionado ya no existe.";
                        }
                    });
            }
        },    
    }
</script>
