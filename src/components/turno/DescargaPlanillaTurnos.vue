<template>
    <div>
        {{ resultadoOperacion }}
        <i v-show="loading" class="fa fa-spinner fa-spin"></i>        
        <div class="row">
            <div class="col-sm-12">
                <div v-if="meses.length" class="form-group">
                    <label>Mes a planificar:</label>
                    <select id="meses" class="form-control" v-model="mesSeleccionado">
                        <option  v-for="(mes,index) in meses" :key="index" v-bind:value="mes">
                            {{ mes.textoMes }} - {{mes.anio}}
                        </option>
                    </select>
                </div>
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
              <a @click="descargarPlanilla()" target="_blank" class="btn btn-success" role="button">Descargar Planilla</a>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    const FileDownload = require('js-file-download');
	 export default {
        name: 'DescargaPlanillaTurnos',
        mounted(){
            this.loading = true;    
            axios.get(`${process.env.BASE_URL}/api/turno/lista-roles`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.roles = res.data.roles;
                        this.roles.forEach(function(obj) { obj.disabled = false; });
                    }
                    this.loading = false;
            });
            this.cargarSelectMeses();
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
                meses: [],
                mesSeleccionado: {
                    id: 0, 
                    mes: 0, 
                    textoMes: 'textoMes', 
                    anio: 0
                },
            }
        },
        methods: {
            descargarPlanilla(){
                console.log(JSON.stringify(this.empleadosRequest));
                this.loading = true;
                axios({
                    url: `${process.env.BASE_URL}/api/turno/descargar-planilla`, 
                    params: { empleados: this.empleadosRequest},
                    method: 'GET',
                    responseType: 'blob',
                    headers: {'Access-Control-Allow-Origin': '*'}
                })
                .then((res)=>{
                    console.log(res);
                    FileDownload(res.data, 'Planilla-Turnos.xlsx')
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
                    apellido: empleado.apellido,
                    listaRoles: [
                         {
                            descripcion: this.rolSeleccionado.descripcion
                        }
                    ],
                    id: empleado.id
                }
                console.log(emp);
                this.empleadosRequest.push(emp);
                this.empleados = this.empleados.filter(emp => emp.id != empleado.id);
            },
            cambioSelect(){
                this.cargarDatos(1);
            },
            cargarSelectMeses(){
                var fechaActual = moment(new Date());
                var fechaAux = null;

                for(var i = -2; i <= 3; i++){
                    if(i >= 0){
                        fechaAux = moment(fechaActual).clone().add(i, 'M');
                        console.log(fechaAux);
                        console.log(fechaActual);
                    }else{
                        fechaAux = moment(fechaActual).clone().subtract(Math.abs(i), 'months');
                    }
                    var mesAux = moment(fechaAux).clone().month();
                    var anioAux = moment(fechaAux).clone().year();
                    var textoMes = this.obtenerMesDesdeNumero(mesAux);
                    var elMes = {
                        id: i, 
                        mes: mesAux, 
                        textoMes: textoMes, 
                        anio: anioAux,
                        };
                    if(i == 0){
                       this.mesSeleccionado = elMes; 
                    }
                    this.meses.push(elMes);
                }
            },
            obtenerMesDesdeNumero(numeroMes){
                switch(numeroMes){
                    case 0: return 'Enero';
                    case 1: return 'Febrero';
                    case 2: return 'Marzo';
                    case 3: return 'Abril';
                    case 4: return 'Mayo';
                    case 5: return 'Junio';
                    case 6: return 'Julio';
                    case 7: return 'Agosto';
                    case 8: return 'Setiembre';
                    case 9: return 'Octubre';
                    case 10: return 'Noviembre';
                    case 11: return 'Diciembre';
                    default: return 'Mes no definido';
                }
            },
            cargarDatos(index){
                this.empleados = [];
                this.loading = true;
                console.log(index);
                axios.get(`${process.env.BASE_URL}/api/turno/lista-empleados-por-rol`, {

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
