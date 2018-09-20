<template>
    <div>

        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Lista de clientes</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
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
                            <td>
                            <template v-if="empresa.sociedad && empresa.sociedad.id != 0">
                                <router-link :to="{ name: 'AgregarSocioGrupo', params: { cliente: empresa }}"><a href="#" class="btn btn-info" role="button">Agregar socio grupal</a></router-link>
                                <router-link :to="{ name: 'EliminarSociedad', params: { cliente: empresa }}"><a href="#" class="btn btn-danger" role="button">Desasociar</a></router-link>
                            </template>   
                            <template v-else>
                                    <router-link :to="{ name: 'RegistroSociedad', params: { cliente: empresa }}"><a href="#" class="btn btn-info" role="button">Asociar individualmente</a></router-link>                                                                                            
                            </template>
                            </td> 
                        </tr>
                    </tbody>
                    <ul class="pagination">
                    <li class="page-item" v-bind:class="{ 'disabled' : (indexActualEmpresas==1) }">
                    <a @click="cargarAnteriorEmpresas()" class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Anterior</span>
                    </a>
                    </li> 
                    <li class="page-item" v-bind:class="{ 'disabled' : (index==indexActualEmpresas) }" v-for="index in cantidadPaginasEmpresas" :key="index"><a @click="cargarDatosEmpresas(index)" class="page-link" href="#">{{ index }}</a></li>
                    <li class="page-item"  v-bind:class="{ 'disabled' : (indexActualEmpresas==cantidadPaginasEmpresas) }">
                    <a @click="cargarSiguienteEmpresas()" class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Siguiente</span>
                    </a>
                    </li>
                </ul>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Documento</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>    
                    <tbody class="tableBodyBackground">
                        <tr v-for="(persona, index) in personas" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ persona.nombre }}</td>
                            <td>{{ persona.documento }}</td>
                            <td>
                                <template v-if="persona.sociedad && persona.sociedad.id != 0">
                                    <router-link :to="{ name: 'AsociarClienteGrupo', params: { cliente: persona }}"><a href="#" class="btn btn-info" role="button">Agregar socio grupal</a></router-link>
                                    <a href="#" class="btn btn-danger" role="button" v-on:click="convertirPersonaEnCliente(persona)">Desasociar</a>
                                </template>   
                                <template v-else>
                                    <router-link :to="{ name: 'RegistroSociedad', params: { cliente: persona }}"><a href="#" class="btn btn-info" role="button">Asociar individualmente</a></router-link>                                                                                              
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ul class="pagination">
                    <li class="page-item" v-bind:class="{ 'disabled' : (indexActualPersonas==1) }">
                    <a @click="cargarAnteriorPersonas()" class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Anterior</span>
                    </a>
                    </li> 
                    <li class="page-item" v-bind:class="{ 'disabled' : (index==indexActualPersonas) }" v-for="index in cantidadPaginasPersonas" :key="index"><a @click="cargarDatosPersonas(index)" class="page-link" href="#">{{ index }}</a></li>
                    <li class="page-item"  v-bind:class="{ 'disabled' : (indexActualPersonas==cantidadPaginasPersonas) }">
                    <a @click="cargarSiguientePersonas()" class="page-link" href="#" aria-label="Next">
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
        name: 'AsociarCliente',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion;

            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/cliente/lista-empresas`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indexActualEmpresas,
                        campo: 'nombre',
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
                    
        			if(res.data.resultado == 100){
                        this.empresas = res.data.listadoEmpresas;
                        if(res.data.cantidadElementos <= this.tamanoPagina){
                            this.cantidadPaginasEmpresas = 1;
                        } else {
                            this.cantidadElementosEmpresas = res.data.cantidadElementos;
                            this.cantidadPaginasEmpresas = Math.ceil(this.cantidadElementosEmpresas / this.tamanoPagina);                            
                        }
                        console.log(this.cantidadPaginasEmpresas);
                        this.indexActualEmpresas = 1;
                    }
                    this.loading = false;
        	});
            axios.get(`${process.env.BASE_URL}/api/cliente/lista-personas`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indexActualPersonas,
                        campo: 'nombre_persona',
                    },
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.personas = res.data.listaPersonas;
                        this.indexActualPersonas = 1;
                        if(res.data.cantidadElementos <= this.tamanoPagina){
                            this.cantidadPaginasPersonas = 1;
                        } else {
                            this.cantidadElementosPersonas = res.data.cantidadElementos;
                            this.cantidadPaginasPersonas = Math.ceil(this.cantidadElementosPersonas / this.tamanoPagina);                            
                        }
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
                indicePaginaEmpresas: 0,
                indicePaginaPersonas: 0,
                cantidadPaginasEmpresas: 0,
                cantidadPaginasPersonas: 0,
                indexActualEmpresas: 0,
                indexActualPersonas: 0,
                cantidadElementosEmpresas: 0,
                cantidadElementosPersonas: 0,
            }

        },
        methods: {
            cargarDatosEmpresas(index){
                this.loading = true;
                this.indexActualEmpresas = index;
                console.log(index);
                axios.get(`${process.env.BASE_URL}/api/cliente/lista-empresas`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indexActualEmpresas,
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
                    }
                });
                this.loading = false;
            },
            cargarDatosPersonas(index){
                this.loading = true;
                console.log("Cargar datos Personas indice", + index);
                this.indexActualPersonas = index;
                axios.get(`${process.env.BASE_URL}/api/cliente/lista-personas`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: index,
                        campo: 'nombre_persona',
                    },
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.personas = res.data.listaPersonas;
                    }
                });
                this.loading = false;
            },
            convertirPersonaEnCliente(persona){
                var cliente = {
                    id: persona.id,
                    nombre: persona.nombre,
                    direccion: persona.direccion,
                    telefono: persona.telefono,
                    fechaIngreso: persona.fechaIngreso,
                    sociedad:persona.sociedad,
                };
                this.$router.replace({name: "EliminarSociedad", params: {cliente: cliente}});
            },
            convertirEmpresaEnCliente(empresa){
                var cliente = {
                    id: empresa.id,
                    nombre: empresa.nombre,
                    direccion: empresa.direccion,
                    telefono: empresa.telefono,
                    fechaIngreso: empresa.fechaIngreso,
                    sociedad:empresa.sociedad,
                };
                this.$router.replace({name: "EliminarSociedad", params: {cliente: cliente}});
            },
            cargarSiguienteEmpresas(){
                this.cargarDatosEmpresas(this.indexActualEmpresas + 1);
            },
            cargarSiguientePersonas(){
                this.cargarDatosPersonas(this.indexActualPersonas + 1);
            },
            cargarAnteriorEmpresas(){
                this.cargarDatosEmpresas(this.indexActualEmpresas - 1);
            },
            cargarAnteriorPersonas(){
                this.cargarDatosPersonas(this.indexActualPersonas - 1);
            }   
        },    
    }
</script>
