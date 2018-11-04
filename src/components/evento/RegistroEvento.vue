<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Eventos</div>
            <div class="card-body darkTextCustom">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>   

                    <multi-select v-model="llamadoSeleccionado" placeholder="Llamados"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="llamados" :option-height="104" :custom-label="customLabelLlamados" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.motivoLlamado }}</span>
                                <br>
                                <span class="option__small">{{ props.option.fechaRecibido }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <br/> 


                    <multi-select v-model="personaSeleccionada" placeholder="Personas"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="personas" :option-height="104" :custom-label="customLabelPersonas" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.documento }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <br/> 

                    <b-button @click="modalShow = !modalShow">
                    Agregar Persona
                    </b-button>
                    <b-modal v-model="modalShow">
                                   <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre Completo</label>
                        <input type="text" class="form-control border-success" v-model="persona.nombre" id="nombre" placeholder="Nombre">
                        </div>
                        <div class="form-group">
                            <label for="direccion" class="darkTextCustom">Dirección</label>
                            <input type="text" class="form-control border-success" v-model="persona.direccion" id="direccion" placeholder="Dirección">
                        </div>
                        <div class="form-group">
                            <label for="telefono" class="darkTextCustom">Teléfono</label>
                            <input type="text" class="form-control border-success" v-model="persona.telefono" id="telefono" placeholder="Teléfono">
                        </div>
                        <div class="form-group">
                            <label for="documento" class="darkTextCustom">Documento</label>
                            <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="persona.documento" id="documento" placeholder="Documento">
                            <small id="emailHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                        </div>
                        <div class="form-group">
                            <label for="fechaNacimiento" class="darkTextCustom">Fecha de Nacimiento</label>
                            <input type="date" class="form-control border-success" v-model="persona.fechaNacimiento" id="fechaNacimiento" placeholder="2019-12-05">
                        </div>
                        <div class="form-group">
                            <label for="sexos">Seleccione el género</label>
                            <select id="sexos" class="form-control" v-model="persona.sexo">
                                <option value="" selected> 
                                    Sin seleccionar
                                </option>
                                <option value="M" selected> 
                                    Masculino
                                </option>
                                <option value="F" selected> 
                                    Femenino
                                </option>
                            </select>
                        </div>
                        <p>Prestador de Salud: </p>
                        <multi-select v-model="persona.prestador" placeholder="Prestador de Salud"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="prestadores" :option-height="104" :custom-label="customLabelPrestadores" :show-labels="false">    
                            <template slot="option" slot-scope="props">
                                <div class="option__desc">
                                    <span class="option__title">Nombre: {{ props.option.nombreDescriptivo }}</span>
                                </div>
                            </template>
                        </multi-select>
                    </b-modal>

                    <br/>
                    
                    <multi-select v-model="servicioSeleccionado" placeholder="Servicios" :optionsLimit="3" :tabindex="2" track-by="nombre" :options="servicios" :option-height="104" :custom-label="customLabelServicios" :show-labels="false">
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.descripcion }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <br>

                    <multi-select v-model="tipoEventoSeleccionado" placeholder="Tipo Evento"  :optionsLimit="3" :tabindex="3" track-by="nombre" :options="tiposEventos" :option-height="104" :custom-label="customLabelTiposEventos" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.descripcion }}</span>
                            </div>
                        </template>
                    </multi-select>
                
                    <div class="form-group">
                        <label for="fecha" class="darkTextCustom">Fecha</label>
                        <input type="date" class="form-control border-success" v-model="fechaInicio" id="fecha" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaI" class="darkTextCustom">Hora Inicio</label>
                        <input type="time"  class="form-control border-success" id="horaI" v-model="horaInicio"/>
                    </div>
                                        <div class="form-group">
                        <label for="direccion" class="darkTextCustom">Dirección</label>
                        <input type="text" maxlength="150" class="form-control border-success" v-model="evento.direccion" id="direccion" placeholder="direccion">
                    </div>

                    <div class="form-group">
                        <label for="fechaF" class="darkTextCustom">Fecha Finalización (Opcional)</label>
                        <input type="date" class="form-control border-success" v-model="fechaFin" id="fechaF" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaF" class="darkTextCustom">Hora Finalización (Opcional) </label>
                        <input type="time"  class="form-control border-success" id="horaF" v-model="horaFin"/>
                    </div>

                    <button v-on:click.prevent="registrarEvento()" :disabled="disabled" class="btn marginBefore tableHeadingBackground"> Registrar </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  name: "RegistroEvento",
  components: {
    "multi-select": Multiselect
  },
  mounted() {
    this.loading = true;
    this.cargarPersonas();
    this.cargarServicios();
    this.cargarTiposEventos();
    this.cargarLlamados();
    this.cargarPrestadores();
  },
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
      this.$router.push("/usuario/login");
    }
  },
  data() {
    return {
      modalShow: false,
      agregarPersona: null,
      personaSeleccionada: null,
      servicioSeleccionado: null,
      tipoEventoSeleccionado: null,
      llamadoSeleccionado: null,
      loading: false,
      resultadoOperacion: "",
      erroresForm: [],
      disabled: false,
      localidades: [],
      errorDisponibilidad: "",
      evento: {
        inicioEvento: "",
        direccion: "",
        persona: null,
        servicio: null,
        tipo: null,
        direccion: "",
        finEvento: ""
      },
      isDisabled: false,
      personas: [],
      servicios: [],
      tiposEventos: [],
      llamados: [],
      prestadores: [],
      horaInicio: null,
      horaFin: null,
      fechaInicio: null,
      fechaFin: null,
      persona: {
        nombre: "",
        direccion: "",
        telefono: "",
        documento: "",
        fechaNacimiento: "",
        sexo: "",
        prestador: null
      },
      personaDisabled: false,
      alerta: false,
      informacion: false
    };
  },
  methods: {
    togglePersona() {
      this.agregarPersona = !this.agregarPersona;
    },
    customLabelPersonas({ nombre, documento }) {
      return `${nombre} – ${documento}`;
    },
    customLabelServicios({ nombre, descripcion }) {
      return `${nombre} – ${descripcion}`;
    },
    customLabelTiposEventos({ nombre }) {
      return `${nombre}`;
    },
    customLabelLlamados({ motivoLlamado, fechaRecibido }) {
      return `${motivoLlamado} ` + `` + `${fechaRecibido}`;
    },
    cargarPrestadores() {
      axios
        .get(`${process.env.BASE_URL}/api/cliente/lista-prestadores`)
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.prestadores = res.data.prestadores;
          }
          this.loading = false;
        });
    },
    customLabelPrestadores({ nombreDescriptivo }) {
      return `${nombreDescriptivo} `;
    },
    cargarPersonas() {
      axios
        .get(`${process.env.BASE_URL}/api/cliente/lista-personas`, {
          params: {}
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.personas = res.data.listaPersonas;
          }
          this.loading = false;
        });
    },
    cargarServicios() {
      axios
        .get(`${process.env.BASE_URL}/api/servicio/lista-servicios`, {
          params: {}
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.servicios = res.data.listaServicios;
          }
          this.loading = false;
        });
    },
    cargarLlamados() {
      axios
        .get(`${process.env.BASE_URL}/api/llamado/lista-llamados`, {
          params: {}
        })
        .then(res => {
          console.log("Llamados");
          console.log(res);
          if (res.data.resultado == 100) {
            this.llamados = res.data.listaLlamados;
          }
          this.loading = false;
        });
    },
    cargarTiposEventos() {
      axios
        .get(`${process.env.BASE_URL}/api/evento/lista-tipos-eventos`, {
          params: {}
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.tiposEventos = res.data.listaTiposEventos;
          }
          this.loading = false;
        });
    },
    registrarEvento() {
      this.evento.inicioEvento = moment(
        `${this.fechaInicio} ${this.horaInicio}`,
        "YYYY-MM-DD HH:mm:ss"
      ).format();
      this.evento.finEvento = moment(
        `${this.fechaFin} ${this.horaFin}`,
        "YYYY-MM-DD HH:mm:ss"
      ).format();
      this.loading = true;

      if(this.personaSeleccionada.fechaNacimiento != null){
        delete this.personaSeleccionada.fechaNacimiento;
      }

      if (this.checkForm()) {
        this.evento.persona = this.personaSeleccionada;
        this.evento.tipo = this.tipoEventoSeleccionado;
        this.evento.servicio = this.servicioSeleccionado;

        var params = this.evento;
        console.log(params);

        axios
          .post(`${process.env.BASE_URL}/api/evento/agregar-evento`, params)
          .then(res => {
            console.log(res.data.resultado);
            if (res.data.resultado == 5802) {
              this.resultadoOperacion = "Evento agregado satisfactoriamente.";
              this.limpiarCajas();
            } else if (res.data.resultado == 5803) {
              this.resultadoOperacion = "Error en el alta.";
            } else {
              this.alerta = true;
              this.resultadoOperacion =
                "Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.";
            }
            this.loading = false;
          })
          .catch(error => {
            this.alerta = true;
            this.resultadoOperacion =
              "Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.";
            console.log(error);
            this.loading = false;
          });
        this.loading = false;
      }
    },
    limpiarResultado() {
      this.alerta = false;
      this.informacion = false;
      this.resultadoOperacion = "";
    },
    limpiarCajas() {
      this.personaSeleccionada = null;
      this.servicioSeleccionado = null;
      this.tipoEventoSeleccionado = null;
      this.erroresForm = [];
      this.errorDisponibilidad = "";
      (this.evento = {
        inicioEvento: "",
        direccion: "",
        persona: null,
        servicio: null,
        tipo: null,
        direccion: "",
        finEvento: ""
      }),
        (this.horaInicio = null);
      this.horaFin = null;
      this.fechaInicio = null;
      this.fechaFin = null;
    },
    validarDocumento(documento) {
      var verificador = documento[documento.length - 1];
      var aux = 0;
      var i = 0;
      if (documento.length <= 6) {
        for (i = documento.length; i < 7; i++) {
          documento = "0" + documento;
        }
      }
      for (i = 0; i < 7; i++) {
        aux += (parseInt("2987634"[i]) * parseInt(documento[i])) % 10;
      }
      if (aux % 10 === 0) {
        return 0 == verificador;
      } else {
        return 10 - (aux % 10) == verificador;
      }
    },
    verificarDisponibilidad() {
      if (this.persona.documento != "") {
        axios
          .get(`${process.env.BASE_URL}/api/cliente/existe-persona`, {
            params: {
              rut: this.persona.documento
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.existe == true) {
              this.personaDisabled = true;
              this.errorDisponibilidad =
                "Ya existe una persona registrada con ese documento.";
            } else {
              this.errorDisponibilidad = "Documento disponible.";
              this.personaDisabled = false;
            }
          });
      }
    },
    checkForm() {
      if (
        this.fechaInicio &&
        this.horaInicio &&
        this.direccion != "" &&
        this.personaSeleccionada != null &&
        this.servicioSeleccionado != null &&
        this.tipoEventoSeleccionado != null
      ) {
        return true;
      }

      this.erroresForm = [];

      if (!this.fechaInicio) {
        this.erroresForm.push("Fecha inicio requerida.");
      }
      if (!this.horaInicio) {
        this.erroresForm.push("Hora Inicio requerida");
      }
      if (this.direccion == "") {
        this.erroresForm.push("Direccion requerida");
      }
      if (!this.personaSeleccionada) {
        this.erroresForm.push("Paciente requerido");
      }
      if (!this.servicioSeleccionado) {
        this.erroresForm.push("Servicio requerido");
      }
      if (!this.tipoEventoSeleccionado) {
        this.erroresForm.push("Tipo de Evento requerido");
      }

      this.disabled = false;
      return false;
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>