<template>
    <div>
        <div class="card border-success mb-3">
            {{ resultadoOperacion}}
            <p>Seguro que desea eliminar este evento?</p>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarEvento()">
                    <input type="submit" value="Eliminar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EliminarEvento',
        mounted(){
            this.evento = this.$parent.evento;
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
            	evento: {
                    id: 0,
                },
            }
        },
        methods: {
            eliminarEvento(){
                axios.delete(`${process.env.BASE_URL}/api/evento/eliminar-evento`, {data: { id: this.evento.id }}) 
                    .then((res)=>{
                        console.log(res);
                        if(res.data.resultado == 5800){
                            this.$parent.currentTab = this.$parent.tabs[6].component;                                              
                        } else if (res.data.resultado == 5801){
                            this.resultadoOperacion = "El evento seleccionado no existe.";                                                      
                        }
                    });
            }
        },    
    }
</script>
