<template>
    <div>
        {{ resultadoOperacion }}
        <template v-if="verMarcar">
        <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label class="darkTextCustom">Fecha Inicio</label>
                <datetime type="datetime" value-zone="America/Montevideo"
  zone="America/Montevideo"
  format="yyyy-MM-dd HH:mm:ss"
  :phrases="{ok: 'Continuar', cancel: 'Cancelar'}" v-model="fechaInicioSeleccionada"></datetime>
                {{ this.fechaInicioSeleccionada }} <!-- https://mariomka.github.io/vue-datetime/ -->
              </div>
              <div class="form-group">
                <label class="darkTextCustom">Fecha Fin</label>
                <datetime type="datetime"   value-zone="America/Montevideo"
  zone="America/Montevideo"
  format="yyyy-MM-dd HH:mm:ss"
  :phrases="{ok: 'Continuar', cancel: 'Cancelar'}"  v-model="fechaFinSeleccionada"></datetime>
                {{ this.fechaFinSeleccionada }}
              </div>
              <b-btn class="btn btn-success" @click="filtroActualizado()">Buscar <i class="fas fa-search"></i></b-btn>
              
                <template v-if="turnosActivos.length > 0">
                    <table class="table table-responsive table-hover">
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
                                    <b-button-group vertical>
                                        <div>
                                            <b-btn class="btn btn-success" v-b-modal.marcarSalidaModal @click="guardarDatosParaMarcarHora(false, true, turno, puesto)"><i class="fas fa-door-closed"></i> Marcar salida</b-btn>
                                        </div>
                                        <template v-if="puesto.tipo == 2">
                                            <router-link :to="{ name: 'ListadoAsistenciaEvento', params: { turno: turno, puesto: puesto, ingreso: false, activacionReten: true }}"><a  class="btn btn-success" role="button"><i class="fas fa-ambulance"></i> Marcar activación retén</a></router-link>
                                        </template>
                                    </b-button-group>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
                <template v-else-if="turnosActivables.length > 0">
                    <table class="table table-responsive table-hover">
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
                                        <b-btn class="btn btn-success" v-b-modal.marcarIngresoModal @click="guardarDatosParaMarcarHora(true, false, turno, puesto)"><i class="fas fa-door-open"></i> Marcar ingreso</b-btn>
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
        <b-modal id="marcarIngresoModal" v-model="mostrarModalIngreso" ref="marcarIngresoModal" title="Marcar entrada al turno">
                                            <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                                            <p class="my-4">Turno seleccionado: {{puestoSeleccionado.inicio}} a {{puestoSeleccionado.fin}}</p>
                                            <div class="form-group">
                                                <label for="horaI" class="darkTextCustom">Hora de ingreso a marcar</label>
                                                <input type="time" class="form-control border-success" id="horaI" v-model="marcarHoraIngreso"/>
                                                <p>{{ resultadoOperacionMarcar }}</p>
                                            </div>
                                            <div slot="modal-footer" class="w-100">
                                                <p class="float-left"></p>
                                                <b-btn size="sm" id="btnMarcarIngreso" :disabled="habilitarBotonIngreso" class="float-right" variant="primary" @click="controlarEventoMarcarTurnoEntrada(); mostrar=false">
                                                    Marcar ingreso
                                                </b-btn>
                                            </div>
                                        </b-modal>
                                        <b-modal id="marcarSalidaModal" v-model="mostrarModalSalida" ref="marcarSalidaModal"  title="Marcar salida del turno">
                                            <form @submit.stop.prevent="handleSubmit">
                                                <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                                                <p class="my-4">Turno seleccionado: {{puestoSeleccionado.inicio}} a {{puestoSeleccionado.fin}}</p>
                                                <div class="form-group">
                                                    <label for="horaS" class="darkTextCustom">Hora de salida a marcar</label>
                                                    <input type="time" class="form-control border-success" id="horaS" v-model="marcarHoraSalida"/>
                                                    <p> {{ resultadoOperacionMarcar }}</p>
                                                </div>
                                            </form>
                                            <div slot="modal-footer" class="w-100">
                                                <p class="float-left"></p>
                                                <b-btn size="sm" id="btnMarcarSalida" :disabled="habilitarBotonSalida" class="float-right" variant="primary" @click="controlarEventoMarcarTurnoSalida(); mostrar=false">
                                                    Marcar salida
                                                </b-btn>
                                            </div>
                                        </b-modal>
        </template>
        <div class="row">
            <div class="col-sm-12">
                <table class="table table-responsive table-hover">
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
                                <b-button-group>
                                    <template v-if="verMarcar">
                                        <div>
                                            <b-btn class="btn btn-success" @click="guardarDatosParaMarcarHora(true, true, turno, puesto); mostrarModalHora=true;"><i class="fas fa-user-clock"></i></b-btn>
                                            <b-btn class="btn btn-success"><i class="fas fa-sync"></i></b-btn>
                                        </div>
                                    </template> 
                                    <template v-if="verModificar">
                                        <router-link :to="{ name: 'EditarPuesto', params: { puesto: puesto }}"><a  class="btn btn-success" role="button"><i class="far fa-edit"></i></a></router-link>
                                        <router-link :to="{ name: 'EliminarPuesto', params: { puesto: puesto }}"><a  class="btn btn-danger" role="button"><i class="fas fa-trash-alt"></i></a></router-link>
                                    </template> 
                                </b-button-group>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <b-modal id="marcarHoraModal" ref="marcarHoraModal" v-model="mostrarModalHora" title="Marcar turno">
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p class="my-4">Turno seleccionado: {{puestoSeleccionado.inicio}} a {{puestoSeleccionado.fin}}</p>
                    <div class="form-group">
                        <label for="horaI" class="darkTextCustom">Hora de ingreso a marcar</label>
                        <input type="time" class="form-control border-success" id="horaI" v-model="marcarHoraIngreso"/>
                    </div>
                    <div class="form-group">
                            <label for="horaS" class="darkTextCustom">Hora de salida a marcar</label>
                            <input type="time" class="form-control border-success" id="horaS" v-model="marcarHoraSalida"/>
                            <p> {{ resultadoOperacionMarcar }}</p>
                    </div>
                    <div slot="modal-footer" class="w-100">
                        <p class="float-left"></p>
                        <b-btn size="sm" id="btnMarcarHora" :disabled="habilitarBotonHora" class="float-right" variant="primary" @click="controlarEventoMarcarTurno(); mostrar=false">
                            Marcar hora
                        </b-btn>
                    </div>
                </b-modal>
                <ul class="pagination">
                    <li class="page-item" v-bind:class="{ 'disabled' : (indexActual==1) }">
                        <a @click="cargarAnterior()" class="page-link"  aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Anterior</span>
                        </a>
                    </li> 
                    <li class="page-item" v-bind:class="{ 'disabled' : (index==indexActual) }" v-for="index in cantidadPaginas" :key="index"><a @click="cargarDatos(index)" class="page-link" >{{ index }}</a></li>
                    <li class="page-item"  v-bind:class="{ 'disabled' : (indexActual==cantidadPaginas) }">
                        <a @click="cargarSiguiente()" class="page-link"  aria-label="Next">
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
import axios from "axios";
const moment = require("moment-timezone");
export default {
  name: "ListadoTurno",
  mounted() {
    this.fechaInicioSeleccionada = moment()
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    this.fechaFinSeleccionada = moment()
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    this.resultadoOperacion = this.$route.params.resultadoOperacion;
    this.loading = true;
    this.cargarUsuarioLogueado();
    this.loaded = true;
  },
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null) {
      this.$router.push("/usuario/login");
    }
    if (usuario.tipo.id == 1) {
      this.verModificar = false;
      this.verMarcar = true;
    } else if (usuario.tipo.id == 2) {
      this.verModificar = true;
      this.verMarcar = false;
    } else if (usuario.tipo.id == 3) {
      this.verModificar = true;
      this.verMarcar = false;
    }
  },
  data() {
    return {
      fechaInicioSeleccionada: null,
      fechaFinSeleccionada: null,
      usuarioLogueado: null,
      resultadoOperacion: "",
      loading: false,
      loaded: false,
      turnos: [],
      turnosActivables: [],
      turnosActivos: [],
      tamanoPagina: 2,
      indicePagina: 0,
      cantidadPaginas: 0,
      indexActual: 0,
      marcarFechaIngreso: null,
      marcarFechaSalida: null,
      marcarHoraIngreso: null,
      marcarHoraSalida: null,
      resultadoOperacionMarcar: "",
      verModificar: true,
      verMarcar: true,
      mostrarModalIngreso: false,
      mostrarModalSalida: false,
      mostrarModalHora: false,
      habilitarBotonIngreso: false,
      habilitarBotonSalida: false,
      habilitarBotonHora: false,
      idEmpleado: 0,
      puestoSeleccionado: {
        id: 0,
        inicio: "",
        fin: "",
        rol: {
          id: 0,
          nombre: "",
          descripcion: ""
        },
        empleado: null,
        estado: 0,
        tipo: 0,
        idTurno: 0
      },
      turnoSeleccionado: {
        id: 0,
        inicio: "",
        fin: ""
      }
    };
  },
  methods: {
    cargarUsuarioLogueado() {
      this.usuarioLogueado = this.$session.get("usuario");
      if (this.usuarioLogueado.tipo.id == 1) {
        this.verModificar = false;
        this.verMarcar = true;
        this.idEmpleado = this.usuarioLogueado.empleado.id;
        this.cargarDatos(0);
      } else if (this.usuarioLogueado.tipo.id == 2) {
        this.verModificar = true;
        this.verMarcar = true;
        this.idEmpleado = 0;
        this.cargarTurnos(0);
      } else if (this.usuarioLogueado.tipo.id == 3) {
        this.verModificar = true;
        this.verMarcar = false;
        this.idEmpleado = 0;
        this.cargarTurnos(0);
      }
      console.log(this.usuarioLogueado);
    },
    cargarTurnosActivables() {
      axios
        .get(`${process.env.BASE_URL}/api/turno/lista-turnos-activables`, {
          params: {
            condiciones: {
              campo: "id_empleado",
              valor: String(this.idEmpleado),
              fechaInicio: this.obtenerFechaActual(),
              fechaFin: this.fechaFinSeleccionada
            }
          }
        })
        .then(res => {
          console.log(res);

          if (res.data.resultado == 100) {
            this.turnosActivables = res.data.listaTurnos;
            if (res.data.cantidadElementos <= this.tamanoPagina) {
              this.cantidadPaginas = 1;
            } else {
              this.cantidadPaginas = Math.ceil(
                res.data.cantidadElementos / this.tamanoPagina
              );
            }
            console.log(this.cantidadPaginas);
            this.indexActual = 1;
          }
          this.loading = false;
        });
    },
    cargarTurnosActivos() {
      axios
        .get(`${process.env.BASE_URL}/api/turno/lista-turnos-activos`, {
          params: {
            condiciones: {
              campo: "id_empleado",
              valor: String(this.idEmpleado),
              fechaInicio: this.fechaInicioSeleccionada,
              fechaFin: this.fechaFinSeleccionada
            }
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.turnosActivos = res.data.listaTurnos;
            if (res.data.cantidadElementos <= this.tamanoPagina) {
              this.cantidadPaginas = 1;
            } else {
              this.cantidadPaginas = Math.ceil(
                res.data.cantidadElementos / this.tamanoPagina
              );
            }
            console.log(this.cantidadPaginas);
            this.indexActual = 1;
          }
          this.loading = false;
        });
    },
    cargarTurnos(index) {
      console.log("Index: ", index);
      console.log("Fecha Inicio: ", this.fechaInicioSeleccionada);
      var fechaInicio = this.obtenerFechaFormateada(this.fechaInicioSeleccionada);
      console.log("Fecha Inicio Formateada: ", fechaInicio);
      var fechaFin = this.obtenerFechaFormateada(this.fechaFinSeleccionada);
      console.log(fechaInicio);
      console.log(fechaFin);
      axios
        .get(`${process.env.BASE_URL}/api/turno/lista-turnos`, {
          params: {
            condiciones: {
              orden: "DESC",
              tamanoPagina: this.tamanoPagina,
              indicePagina: index,
              campo: "id_empleado",
              valor: String(this.idEmpleado),
              fechaInicio: fechaInicio,
              fechaFin: fechaFin
            }
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.turnos = res.data.listaTurnos;
            this.indexActual = index;
          } else if (res.data.resultado == 101) {
            this.turnos = [];
          }
        });
      this.loading = false;
    },
    filtroActualizado() {
      this.cargarTurnos(0);
    },
    cargarDatos(index) {
      this.loading = true;
      console.log(index);
      this.cargarTurnosActivos();
      this.cargarTurnosActivables();
      this.cargarTurnos(index);
      this.loading = false;
    },
    limpiarCajas() {
      (this.loading = false),
        (this.loaded = false),
        (this.marcarFechaIngreso = null),
        (this.marcarFechaSalida = null),
        (this.marcarHoraIngreso = null),
        (this.marcarHoraSalida = null),
        (this.mostrarModalIngreso = false),
        (this.mostrarModalSalida = false),
        (this.mostrarModalHora = false),
        (this.habilitarBotonIngreso = false),
        (this.habilitarBotonSalida = false),
        (this.habilitarBotonHora = false),
        (this.puestoSeleccionado = {
          id: 0,
          inicio: "",
          fin: "",
          rol: {
            id: 0,
            nombre: "",
            descripcion: ""
          },
          empleado: null,
          estado: 0,
          tipo: 0,
          idTurno: 0
        });
      this.turnoSeleccionado = {
        id: 0,
        inicio: "",
        fin: ""
      };
    },
    obtenerFechasFiltro(inicio) {
      var fechaActual = this.obtenerFechaActual();
      if (inicio) {
        fechaActual.setHours(0, 0, 0, 0);
      } else {
        fechaActual.setHours(23, 0, 59, 0);
      }
    },
    controlarEventoMarcarTurnoSalida(puesto, turno) {
      if (!this.marcarHoraSalida) {
        this.resultadoOperacionMarcar = "Debe ingresar hora";
      } else {
        this.marcarTurnoSalida();
      }
    },
    obtenerFechaFormateadaPuesto(fecha){
      return fecha.replace("T", " ");
    },
    obtenerFechaFormateada(fecha) {
      console.log("Fecha sin formato: ", fecha);
      var fechaFormateada = moment(fecha, "YYYY-MM-DD HH:mm:ss");
      console.log("Fecha despues de formato: ", fechaFormateada);
      console.log("Retorno: ", moment.parseZone(fechaFormateada).format("YYYY-MM-DD HH:mm:ss"));
      return moment.parseZone(fechaFormateada).format("YYYY-MM-DD HH:mm:ss");
     
    },
    marcarTurnoSalida() {
      var fecha = this.obtenerFechaFormateada(this.marcarFechaSalida);
      var idPuesto = this.puestoSeleccionado.id;
      axios
        .get(`${process.env.BASE_URL}/api/turno/marcar-salida-turno`, {
          params: {
            puesto: this.puestoSeleccionado,  
            turno: this.turnoSeleccionado,
            hora: fecha
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 3004) {
            var resultado = res.data.filasAfectadas;
            console.log("resullllll");
            console.log(resultado);
            if (resultado > 0) {
              /*this.ocultarModales();*/
              this.limpiarCajas();
              resultadoOperacionMarcar =
                "Se ha marcado salida satisfactoriamente.";
            } else {
              this.resultadoOperacionMarcar = "No se han realizado cambios.";
            }
            console.log(resultado);
          } else {
            this.resultadoOperacionMarcar = "Ocurrió un error.";
          }
        });
      this.cargarDatos();
    },
    marcarTurnoEntrada() {
      var fecha = this.obtenerFechaFormateada(this.marcarFechaIngreso);
      var idPuesto = this.puestoSeleccionado.id;
      console.log(this.turnoSeleccionado);
      return axios
        .get(`${process.env.BASE_URL}/api/turno/marcar-ingreso-turno`, {
          params: {
            condiciones: {
              idPuesto: idPuesto,
              hora: fecha
            }
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 3004) {
            var resultado = res.data.filasAfectadas;
            console.log("resullllll");
            console.log(resultado);
            if (resultado > 0) {
              this.limpiarCajas();
              this.resultadoOperacionMarcar =
                "Se ha marcado ingreso satisfactoriamente.";
              return true;
            } else {
              this.resultadoOperacionMarcar = "No se han realizado cambios.";
            }
            console.log(resultado);
          } else {
            this.resultadoOperacionMarcar = "Ocurrió un error.";
          }
          return false;
        });
      this.cargarDatos();
    },
    controlarEventoMarcarTurnoEntrada() {
      console.log(this.marcarHoraIngreso);
      if (!this.marcarHoraIngreso) {
        this.resultadoOperacionMarcar = "Debe ingresar hora";
      } else {
        this.marcarTurnoEntrada();
      }
    },
    controlarEventoMarcarTurno() {
      this.loading = true;
      console.log(this.marcarHoraIngreso);
      if (!this.marcarHoraIngreso || !this.marcarHoraSalida) {
        this.resultadoOperacionMarcar =
          "Debe ingresar hora de entrada y salida";
        return true;
      } else {
        this.marcarTurnoEntrada().then(respuestaCorrecta => {
          if (respuestaCorrecta) {
            this.marcarTurnoSalida();
          } else {
            //ERROR EN MARCAR ENTRADA NO SE MARCA SALIDA.
          }
        });
      }
    },
    ocultarModales() {
      this.mostrarModalIngreso = false;
      this.mostrarModalSalida = false;
      this.mostrarModalHora = false;
    },
    habilitarBotones(habilitar) {
      console.log("habilitar");
      console.log(habilitar);
      this.habilitarBotonHora = habilitar;
      this.habilitarBotonIngreso = habilitar;
      this.habilitarBotonSalida = habilitar;
    },
    obtenerFechaActual() {
      var fechaActual = moment(new Date(), "YYYY-MM-DD HH:mm:ss");
      fechaActual
        .tz("America/Argentina/Buenos_Aires")
        .format("YYYY-MM-DD HH:mm:ss");
      console.log(fechaActual);
      return moment.parseZone(fechaActual).format("YYYY-MM-DD HH:mm:ss");
    },
    obtenerHoraActual() {
      var horaActual = moment(new Date(), "HH:mm:ss");
      horaActual.tz("America/Argentina/Buenos_Aires").format("HH:mm:ss");
      console.log(horaActual);
      return moment.parseZone(horaActual).format("HH:mm:ss");
    },
    guardarDatosParaMarcarHora(ingreso, salida, turno, puesto) {
      this.habilitarBotones(false);
      this.turnoSeleccionado = turno;
      this.puestoSeleccionado = puesto;
      if (ingreso) {
        this.marcarFechaIngreso = this.obtenerFechaFormateadaPuesto(puesto.inicio);
      }
      if (salida) {
        this.marcarFechaSalida = this.obtenerFechaFormateadaPuesto(puesto.fin);
      }
      return true;
    },
    cargarSiguiente() {
      this.cargarDatos(this.indexActual + 1);
    },
    cargarAnterior() {
      this.cargarDatos(this.indexActual - 1);
    }
  }
};
</script>
