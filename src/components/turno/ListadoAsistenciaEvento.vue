<template>
    <div>
        {{ resultadoOperacion }}
        {{ loaded }}
        <br>
        Fecha Salida {{ marcarFechaSalida }}
        <br>
        Fecha Entrada {{ marcarFechaIngreso }}
        <br>

        Eventos Activos {{ JSON.stringify(eventosActivos) }}
        <br>
        Eventos totales {{ JSON.stringify(eventos) }}
        <br>

        <template v-if="eventosActivos.length > 0">
            <div class="row">
                <div class="col-sm-12">
                        <table class="table">
                            <caption class="captionCustom"><h3>Eventos asignados</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                            <thead class="greenBackground">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Inicio evento</th>
                                    <th scope="col">Fin evento</th>
                                    <th scope="col">Rol</th>
                                    <th scope="col">Servicio</th>
                                    <th scope="col">Persona</th>                                
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="tableBodyBackground">
                                <tr v-for="(eventoAsignado, index) in eventosActivos" :key="index">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ eventoAsignado.evento.inicioEvento }}</td>
                                    <td>{{ eventoAsignado.evento.finEvento }}</td>
                                    <td>{{ eventoAsignado.puesto.rol.nombre }}</td>
                                    <td>{{ eventoAsignado.evento.servicio.nombre }}</td>
                                    <td>{{ eventoAsignado.evento.persona.nombre }}</td>
                                    <td>
                                        <template v-if="eventoAsignado.puesto.estado == 1">
                                            {{ eventoAsignado.puesto.estado }}
                                            <b-btn class="btn btn-success" v-b-modal.marcarSalidaModal @click="guardarDatosParaMarcarHora(eventoAsignado)"><i class="fas fa-door-closed"></i> Marcar salida</b-btn>
                                        </template>
                                        <template v-else-if="eventoAsignado.puesto.estado == 0">
                                            <b-btn class="btn btn-success" v-b-modal.marcarEntradaModal @click="guardarDatosParaMarcarHora(eventoAsignado)"><i class="fas fa-door-open"></i> Marcar entrada</b-btn>
                                        </template> 
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                            <b-modal id="marcarEntradaModal" v-model="mostrarModalIngreso" ref="marcarEntradaModal" title="Marcar entrada al turno">
                                        <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                                        <p class="my-4">Turno seleccionado: {{ eventoAsignadoSeleccionado.puesto.inicio }} a {{ eventoAsignadoSeleccionado.puesto.fin }}</p>
                                        <div class="form-group">
                                            <label for="horaI" class="darkTextCustom">Hora de ingreso a marcar</label>
                                            <datetime type="datetime" value-zone="America/Montevideo" zone="America/Montevideo" format="yyyy-MM-dd HH:mm:ss" :phrases="{ok: 'Continuar', cancel: 'Cancelar'}"  class="form-control border-success" v-model="marcarFechaIngreso"></datetime>
                                        </div>
                                        <div slot="modal-footer" class="w-100">
                                            <p class="float-left"></p>
                                            <b-btn size="sm" id="btnMarcarIngreso" :disabled="habilitarBotonIngreso" class="float-right" variant="primary" @click="controlarEventoMarcarEventoEntrada(); mostrar=false">
                                                Marcar ingreso
                                            </b-btn>
                                        </div>
                                    </b-modal>
                                    <b-modal id="marcarSalidaModal" v-model="mostrarModalSalida" ref="marcarSalidaModal" title="Marcar salida del turno">
                                        <form @submit.stop.prevent="handleSubmit">
                                            <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                                            <p class="my-4">Turno seleccionado: {{ eventoAsignadoSeleccionado.puesto.inicio }} a {{ eventoAsignadoSeleccionado.puesto.fin }}</p>
                                            <div class="form-group">
                                                    <label for="horaS" class="darkTextCustom">Hora de salida a marcar</label>
                                                    <datetime type="datetime" value-zone="America/Montevideo" zone="America/Montevideo" format="yyyy-MM-dd HH:mm:ss" :phrases="{ok: 'Continuar', cancel: 'Cancelar'}"  class="form-control border-success" v-model="marcarFechaSalida"></datetime>
                                                    <p> {{ resultadoOperacionMarcar }} </p>
                                            </div>
                                        </form>
                                        <div slot="modal-footer" class="w-100">
                                            <p class="float-left"></p>
                                            <b-btn size="sm" id="btnMarcarSalida" :disabled="habilitarBotonSalida" class="float-right" variant="primary" @click="controlarEventoMarcarEventoSalida(); mostrar=false">
                                                Marcar salida
                                            </b-btn>
                                        </div>
                                    </b-modal>
                                </div>
                            </div>
                        </template>

        <template v-if="eventos.length">
            <div class="row">
                <div class="col-sm-12">
                        <table class="table">
                            <caption class="captionCustom"><h3>Eventos asignados</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                            <thead class="greenBackground">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Inicio evento</th>
                                    <th scope="col">Fin evento</th>
                                    <th scope="col">Rol</th>
                                    <th scope="col">Servicio</th>
                                    <th scope="col">Persona</th>                                
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="tableBodyBackground">
                                <tr v-for="(eventoAsignado, index) in eventos" :key="index">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ eventoAsignado.evento.inicioEvento }}</td>
                                    <td>{{ eventoAsignado.evento.finEvento }}</td>
                                    <td>{{ eventoAsignado.puesto.rol.nombre }}</td>
                                    <td>{{ eventoAsignado.evento.servicio.nombre }}</td>
                                    <td>{{ eventoAsignado.evento.persona.nombre }}</td>
                                    <td>
                                        <b-btn class="btn btn-success" @click="guardarDatosParaMarcarHora(eventoAsignado); mostrarModal = true;"><i class="fas fa-user-clock"></i></b-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <b-modal id="marcarHoraModal" ref="marcarHoraModal" v-model="mostrarModal" title="Marcar turno">
                        <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                        <p class="my-4">Turno seleccionado: {{ eventoAsignadoSeleccionado.puesto.inicio }} a {{ eventoAsignadoSeleccionado.puesto.fin }}</p>
                        <div class="form-group">
                            <label for="horaI" class="darkTextCustom">Hora de ingreso a marcar</label>
                    <datetime type="datetime" value-zone="America/Montevideo" zone="America/Montevideo" format="yyyy-MM-dd HH:mm:ss" :phrases="{ok: 'Continuar', cancel: 'Cancelar'}"  class="form-control border-success" v-model="marcarFechaIngreso"></datetime>
                        </div>
                        <div class="form-group">
                                <label for="horaS" class="darkTextCustom">Hora de salida a marcar</label>
                    <datetime type="datetime" value-zone="America/Montevideo" zone="America/Montevideo" format="yyyy-MM-dd HH:mm:ss" :phrases="{ok: 'Continuar', cancel: 'Cancelar'}"  class="form-control border-success" v-model="marcarFechaSalida"></datetime>
                                <p> {{ resultadoOperacionMarcar }}</p>
                        </div>
                        <div slot="modal-footer" class="w-100">
                            <p class="float-left"></p>
                            <b-btn size="sm" id="btnMarcarHora" :disabled="habilitarBotonHora" class="float-right" variant="primary" @click="controlarEventoMarcarEventoEntrada(); mostrar=false">
                                Marcar hora
                            </b-btn>
                        </div>
                    </b-modal>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ListadoAsistenciaEvento",
  mounted() {
    console.log("Listado Asistencia Evento");
    this.resultadoOperacion = this.$route.params.resultadoOperacion;
    this.puesto = this.$route.params.puesto;
    this.turno = this.$route.params.turno;
    this.loading = true;
    this.empleado = this.$session.get("usuario").empleado;
    console.log(this.empleado);
    this.cargarDatos(0);
  },
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null || usuario.tipo.id != 1) {
      this.$router.push("/usuario/login");
    }
  },
  data() {
    return {
      resultadoOperacion: "",
      loading: false,
      loaded: false,
      empleado: null,
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
      resultadoOperacionMarcar: "",
      turno: null,
      puesto: null,
      mostrarModal: false,
      eventoAsignadoSeleccionado: {
        puesto: {
          inicio: "",
          fin: ""
        }
      },
      eventosActivos: [],
      eventos: [],
    };
  },
  methods: {
    cargarDatos(index) {
      console.log("INICIO TURNO SIN FORMATO", this.turno.inicio);
      var fechaInicio = this.obtenerFechaFormateadaPuesto(this.turno.inicio);
      console.log("INICIO TURNO CON FORMATO", fechaInicio);
      var fechaFin = this.obtenerFechaFormateadaPuesto(this.turno.fin);
      this.loading = true;
      console.log(index);
      axios
        .get(`${process.env.BASE_URL}/api/turno/lista-asistencia-evento`, {
          params: {
            condiciones: {
              orden: "DESC",
              tamanoPagina: this.tamanoPagina,
              indicePagina: this.indicePagina,
              campo: "id_empleado",
              valor: String(this.empleado.id),
              fechaInicio: fechaInicio,
              fechaFin: fechaFin,
              asistenciaEventoSeleccionada: null
            }
          }
        })
        .then(res => {
          console.log("SI ANDA ESTO");
          console.log(res);
          console.log(res.data.resultado);
          if (res.data.resultado == 100) {
            this.eventos = res.data.listaAsistenciasEvento;
            this.eventosActivos = res.data.listaAsistenciasEvento;
            console.log(this.turnos);
            console.log(res.data.listaAsistenciasEvento);
            this.indexActual = index;
          }
        });
      this.loading = false;
    },
    marcarEventoEntrada(){

    },
    marcarEventoSalida(){

    },
    controlarEventoMarcarEvento() {
      this.loading = true;
      if (!this.marcarFechaIngreso || !this.marcarFechaSalida) {
        this.resultadoOperacionMarcar = "Debe ingresar hora de entrada y salida";
        return true;
      } else {
        this.marcarEventoEntrada().then(respuestaCorrecta => {
          if (respuestaCorrecta) {
            this.marcarEventoSalida();
          } else {
              
          }
        });
      }
    },
    obtenerFechasFiltro(inicio) {
      var fechaActual = obtenerFechaActual();
      if (inicio) {
        fechaActual.setHours(0, 0, 0, 0);
      } else {
        fechaActual.setHours(23, 0, 59, 0);
      }
    },
    controlarEventoMarcarEventoSalida() {
      if (!this.marcarHoraSalida) {
        this.resultadoOperacionMarcar = "Debe ingresar hora";
      } else {
        this.marcarEvento(false);
      }
    },
    controlarEventoMarcarEventoEntrada() {
      console.log(this.marcarHoraIngreso);
      if (!this.marcarHoraIngreso) {
        this.resultadoOperacionMarcar = "Debe ingresar hora";
        return true;
      } else {
        //this.marcarEvento(true);
      }
    },
    obtenerFechaFormateadaPuesto(fecha) {
      fecha.replace("T", " ");
      var fechaFormateada = moment(fecha, "DD/MM/YYYY hh:mm:ss a");
      fechaFormateada = moment(fechaFormateada).format("YYYY-MM-DD HH:mm:ss");
      return fechaFormateada;
    },
    obtenerFechaFormateada(fecha) {
      console.log("Fecha sin formato: ", fecha);
      var fechaFormateada = moment(fecha, "YYYY-MM-DD HH:mm:ss");
      console.log("Fecha despues de formato: ", fechaFormateada);
      console.log(
        "Retorno: ",
        moment.parseZone(fechaFormateada).format("YYYY-MM-DD HH:mm:ss")
      );
      return moment.parseZone(fechaFormateada).format("YYYY-MM-DD HH:mm:ss");
    },
    marcarEvento(ingreso) {
      console.log(ingreso);
      this.loading = true;
      var fecha;
      if (ingreso) {
        console.log(this.marcarFechaIngreso);
        var fechaSola = this.marcarFechaIngreso.split(" ");
        fechaSola[0] = moment
          .parseZone(fechaSola[0], "DD/MM/YYYY")
          .format("YYYY-MM-DD");
        console.log(fechaSola[0]);
        fecha = moment
          .parseZone(
            `${fechaSola[0]} ${this.marcarHoraIngreso}`,
            "YYYY-MM-DD HH:mm:ss"
          )
          .format();
        console.log(fecha);
      } else {
        console.log(this.marcarFechaSalida);
        var fechaSola = this.marcarFechaSalida.split(" ");
        fechaSola[0] = moment
          .parseZone(fechaSola[0], "DD/MM/YYYY")
          .format("YYYY-MM-DD");
        console.log(fechaSola[0]);
        fecha = moment
          .parseZone(
            `${fechaSola[0]} ${this.marcarHoraSalida}`,
            "YYYY-MM-DD HH:mm:ss"
          )
          .format();
      }
      console.log(fecha);
      axios
        .get(`${process.env.BASE_URL}/api/turno/marcar-activacion`, {
          params: {
            condiciones: {
              idPuesto: this.idPuesto,
              idEvento: this.idEvento,
              esInicio: ingreso,
              hora: fecha
            }
          }
        })
        .then(res => {
          console.log(res);

          if (res.data.resultado == 100) {
            var resultado = res.data.filasAfectadas;
            if (resultado > 0) {
              this.$refs.marcarIngresoModal.hide();
              this.$refs.marcarSalidaModal.hide();
            } else {
              this.resultadoOperacionMarcar = "Ha ocurrido un error.";
            }
            console.log(resultado);
          }
        });
      this.loading = false;
    },
    obtenerFechaActual() {
      var fechaActual = moment(new Date(), "YYYY-MM-DD HH:mm:ss");
      fechaActual
        .tz("America/Argentina/Buenos_Aires")
        .format("YYYY-MM-DD HH:mm:ss");
      //fehcaActual = moment(fechaActual, 'YYYY-MM-DD HH:mm:ss')
      console.log(fechaActual);
      return moment.parseZone(fechaActual).format("YYYY-MM-DD HH:mm:ss");
    },
    obtenerHoraActual() {
      var horaActual = moment(new Date(), "HH:mm:ss");
      horaActual.tz("America/Argentina/Buenos_Aires").format("HH:mm:ss");
      console.log(horaActual);
      return moment.parseZone(horaActual).format("HH:mm:ss");
    },
    guardarDatosParaMarcarHora(eventoAsignado) {
      this.eventoAsignadoSeleccionado = eventoAsignado;
      this.marcarFechaIngreso = eventoAsignado.puesto.inicio;
      this.marcarFechaSalida = eventoAsignado.puesto.fin;
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
