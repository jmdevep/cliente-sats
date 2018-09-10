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
                                <template v-else-if="puesto.tipo == 2">
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
                                    <div>
                                        <b-btn class="btn btn-success" v-b-modal.marcarSalidaModal @click="guardarDatosParaMarcarHora(false, puesto.fin, puesto.id)">Marcar salida</b-btn>
                                        <b-modal id="marcarSalidaModal" ref="marcarSalidaModal" @ok="controlarEventoMarcarTurnoSalida"  title="Marcar salida del turno">
                                            <form @submit.stop.prevent="handleSubmit">
                                                <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                                                <p class="my-4">Turno seleccionado: {{puesto.inicio}} a {{puesto.fin}}</p>
                                                <div class="form-group">
                                                    <label for="horaS" class="darkTextCustom">Hora de salida a marcar</label>
                                                    <input type="time" class="form-control border-success" id="horaS" v-model="marcarHoraSalida"/>
                                                    <p> {{ resultadoOperacionMarcar }}</p>
                                                </div>
                                            </form>
                                        </b-modal>
                                    </div>
                                    <template v-if="puesto.tipo == 2">
                                        <router-link :to="{ name: 'ListadoAsistenciaEvento', params: { turno: turno, puesto: puesto, ingreso: false, activacionReten: true }}"><a href="#" class="btn btn-info" role="button">Marcar activación retén</a></router-link>
                                    </template>
                                </td>
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
                                <template v-else-if="puesto.tipo == 2">
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
                                    <div>
                                        <b-btn class="btn btn-success" v-b-modal.marcarIngresoModal @click="guardarDatosParaMarcarHora(true, puesto.inicio, puesto.id)">Marcar ingreso</b-btn>
                                        <b-modal id="marcarIngresoModal" ref="marcarIngresoModal" @ok="controlarEventoMarcarTurnoEntrada" title="Marcar entrada al turno">
                                            <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                                            <p class="my-4">Turno seleccionado: {{puesto.inicio}} a {{puesto.fin}}</p>
                                            <div class="form-group">
                                                <label for="horaI" class="darkTextCustom">Hora de ingreso a marcar</label>
                                                <input type="time" class="form-control border-success" id="horaI" v-model="marcarHoraIngreso"/>
                                                <p>{{ resultadoOperacionMarcar }}</p>
                                            </div>
                                        </b-modal>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
                <template v-else-if="loaded">
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
                            <template v-else-if="puesto.tipo == 2">
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
    const moment = require('moment-timezone');
	 export default {
        name: 'ListadoTurno',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion;
            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/turno/lista-turnos-activos`, {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor: '10',
                        fechaInicio: this.obtenerFechaActual(),
                        fechaFin: this.obtenerFechaActual(),
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
            axios.get(`${process.env.BASE_URL}/api/turno/lista-turnos-activables`, {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor: '10',
                        fechaInicio: this.obtenerFechaActual(),
                        fechaFin: this.obtenerFechaActual(),
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
            axios.get(`${process.env.BASE_URL}/api/turno/lista-turnos`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'id_empleado',
                        valor: '10',
                        fechaInicio: '2018-09-03 00:00:00 AM',
                        fechaFin: '2018-09-03 23:59:59 PM',
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
            this.loaded = true;
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
                loaded:false,
                turnos: [],
                turnosActivables: [],
                turnosActivos: [],
                tamanoPagina: 2,
                indicePagina: 0,
                cantidadPaginas: 0,
                indexActual: 0,
                marcarFechaIngreso: null,
                marcarFechaSalida: null,
                marcarHoraIngreso: this.obtenerHoraActual,
                marcarHoraSalida: this.obtenerHoraActual,
                idPuesto: 0,
                resultadoOperacionMarcar: '',
            }

        },
        methods: {
            cargarDatos(index){
                this.loading = true;
                console.log(index);
                axios.get(`${process.env.BASE_URL}/api/turno/lista-turnos-activos`, {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor: '10',
                        fechaInicio: obtenerFechasFiltro(true),
                        fechaFin: obtenerFechasFiltro(false),
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
                axios.get(`${process.env.BASE_URL}/api/turno/lista-turnos-activables`, {
                params: {
                    condiciones: {
                        campo: 'id_empleado',
                        valor : '10',
                        fechaInicio: this.obtenerFechaActual(),
                        fechaFin: this.obtenerFechaActual(),
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
                axios.get(`${process.env.BASE_URL}/api/turno/lista-turnos`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: index -1,
                        campo: 'id_empleado',
                        valor : '10',
                        fechaInicio: this.obtenerFechaActual(),
                        fechaFin: this.obtenerFechaActual(),
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
            obtenerFechasFiltro(inicio){
                var fechaActual = obtenerFechaActual();
                if(inicio){
                    fechaActual.setHours(0,0,0,0);
                }else{
                    fechaActual.setHours(23,0,59,0);
                }
            },
            controlarEventoMarcarTurnoSalida(evt){
                evt.preventDefault()
                if (!this.marcarHoraSalida) {
                    this.resultadoOperacionMarcar = "Debe ingresar hora";
                } else {
                    this.marcarTurno(false) // llamar función
                }
            }
            ,
            controlarEventoMarcarTurnoEntrada(evt){
                evt.preventDefault()
                console.log(this.marcarHoraIngreso);
                if (!this.marcarHoraIngreso) {
                    this.resultadoOperacionMarcar = "Debe ingresar hora";
                    return true;
                } else {
                    this.marcarTurno(true) // llamar función
                }
            }
            ,
            marcarTurno(ingreso){
                console.log(ingreso);
                this.loading = true;
                var fecha;
                if(ingreso){
                    console.log(this.marcarFechaIngreso);
                    var fechaSola = this.marcarFechaIngreso.split(" ");
                    fechaSola[0] = moment.parseZone(fechaSola[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
                    console.log(fechaSola[0]);
                    fecha  = moment.parseZone(`${fechaSola[0]} ${this.marcarHoraIngreso}`, 'YYYY-MM-DD HH:mm:ss').format();
                    console.log(fecha);
                }
                else{
                    console.log(this.marcarFechaSalida);
                    var fechaSola = this.marcarFechaSalida.split(" ");
                    fechaSola[0] = moment.parseZone(fechaSola[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
                    console.log(fechaSola[0]);
                    fecha = moment.parseZone(`${fechaSola[0]} ${this.marcarHoraSalida}`, 'YYYY-MM-DD HH:mm:ss').format();
                }
                console.log(fecha);
                axios.get(`${process.env.BASE_URL}/api/turno/marcar-turno`, {
                params: {
                    condiciones:{
                        idPuesto: this.idPuesto,
                        esInicio: ingreso,
                        hora: fecha,
                    }
                }
                })
        		.then((res)=>{
                    console.log(res);
                    
        			if(res.data.resultado == 100){
                        var resultado = res.data.filasAfectadas;
                        if(resultado > 0){
                            this.$refs.marcarIngresoModal.hide()
                            this.$refs.marcarSalidaModal.hide()
                        } else {
                            this.resultadoOperacionMarcar = 'Ha ocurrido un error.';                            
                        }
                        console.log(resultado);
                    }
                    
                });
                this.loading = false;
            },
            obtenerFechaActual(){
                var fechaActual = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                fechaActual.tz("America/Argentina/Buenos_Aires").format('YYYY-MM-DD HH:mm:ss');
                //fehcaActual = moment(fechaActual, 'YYYY-MM-DD HH:mm:ss')
                console.log(fechaActual);
                return moment.parseZone(fechaActual).format('YYYY-MM-DD HH:mm:ss');
            },
            obtenerHoraActual(){
                var horaActual = moment(new Date(), 'HH:mm:ss');
                horaActual.tz("America/Argentina/Buenos_Aires").format('HH:mm:ss');
                console.log(horaActual);
                return moment.parseZone(horaActual).format('HH:mm:ss');
            },
            guardarDatosParaMarcarHora(ingreso, fecha, puesto){
                this.idPuesto = puesto;
                if(ingreso){
                    this.marcarFechaIngreso = fecha;
                }
                else{
                    this.marcarFechaSalida = fecha;
                }
                return true;
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
