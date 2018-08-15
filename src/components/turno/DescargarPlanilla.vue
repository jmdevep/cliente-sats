<template>
    <div>
        <h1 class="mainTitle">
        Empleados
        </h1>
        <hr class="titleUnderline">
        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
                <div v-if="roles.length" class="form-group">
                    <label>Seleccione un rol para cargar los empleados:</label>
                    <select id="roles" class="form-control" v-model="rolSeleccionado" @change="cambioSelect()">
                        <option  v-for="(rol,index) in roles" :key="index" v-bind:value="rol">
                            {{ rol.nombre }}
                        </option>
                    </select>
                </div>
                <table class="table">                   
                    <caption class="captionCustom"><h3>Lista de Empleados</h3></caption>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Documento</th>
                            <th scope="col">Domicilio</th>
                            <th scope="col">Telefono</th>
                            <th scope="col">Carnet de Salud</th>
                            <th scope="col">Carnet de Chofer</th>
                            <th scope="col">Usuario</th>                            
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(empleado, index) in empleados" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ empleado.id }}</td>
                            <td>{{ empleado.nombre }}</td>
                            <td>{{ empleado.apellido }}</td>
                            <td>{{ empleado.documento }}</td>
                            <td>{{ empleado.domicilio }}</td>
                            <td>{{ empleado.telefono }}</td>
                            <td>{{ empleado.vencimientoCarnetSalud }}</td>
                            <td>{{ empleado.vencimientoCarnetChofer }}</td>
                            <template v-if="empleado.usuario.id != 0">
                                <td>{{ empleado.usuario.id }}</td> 
                            </template>   
                            <template v-else>
                                <td>
                                    <router-link :to="{ name: 'AsociarUsuario', params: { empleado: empleado }}"><a href="#" class="btn btn-info" role="button">Asociar</a></router-link>                                                                                            
                                </td>   
                            </template>
                            <td>
                                <router-link :to="{ name: 'EditarEmpleado', params: { empleado: empleado }}"><a href="#" class="btn btn-info" role="button">Editar</a></router-link>
                                <router-link :to="{ name: 'EliminarEmpleado', params: { empleado: empleado }}"><a href="#" class="btn btn-danger" role="button">Eliminar</a></router-link>                                
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
        name: 'ListadoEmpleado',
        mounted(){
            this.loading = true;    
            axios.get('http://localhost:4567/api/turno/lista-roles')
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.roles = res.data.roles;
                        this.roles.forEach(function(obj) { obj.disabled = false; });
                    }
                    this.loading = false;
        	});
        	

        	},
        data(){
            return{
                resultadoOperacion: '',
                empleados: [],
                tamanoPagina: 2,
                indicePagina: 0,
                cantidadPaginas: 0,
                indexActual: 0,
                roles: [],
            }

        },
        methods: {
            cambioSelect(){
                
            },
            cargarDatos(index){
                this.loading = true;
                console.log(index);
                axios.get('http://localhost:4567/api/empleado/lista-empleados', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: index -1,
                        campo: 'nombre',
                    },
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.empleados = res.data.listaEmpleados;
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
