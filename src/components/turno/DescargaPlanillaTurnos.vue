<template>
    <div>
        <h1 class="mainTitle">
        Empleados
        </h1>
        <hr class="titleUnderline">
        {{ resultadoOperacion }}
        <i v-show="loading" class="fa fa-spinner fa-spin"></i>        
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
                            <td>
                               <a href="#" class="btn btn-info" @click="seleccionarEmpleado(empleado)" role="button">Seleccionar</a>
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
       
        <hr class="titleUnderline">
        <div class="row">
            <div class="col-sm-12">
                <table class="table">                   
                    <caption class="captionCustom"><h3>Empleados Seleccionados</h3></caption>
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
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(empleado, index) in empleadosSeleccionados" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ empleado.id }}</td>
                            <td>{{ empleado.nombre }}</td>
                            <td>{{ empleado.apellido }}</td>
                            <td>{{ empleado.documento }}</td>
                            <td>{{ empleado.domicilio }}</td>
                            <td>{{ empleado.telefono }}</td>
                            <td>{{ empleado.vencimientoCarnetSalud }}</td>
                            <td>{{ empleado.vencimientoCarnetChofer }}</td>
                            <td>
                               <a href="#" class="btn btn-info" @click="quitarEmpleado(empleado)" role="button">Quitar</a>
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
        <div class="row">
            <div class="col-sm-12">
              <a @click="descargarPlanilla()" target="_blank" class="btn btn-info" role="button">Descargar Planilla</a>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'DescargaPlanillaTurnos',
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
                rolSeleccionado: null,
                loading: false,
                empleadosSeleccionados: [],
                empleadosRequest: [],
            }

        },
        methods: {
            descargarPlanilla(){
                console.log(JSON.stringify(this.empleadosRequest));
                this.loading = true;
                axios({
                    url: 'http://localhost:4567/api/turno/descargar-planilla', 
                    params: { empleados: this.empleadosRequest},
                    method: 'GET',
                    responseType: 'blob',
                    headers: {'Access-Control-Allow-Origin': '*'}
                })
                .then((res)=>{
                    console.log(res);
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'turnos.xls'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            },
            quitarEmpleado(empleado){
                this.empleados.push(empleado);
                this.empleadosSeleccionados = this.empleadosSeleccionados.filter(emp => emp.id != empleado.id);
                this.empleadosRequest = this.empleadosRequest.filter(emp => emp.id != empleado.id);
            },
            seleccionarEmpleado(empleado){
                this.empleadosSeleccionados.push(empleado);
                var emp = {
                    nombre: empleado.nombre,
                    listaRoles: [
                         {
                            descripcion: this.rolSeleccionado.descripcion
                        }
                    ],
                    id: empleado.id
                }
                this.empleadosRequest.push(emp);
                this.empleados = this.empleados.filter(emp => emp.id != empleado.id);
            },
            cambioSelect(){
                this.cargarDatos(1);
            },
            cargarDatos(index){
                this.empleados = [];
                this.loading = true;
                console.log(index);
                axios.get('http://localhost:4567/api/turno/lista-empleados-por-rol', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: index -1,
                        campo: 'nombre',
                        valor: ''+this.rolSeleccionado.id,
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
