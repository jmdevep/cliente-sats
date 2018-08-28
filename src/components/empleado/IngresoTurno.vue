<template>
	<ul>
		<li v-for="(puesto,index) in puestos" :key="index" style="display:flex">
			{{puesto.id}}    <a href="#">Editar</a> - <a href="#">Eliminar</a>
		</li>
	</ul>
</template>
<style>
	
</style>
<script>
	import axios from 'axios';
	 export default {
        name: 'IngresoTurno',
        mounted(){
			axios.get('http://localhost:4567/api/turnos/turnos-activacion', {
				params: {
					idEmpleado: 4,
			  }
			  })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.message = 1){
        				this.puestos = res.data.puestos;
        			}
        	});

        	},
        data(){
            return{
                disabled: 0,
            	puestos: [],
            }

        },
        methods: {
    }
}
</script>
