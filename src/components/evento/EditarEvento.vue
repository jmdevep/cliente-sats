<template>
    <div>
        <div class="mb-3 card">
            <div class="card-body darkTextCustom">
                <form>
                    <template v-if="!tieneEmpleados">
                        <button @click="disabled = !disabled" class="btn marginBefore tableHeadingBackground">
                            {{ disabled ? "Editar" : "Cancelar"}}
                        </button>
                    </template>
                    <p class="text-danger" v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>   
                    
                    <multi-select :disabled="disabled" v-model="personaSeleccionada" placeholder="Personas"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="personas" :option-height="104" :custom-label="customLabelPersonas" :show-labels="false">
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.documento }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <br> 
                    
                    <multi-select  :disabled="disabled" v-model="servicioSeleccionado" placeholder="Servicios" :optionsLimit="3" :tabindex="2" track-by="nombre" :options="servicios" :option-height="104" :custom-label="customLabelServicios" :show-labels="false">  
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }}</span>
                                <br>
                                <span class="option__small">{{ props.option.descripcion }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <br>

                    <multi-select :disabled="disabled" v-model="tipoEventoSeleccionado" placeholder="Tipo Evento"  :optionsLimit="3" :tabindex="3" track-by="nombre" :options="tiposEventos" :option-height="104" :custom-label="customLabelTiposEventos" :show-labels="false">
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
                        <input type="date" :disabled="disabled" class="form-control border-success" v-model="fechaInicio" id="fecha" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaI" class="darkTextCustom">Hora Inicio</label>
                        <input type="time" :disabled="disabled" class="form-control border-success" id="horaI" v-model="horaInicio"/>
                    </div>
                    <div class="form-group">
                        <label for="fechaF" class="darkTextCustom">Fecha Finalización</label>
                        <input type="date" :disabled="disabled" class="form-control border-success" v-model="fechaFin" id="fechaF" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="horaF" class="darkTextCustom">Hora Finalización (Opcional) </label>
                        <input type="time" :disabled="disabled" class="form-control border-success" id="horaF" v-model="horaFin"/>
                    </div>
                    <div class="form-group">
                        <label for="direccion" class="darkTextCustom">Dirección</label>
                        <input type="text" maxlength="150" :disabled="disabled" class="form-control border-success" v-model="evento.direccion" id="direccion" placeholder="direccion">
                    </div>

                    <template v-if="!disabled">
                        <input type="submit" @click="modificarEvento()" value="Modificar" class="btn marginBefore tableHeadingBackground">
                    </template>

                </form>
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

    this.evento = this.$parent.evento;
    this.personaSeleccionada = this.evento.persona;
    this.servicioSeleccionado = this.evento.servicio;
    this.tipoEventoSeleccionado = this.evento.tipo;

    this.horaInicio = this.obtenerHora(this.evento.inicioEvento);
    this.horaFin = this.obtenerHora(this.evento.finEvento);

    this.fechaInicio = this.obtenerFecha(this.evento.inicioEvento);
    this.fechaFin = this.obtenerFecha(this.evento.finEvento);
  },
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
      this.$router.push("/usuario/login");
    }
  },
  data() {
    return {
      personaSeleccionada: null,
      servicioSeleccionado: null,
      tipoEventoSeleccionado: null,
      loading: false,
      resultadoOperacion: "",
      erroresForm: [],
      disabled: true,
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
      personas: [],
      servicios: [],
      tiposEventos: [],
      horaInicio: null,
      horaFin: null,
      fechaInicio: null,
      fechaFin: null,
      alerta: false,
      informacion: false,
    };
  },
  methods: {
    obtenerFecha(fecha) {
      var arraySplit = fecha.split("T");
      return arraySplit[0];
    },
    obtenerHora(fecha) {
      var arraySplit = fecha.split("T");
      return arraySplit[1];
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
    limpiarResultado(){
      this.resultadoOperacion = '';
      this.alerta = false;
      this.informacion = false;
    },
    modificarEvento() {
      this.limpiarResultado();
      this.evento.inicioEvento = moment(
        `${this.fechaInicio} ${this.horaInicio}`,
        "YYYY-MM-DD HH:mm:ss"
      ).format();
      this.evento.finEvento = moment(
        `${this.fechaFin} ${this.horaFin}`,
        "YYYY-MM-DD HH:mm:ss"
      ).format();
      this.loading = true;

      //delete this.personaSeleccionada.fechaNacimiento;

      if (this.checkForm()) {
        this.evento.persona = this.personaSeleccionada;
        this.evento.tipo = this.tipoEventoSeleccionado;
        this.evento.servicio = this.servicioSeleccionado;

        var params = this.evento;
        console.log(params);

        axios
          .post(`${process.env.BASE_URL}/api/evento/modificar-evento`, params)
          .then(res => {
            console.log(res.data.resultado);
            if (res.data.resultado == 5804) {
              this.informacion = true;
              this.resultadoOperacion = "Evento modificado";
            } else if (res.data.resultado == 5805) {
              this.alerta = true;
              this.resultadoOperacion = "Error en modificación.";
            }else{
              this.alerta = true;
              this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
            }
            this.loading = false;
          })
          .catch((error)=>{
            this.alerta = true;
            this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
            console.log(error);
            this.loading = false;
        });
      }
    },
    limpiarCajas() {
      errorDisponibilidad: "";
    },
    checkForm() {
      if (
        this.fechaInicio &&
        this.fechaFin &&
        this.horaInicio &&
        this.horaFin &&
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
        this.erroresForm.push("Hora Inicio requerida.");
      }
      if (this.direccion == "") {
        this.erroresForm.push("Dirección requerida.");
      }
      if (!this.personaSeleccionada) {
        this.erroresForm.push("Paciente requerido.");
      }
      if (!this.servicioSeleccionado) {
        this.erroresForm.push("Servicio requerido.");
      }
      if (!this.tipoEventoSeleccionado) {
        this.erroresForm.push("Tipo de Evento requerido.");
      }

      this.disabled = false;
      return false;
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>