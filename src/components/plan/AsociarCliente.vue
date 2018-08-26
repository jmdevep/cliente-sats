<template>
    <div>
        <h1 class="mainTitle">
        Asociar plan
        </h1>
        <hr class="titleUnderline">
        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Lista de clientes</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Documento</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(empresa, index) in empresas" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ empresa.nombre }}</td>
                            <td>{{ empresa.rut }}</td>
                            <template v-if="empresa.plan && empresa.plan.id != 0">
                                <router-link :to="{ name: 'EditarEmpresa', params: { cliente: empresa }}"><a href="#" class="btn btn-info" role="button">Editar</a></router-link>
                            <router-link :to="{ name: 'EliminarEmpresa', params: { cliente: empresa }}"><a href="#" class="btn btn-danger" role="button">Eliminar</a></router-link>
                            </template>   
                            <template v-else>
                                <td>
                                    <router-link :to="{ name: 'AsociarUsuario', params: { cliente: empresa }}"><a href="#" class="btn btn-info" role="button">Asociar</a></router-link>                                                                                            
                                </td>   
                            </template>
                        </tr>
                        <tr v-for="(persona, index) in personas" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ persona.nombre }}</td>
                            <td>{{ persona.documento }}</td>
                            <td>
                                <template v-if="persona.plan && persona.plan.id != 0">
                                    <router-link :to="{ name: 'EditarEmpresa', params: { cliente: persona }}"><a href="#" class="btn btn-info" role="button">Editar</a></router-link>
                                <router-link :to="{ name: 'EliminarEmpresa', params: { cliente: persona }}"><a href="#" class="btn btn-danger" role="button">Eliminar</a></router-link>
                                </template>   
                                <template v-else>
                                    <td>
                                        <router-link :to="{ name: 'AsociarUsuario', params: { cliente: persona }}"><a href="#" class="btn btn-info" role="button">Asociar</a></router-link>                                                                                            
                                    </td>   
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ul class="pagination">
                    <li class="page-item" v-bind:class="{ 'disabled' : (indexActual==1) }">
                    <a @click="cargarAnterior()" class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Anterior</span>
                    </a>
                    </li> 
                    <li class="page-item" v-bind:class="{ 'disabled' : (index==indexActual) }" v-for="index in cantidadPaginas" :key="index"><a @click="cargarDatos(index)" class="page-link" href="#">{{ index }}</a></li>
                    <li class="page-item"  v-bind:class="{ 'disabled' : (indexActual==cantidadPaginas) }">
                    <a @click="cargarSiguiente()" class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Siguiente</span>
                    </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'ListadoEmpresa',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion;

            this.loading = true;
            axios.get('https://servidor-sats.herokuapp.com/api/cliente/lista-empresas', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'nombre',
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
                    
        			if(res.data.resultado == 100){
                        this.empresas = res.data.listadoEmpresas;
                        if(res.data.cantidadElementos <= this.tamanoPagina){
                            this.cantidadPaginas = 1;
                        } else {
                            this.cantidadPaginas = Math.ceil( res.data.cantidadElementos / this.tamanoPagina);                            
                        }
                        console.log(this.cantidadPaginas);
                        this.indexActual = 1;
                    }
                    this.loading = false;
        	});
            axios.get('https://servidor-sats.herokuapp.com/api/cliente/lista-personas', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'nombre_persona',
                    },
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.personas = res.data.listaPersonas;
                        this.indexActual = 1;
                    }
                    this.loading = false;
        	    });
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
                loading: false,
                empresas: [],
                personas: [],
                tamanoPagina: 2,
                indicePagina: 0,
                cantidadPaginas: 0,
                indexActual: 0,
            }

        },
        methods: {
            cargarDatos(index){
                this.loading = true;
                console.log(index);
                axios.get('https://servidor-sats.herokuapp.com/api/cliente/lista-empresas', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'nombre_empresa',
                    },
                }
                })
        		.then((res)=>{
                    console.log("SI ANDA ESTO");
                    console.log(res);
                    console.log(res.data.resultado);
        			if(res.data.resultado == 100){
                        this.empresas = res.data.listadoEmpresas;
                        console.log(this.empresas);
                        console.log(res.data.listadoEmpresas);
                        this.indexActual = index;
                    }
                });
                axios.get('https://servidor-sats.herokuapp.com/api/cliente/lista-personas', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: index -1,
                        campo: 'nombre_persona',
                    },
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.personas = res.data.listaPersonas;
                        this.indexActual = index;
                    }
                    this.loading = false;
        	    });
            },
            cargarSiguiente(){
                this.cargarDatos(this.indexActual + 1);
            },
            cargarAnterior(){
                this.cargarDatos(this.indexActual - 1);
            }   
        },    
    }
</script>
