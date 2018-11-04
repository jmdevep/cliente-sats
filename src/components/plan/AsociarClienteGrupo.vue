<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Agregar Socio a Grupo</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="asociarClienteGrupo()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
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
                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  name: "AsociarClienteGrupo",
  components: {
    "multi-select": Multiselect
  },
  mounted() {
    this.cargarPersonas();
    if (this.$route.params.cliente != null) {
      this.persona = this.$route.params.cliente;
    } else {
      this.$router.push("/plan/principal-plan");
    }
  },
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
      this.$router.push("/usuario/login");
    }
  },
  data() {
    return {
      loading: false,
      resultadoOperacion: "",
      erroresForm: [],
      disabled: false,
      personas: [],
      errorDisponibilidad: "",
      persona: null,
      personaSeleccionada: null
    };
  },
  methods: {
    customLabelPersonas({ nombre, documento }) {
      return `${nombre} – ${documento}`;
    },
    asociarClienteGrupo() {
      this.loading = true;
      if (this.checkForm()) {
        this.personaSeleccionada.sociedad = this.persona.sociedad;
        var params = this.personaSeleccionada;
        console.log(params);
        axios
          .post(
            `${process.env.BASE_URL}/api/cliente/asociar-cliente-grupo`,
            params
          )
          .then(res => {
            console.log(res.data.resultado);
            if (res.data.resultado == 5435) {
              this.$router.push({
                name: "PrincipalPlan",
                params: {
                  resultadoOperacion: "Cliente asociado satisfactoriamente."
                }
              });
            } else if (res.data.resultado == 5434) {
              this.$router.push({
                name: "PrincipalPlan",
                params: { resultadoOperacion: "Error al asociar cliente." }
              });
            }
          });
        this.loading = false;
      }
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

            this.personas = this.personas.filter(p => p.sociedad == null);

            this.personas = this.personas.filter(p => p.id != this.persona.id);
          }
          this.loading = false;
        });
    },
    checkForm() {
      return true;
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
