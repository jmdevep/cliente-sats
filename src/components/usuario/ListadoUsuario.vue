<template>
    <div>
        <h1 class="mainTitle">
        Usuarios
        </h1>
        <hr class="titleUnderline">
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Lista de Usuarios</h3></caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Tipo de Usuario</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(usuario, index) in usuarios" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ usuario.id }}</td>
                            <td>{{ usuario.nombre }}</td>
                            <td>{{ usuario.tipo.nombre }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'ListadoUsuario',
        mounted(){
            axios.get('http://localhost:4567/api/usuario/lista-usuarios', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: 5,
                        indicePagina: 0,
                        campo: 'nombre',
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado = 'general_listado_hay_datos'){
                        this.usuarios = res.data.listaUsuarios;
                    }
        	});

        	},
        data(){
            return{
                usuarios: [],
            }

        },
        methods: {

    
        },    
    }
</script>
