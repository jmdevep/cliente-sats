<template>
    <div>
        <h1 class="mainTitle">
        Localidades
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modificar Localidad</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarLocalidad()">
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p class="text-danger" v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>

                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre </label>
                        <input type="text" maxlength="45" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="localidad.nombre" id="nombre" placeholder="Nombre">
                        <small id="nombreDisponibilidad" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>   
                    </div>  
                    <input type="submit" :disabled="disabled" value="Modificar" class="btn marginBefore btn-success">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EditarLocalidad",
  mounted() {
    if (this.$route.params.localidad != null) {
      this.localidad = this.$route.params.localidad;
    } else {
      this.$router.push("/tramo/principal-tramo");
    }
    this.nombreAnterior = this.localidad.nombre;
  },
  data() {
    return {
      loading: false,
      resultadoOperacion: null,
      erroresForm: [],
      nombreAnterior: "",
      localidad: {
        nombre: ""
      },
      alerta: false,
      informacion: false,
      errorDisponibilidad: "",
      disabled: false
    };
  },
  methods: {
    modificarLocalidad() {
      this.loading = true;
      this.disabled = true;
      if (this.checkForm()) {
        var params = this.localidad;
        console.log(params);
        axios
          .post(
            `${process.env.BASE_URL}/api/localidad/modificar-localidad`,
            params
          )
          .then(res => {
            console.log(res);
            if (res.data.resultado == 5604) {
              this.resultadoOperacion =
                "Localidad modificada satisfactoriamente.";
              this.informacion = true;
              this.$router.push({
                name: "PrincipalTramo",
                params: {
                  resultadoOperacion: "Localidad modificada satisfactoriamente."
                }
              });
            } else if (res.data.resultado == 5605) {
              this.resultadoOperacion = "Error en la modificación.";
              this.alerta = true;
            }
            this.loading = false;
            this.disabled = false;
          })
          .catch(error => {
            this.alerta = true;
            this.resultadoOperacion =
              "Ha surgido un error en el sistema. Inténtelo nuevamente.";
            console.log(error);
            this.loading = false;
            this.disabled = false;
          });
      }
    },
    verificarDisponibilidad() {
      this.errorDisponibilidad = "Verificando...";
      this.disabled = true;
      if (
        this.localidad.nombre != "" &&
        this.localidad.nombre != this.nombreAnterior
      ) {
        axios
          .get(`${process.env.BASE_URL}/api/localidad/existe-localidad`, {
            params: {
              nombre: this.localidad.nombre
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.existe == true || res.data.resultado == "5600") {
              this.disabled = true;
              this.errorDisponibilidad = "Localidad ya registrada.";
            } else {
              this.errorDisponibilidad = "";
              this.disabled = false;
            }
          })
          .catch(error => {
            this.errorDisponibilidad =
              "Ha surgido un error durante la verificación. Inténtelo nuevamente.";
            console.log(error);
            this.loading = false;
            this.disabled = true;
          });
      } else if (
        this.localidad &&
        this.nombreAnterior != this.localidad.nombre
      ) {
        this.errorDisponibilidad = "No hay cambios.";
        this.disabled = false;
      }
    },
    limpiarCajas() {
      this.localidad.nombre = "";
    },
    limpiarResultado() {
      this.alerta = false;
      this.informacion = false;
      this.resultadoOperacion = "";
    },
    checkForm() {
      if (this.localidad.nombre) {
        return true;
      }

      this.erroresForm = [];

      if (!this.localidad.nombre) {
        this.erroresForm.push("Nombre requerido.");
      }
      return false;
    }
  }
};
</script>
