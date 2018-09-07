<template>
    <div>
        {{ resultadoOperacion }}

        <div class="row">
            <div class="col-sm-12">
                <template v-if="eventosAsignados.length > 0">
                    <table class="table">
                        <caption class="captionCustom"><h3>Eventos asignados</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                        <thead class="greenBackground">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Inicio evento</th>
                                <th scope="col">Fin evento</th>
                                <th scope="col">Tipo evento</th>
                                <th scope="col">Servicio</th>
                                <th scope="col">Inicio turno</th>
                                <th scope="col">Fin turno</th>
                                <th scope="col">Empleado</th>
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
                                        <b-modal id="marcarSalidaModal" ref="marcarSalidaModal" @ok="controlarEventoMarcarEventoSalida"  title="Marcar salida del turno">
                                            <form @submit.stop.prevent="handleSubmit">
                                                <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                                                <p class="my-4">Inicio evento: {{puesto.inicio}} a {{puesto.fin}}</p>
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
                <template v-else-if="loaded">
                    No hay eventos asignados.
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
	 export default {
        name: 'ListadoAsistenciaEvento',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion;
            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/turno/lista-asistencia-evento`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'id_empleado',
                        valor: '10',
                        fechaInicio: '2018-09-01 00:00:00 AM',
                        fechaFin: '2018-09-10 23:59:59 PM',
                    },
                }
            })
            .then((res)=>{
                console.log(res);
                if(res.data.resultado == 100){
                    this.eventosAsignados = res.data.listaAsistenciasEvento;
                    if(res.data.cantidadElementos <= this.tamanoPagina){
                        this.cantidadPaginas = 1;
                    } else {
                        this.cantidadPaginas = Math.ceil( res.data.cantidadElementos / this.tamanoPagina);                            
                    }
                    console.log(this.cantidadPaginas);
                    this.indexActual = 1;
                    console.log(res.data.listaAsistenciasEvento);
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
                loaded: false,
                eventosAsignados: [],
                tamanoPagina: 2,
                indicePagina: 0,
                cantidadPaginas: 0,
                indexActual: 0,
                marcarFechaIngreso: null,
                marcarFechaSalida: null,
                marcarHoraIngreso: this.obtenerHoraActual,
                marcarHoraSalida: this.obtenerHoraActual,
                idPuesto: 0,
                idEvento: 0,
                resultadoOperacionMarcar: '',
            }

        },
        methods: {
            cargarDatos(index){
                this.loading = true;
                console.log(index);
                axios.get(`${process.env.BASE_URL}/api/turno/lista-asistencia-evento`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'id_empleado',
                        valor: '10',
                        fechaInicio: '2018-09-01 00:00:00 AM',
                        fechaFin: '2018-09-10 23:59:59 PM',
                    },
                }
                })
        		.then((res)=>{
                    console.log("SI ANDA ESTO");
                    console.log(res);
                    console.log(res.data.resultado);
        			if(res.data.resultado == 100){
                        this.eventosAsignados = res.data.listaAsistenciasEvento;
                        console.log(this.turnos);
                        console.log(res.data.listaAsistenciasEvento);
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
            controlarEventoMarcarEventoSalida(evt){
                evt.preventDefault()
                if (!this.marcarHoraSalida) {
                    this.resultadoOperacionMarcar = "Debe ingresar hora";
                } else {
                    this.marcarEvento(false);
                }
            },
            controlarEventoMarcarEventoEntrada(evt){
                evt.preventDefault()
                console.log(this.marcarHoraIngreso);
                if (!this.marcarHoraIngreso) {
                    this.resultadoOperacionMarcar = "Debe ingresar hora";
                    return true;
                } else {
                    this.marcarEvento(true);
                }
            }
            ,
            marcarEvento(ingreso){
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
                axios.get(`${process.env.BASE_URL}/api/turno/marcar-activacion`, {
                params: {
                    condiciones:{
                        idPuesto: this.idPuesto,
                        idEvento: this.idEvento,
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
