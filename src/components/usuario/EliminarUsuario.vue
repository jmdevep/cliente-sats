<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Seguro desea eliminar este usuario?</div>
            <i v-show="loading" class="fa fa-spinner fa-spin"></i>
            <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
            <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
            
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="eliminarUsuario()">
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario</label>
                        <input type="text"  class="form-control border-success" v-model="usuario.nombre" id="nombre" disabled="true" placeholder="Nombre de Usuario">
                    </div>
                    <input type="submit" value="Eliminar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EliminarUsuario",
  mounted() {
    if (this.$route.params.usuario != null) {
      this.usuario = this.$route.params.usuario;
    } else {
      this.$router.push("/empleado/principal-empleado");
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
      resultadoOperacion: "",
      erroresForm: [],
      disabled: true,
      usuario: {
        id: 0,
        nombre: "",
        contrasena: "",
        tipo: {
          id: 0
        },
        idEmpleado: 0
      },
      loading: false,
      alerta: false,
      informacion: false
    };
  },
  methods: {
    eliminarUsuario() {
      axios
        .delete(`${process.env.BASE_URL}/api/usuario/eliminar-usuario`, {
          data: { id: this.usuario.id }
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 1100) {
            this.$router.push({
              name: "PrincipalEmpleado",
              params: {
                resultadoOperacion: "Usuario eliminado satisfactoriamente."
              }
            });
          } else if (res.data.resultado == 1101) {
            this.resultadoOperacion = "El usuario seleccionado no existe.";
            this.alerta = true;
          }
        });
    },
    limpiarResultado() {
      this.resultadoOperacion = "";
      this.alerta = false;
      this.informacion = false;
    }
  }
};
</script>
