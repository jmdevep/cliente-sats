<template>
    <div>
        <h1 class="mainTitle">
        Usuarios
        </h1>
        <hr class="titleUnderline">
        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
              <a href="http://localhost:4567/api/turno/descargar-planilla" target="_blank" class="btn btn-info" role="button">Descargar Planilla</a>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'PlanillaTurnos',
        
        beforeCreate: function () {
                var usuario = this.$session.get('usuario');
                if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
                this.$router.push('/usuario/login')
                } 
        },
        data(){
            return{
                resultadoOperacion: '',
                loading: false,
            }

        },
        methods: {
            descargarPlanilla(index){
                this.loading = true;
                console.log(index);
                axios.get('http://localhost:4567/api/turno/descargar-planilla')
        		.then((res)=>{
                    console.log(res);
        			
        	    });
            },
    }
}
</script>
