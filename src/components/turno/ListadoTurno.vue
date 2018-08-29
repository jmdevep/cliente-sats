<template>
    <div>
        {{ resultadoOperacion }}

        <div class="row">
            <div class="col-sm-12">
                <template v-if="turnosActivos.length > 0">
                    <table class="table">
                        <caption class="captionCustom"><h3>Turno activo</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                        <thead class="greenBackground">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Inicio turno</th>
                                <th scope="col">Fin turno</th>
                                <th scope="col">Tipo turno</th>
                                <th scope="col">Empleado</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Rol</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody v-for="(turno, index) in turnosActivos" :key="index" class="tableBodyBackground">
                            <tr v-for="(puesto, index) in turno.puestos" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ turno.inicio }}</td>
                                <td>{{ turno.fin }}</td>
                                <template v-if="puesto.tipo == 1">
                                    <td>Guardia</td>
                                </template>
                                <template v-if="puesto.tipo == 2">
                                    <td>Retén</td>
                                </template>
                                <template v-else>
                                    <td>--</td>
                                </template>
                                <td>{{ puesto.empleado.apellido }}, {{ puesto.empleado.nombre }}</td>
                                <td>{{ puesto.empleado.documento }}</td>
                                <td>{{ puesto.rol.nombre }}</td>
                                <td>{{ puesto.estado }}</td>
                                <td>
                                    <router-link :to="{ name: 'MarcarTurno', params: { turno: turno, puesto: puesto, ingreso: false, activacionReten: false }}"><a href="#" class="btn btn-info" role="button">Marcar ingreso</a></router-link>
                                </td>
                                <template v-if="puesto.tipo == 2">
                                    <td colspan="9"><router-link :to="{ name: 'MarcarTurno', params: { turno: turno, puesto: puesto, ingreso: false, activacionReten: true }}"><a href="#" class="btn btn-info" role="button">Marcar activación retén</a></router-link></td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </template>
                <template v-else-if="turnosActivables.length > 0">
                    <table class="table">
                        <caption class="captionCustom"><h3>Marcar ingreso</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                        <thead class="greenBackground">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Inicio turno</th>
                                <th scope="col">Fin turno</th>
                                <th scope="col">Tipo turno</th>
                                <th scope="col">Empleado</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Rol</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody v-for="(turno, index) in turnosActivables" :key="index" class="tableBodyBackground">
                            <tr v-for="(puesto, index) in turno.puestos" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ turno.inicio }}</td>
                                <td>{{ turno.fin }}</td>
                                <template v-if="puesto.tipo == 1">
                                    <td>Guardia</td>
                                </template>
                                <template v-if="puesto.tipo == 2">
                                    <td>Retén</td>
                                </template>
                                <template v-else>
                                    <td>--</td>
                                </template>
                                <td>{{ puesto.empleado.apellido }}, {{ puesto.empleado.nombre }}</td>
                                <td>{{ puesto.empleado.documento }}</td>
                                <td>{{ puesto.rol.nombre }}</td>
                                <td>{{ puesto.estado }}</td>
                                <td>
                                    <router-link :to="{ name: 'MarcarTurno', params: { turno: turno, puesto: puesto, ingreso: true, activacionReten: false }}"><a href="#" class="btn btn-info" role="button">Marcar ingreso</a></router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
                <template v-else>
                    No hay turnos activos ni planeados cerca de esta hora.
                </template>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Listado de turnos</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Inicio turno</th>
                            <th scope="col">Fin turno</th>
                            <th scope="col">Tipo turno</th>
                            <th scope="col">Empleado</th>
                            <th scope="col">Documento</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody v-for="(turno, index) in turnos" :key="index" class="tableBodyBackground">
                        <tr v-for="(puesto, index) in turno.puestos" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ turno.inicio }}</td>
                            <td>{{ turno.fin }}</td>
                            <template v-if="puesto.tipo == 1">
                                <td>Guardia</td>
                            </template>
                            <template v-if="puesto.tipo == 2">
                                <td>Retén</td>
                            </template>
                            <template v-else>
                                <td>--</td>
                            </template>
                            <td>{{ puesto.empleado.apellido }}, {{ puesto.empleado.nombre }}</td>
                            <td>{{ puesto.empleado.documento }}</td>
                            <td>{{ puesto.rol.nombre }}</td>
                            <td>{{ puesto.estado }}</td>
                            <td>
                            <template v-if="puesto.fin">
                                <router-link :to="{ name: 'EditarPuesto', params: { turno: turno, puesto: puesto }}"><a href="#" class="btn btn-info" role="button">Modificar</a></router-link>
                            </template>   
                            <template v-else>
                                <router-link :to="{ name: 'RegistroSociedad', params: { cliente: empresa }}"><a href="#" class="btn btn-info" role="button">Asociar individualmente</a></router-link>                                                                                            
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
        name: 'ListadoTurno',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion;

            this.loading = true;
            axios.get('https://servidor-sats.herokuapp.com/api/turno/lista-turnos-activos', {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor: '7',
                        fechaInicio: new Date(),
                        fechaFin: new Date(),
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
                    
        			if(res.data.resultado == 100){
                        this.turnosActivos = res.data.listaTurnos;
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
            axios.get('https://servidor-sats.herokuapp.com/api/turno/lista-turnos-activables', {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor: '7',
                        fechaInicio: new Date(),
                        fechaFin: new Date(),
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
                    
        			if(res.data.resultado == 100){
                        this.turnosActivables = res.data.listaTurnos;
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
            axios.get('https://servidor-sats.herokuapp.com/api/turno/lista-turnos', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'id_empleado',
                        valor: '7',
                        fechaInicio: new Date(),
                        fechaFin: new Date(),
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
                    
        			if(res.data.resultado == 100){
                        this.turnos = res.data.listaTurnos;
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
                turnos: [],
                turnosActivables: [],
                turnosActivos: [],
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
                axios.get('https://servidor-sats.herokuapp.com/api/turno/lista-turnos-activos', {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor : '7',
                        fechaInicio: new Date(),
                        fechaFin: new Date(),
                    },
                }
                })
        		.then((res)=>{
                    console.log("SI ANDA ESTO");
                    console.log(res);
                    console.log(res.data.resultado);
        			if(res.data.resultado == 100){
                        this.turnosActivos = res.data.listaTurnos;
                        console.log(this.turnos);
                        console.log(res.data.listaTurnos);
                        this.indexActual = index;
                    }
        	    });
                axios.get('https://servidor-sats.herokuapp.com/api/turno/lista-turnos-activables', {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor : '7',
                        fechaInicio: new Date(),
                        fechaFin: new Date(),
                    },
                }
                })
        		.then((res)=>{
                    console.log("SI ANDA ESTO");
                    console.log(res);
                    console.log(res.data.resultado);
        			if(res.data.resultado == 100){
                        this.turnosActivables = res.data.listaTurnos;
                        console.log(this.turnos);
                        console.log(res.data.listaTurnos);
                        this.indexActual = index;
                    }
        	    });
                axios.get('https://servidor-sats.herokuapp.com/api/turno/lista-turnos', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: index -1,
                        campo: 'id_empleado',
                        valor : '7',
                        fechaInicio: new Date(),
                        fechaFin: new Date(),
                    },
                }
                })
        		.then((res)=>{
                    console.log("SI ANDA ESTO");
                    console.log(res);
                    console.log(res.data.resultado);
        			if(res.data.resultado == 100){
                        this.turnos = res.data.listaTurnos;
                        console.log(this.turnos);
                        console.log(res.data.listaTurnos);
                        this.indexActual = index;
                    }
        	    });
                this.loading = false;
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
