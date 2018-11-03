<template>
    <div>

        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Editar Persona</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarPersona()">
                    <p class="text-danger" v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre Completo</label>
                        <input type="text" maxlength="150" class="form-control border-success" v-model="persona.nombre" id="nombre" placeholder="Nombre">
                    </div>
                    <div class="form-group">
                        <label for="direccion" class="darkTextCustom">Dirección</label>
                        <input type="text" maxlength="150" class="form-control border-success" v-model="persona.direccion" id="direccion" placeholder="Dirección">
                    </div>
                    <div class="form-group">
                        <label for="telefono" class="darkTextCustom">Teléfono</label>
                        <input type="number" maxlength="18" class="form-control border-success" v-model="persona.telefono" id="telefono" placeholder="Teléfono">
                    </div>
                    <div class="form-group">
                        <label for="documento" class="darkTextCustom">Documento</label>
                        <input type="number" maxlength="15" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="persona.documento" id="documento" placeholder="Documento">
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
                    <div class="form-group">
                        <label for="sexos">Prestador de salud</label>
                        <select id="sexos" class="form-control" v-model="persona.prestador">
                            <option  v-for="(descuento,index) in descuentos" :key="index" v-bind:value="descuento.id" :disabled="descuento.disabled">
                                {{ descuento.motivo }} - {{descuento.porcentaje}}% 
                            </option>
                        </select>
                    </div>
                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EditarPersona",
  mounted() {
    if (this.$route.params.persona != null) {
      this.persona = this.$route.params.persona;

    } else {
      this.$router.push("/cliente/principal-cliente");
    }
    this.documentoOriginal = this.$route.params.persona.documento;
    this.loading = true;
    axios
      .get(`${process.env.BASE_URL}/api/cliente/lista-prestadores`, {
        params: {
          condiciones: {
            orden: "DESC",
            tamanoPagina: this.tamanoPagina,
            indicePagina: this.indicePagina,
            campo: "nombre_prestador"
          }
        }
      })
      .then(res => {
        console.log(res);

        if (res.data.resultado == 100) {
          this.prestadores = res.data.prestadores;
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
        console.log(this.prestadores);
      });
    this.loading = false;
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
      persona: {
        nombre: "",
        direccion: "",
        telefono: "",
        documento: "",
        fechaNacimiento: "",
        sexo: "",
        prestador: {
          id: 0,
          nombreDescriptivo: "",
          activo: 0,
          esConvenio: false
        }
      },
      errorDisponibilidad: "",
      documentoOriginal: "",
      informacion: false,
      alerta: false
    };
  },
  methods: {
    verificarDisponibilidad() {
      if (
        this.persona.documento != "" &&
        this.persona.documento != this.persona.documentoOriginal
      ) {
        axios
          .get(`${process.env.BASE_URL}/api/cliente/existe-persona`, {
            params: {
              rut: this.persona.documento
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.existe == true) {
              this.disabled = true;
              this.errorDisponibilidad =
                "Ya existe una persona registrada con ese documento.";
            } else {
              this.errorDisponibilidad = "Documento disponible.";
              this.disabled = false;
            }
          })
          .catch(error => {
            this.alerta = true;
            this.errorDisponibilidad =
              "Ha surgido un error durante la verificación. Inténtelo nuevamente.";
            console.log(error);
            this.loading = false;
            this.disabled = true;
          });
      }
    },
    modificarPersona() {
      this.loading = true;
      this.limpiarResultado();
      if (this.checkForm()) {
        var params = this.persona;
        console.log(params);
        axios
          .post(`${process.env.BASE_URL}/api/cliente/modificar-persona`, params)
          .then(res => {
            console.log(res.data.resultado);
            if (res.data.resultado == 5304) {
              this.$router.push({
                name: "PrincipalCliente",
                params: {
                  resultadoOperacion: "Empresa modificada satisfactoriamente."
                }
              });
              this.limpiarCajas();
            } else {
              this.resultadoOperacion =
                "Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.";
              this.alerta = true;
            }
          })
          .catch(error => {
            this.alerta = true;
            this.resultadoOperacion =
              "Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.";
            console.log(error);
            this.loading = false;
          });
      }
      this.loading = false;
    },
    limpiarResultado() {
      this.resultadoOperacion = "";
      this.alerta = false;
      this.informacion = false;
    },
    limpiarCajas() {
      this.persona = {
        nombre: "",
        direccion: "",
        telefono: "",
        documento: "",
        fechaNacimiento: "",
        sexo: "",
        prestador: {
          id: 0,
          nombreDescriptivo: "",
          activo: 0,
          esConvenio: false
        }
      };
      this.errorDisponibilidad = "";
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
    contieneSoloNumeros(texto) {
      var reg = new RegExp("^\\d+$");
      return reg.test(texto);
    },
    esFechaMenorAActual(fecha) {
      return this.convertirStringAFecha(fecha) <= new Date();
    },
    checkForm() {
      if (
        this.persona.nombre &&
        this.persona.direccion &&
        this.persona.telefono &&
        !isNaN(this.persona.telefono) &&
        this.persona.documento &&
        this.persona.fechaNacimiento &&
        this.esFechaMenorAActual(this.persona.fechaNacimiento) &&
        this.persona.sexo &&
        !isNaN(this.persona.documento) &&
        this.validarDocumento(this.persona.documento)
      ) {
        return true;
      }

      this.erroresForm = [];

      if (!this.persona.nombre) {
        this.erroresForm.push("Razón Social Requerida.");
      }
      if (!this.persona.direccion) {
        this.erroresForm.push("Dirección Requerida.");
      }
      if (!this.persona.telefono) {
        this.erroresForm.push("Teléfono Requerido.");
      }
      if (!this.persona.documento) {
        this.erroresForm.push("Documento Requerido.");
      } else if (isNaN(this.persona.documento)) {
        this.erroresForm.push(
          "El documento debe ser numérico, sin guiones ni puntos."
        );
      } else {
        this.erroresForm.push(
          "El documento no concuerda con el formato de la cédula nacional."
        );
      }
      if (!this.persona.fechaNacimiento) {
        this.erroresForm.push("Fecha de Nacimiento Requerida.");
      }
      if (!this.persona.sexo) {
        this.erroresForm.push("Género requerido.");
      }

      this.disabled = false;
      return false;
    }
  }
};
</script>
