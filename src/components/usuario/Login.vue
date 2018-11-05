<template>
    <div>
        <h1 class="mainTitle">
        Usuario
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Iniciar Sesión</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="login()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre de Usuario</label>
                        <input type="text" class="form-control border-success" v-model="usuario.nombre" id="nombre" placeholder="Nombre de Usuario">
                    </div>
                    <div class="form-group">
                        <label for="contrasena" class="darkTextCustom">Contraseña</label>
                        <input type="password" class="form-control border-success" v-model="usuario.contrasena" id="contrasena" placeholder="Contraseña">
                    </div>
                    <input type="submit" value="Iniciar Sesión" :disabled="disabled" class="btn marginBefore btn-success">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  mounted() {
    var usuario = this.$session.get("usuario");
    if (this.$session.exists() && usuario != null) {
      this.$router.push("/");
    }
  },
  data() {
    return {
      disabled: false,
      loading: false,
      resultadoOperacion: "",
      erroresForm: [],
      usuario: {
        nombre: "",
        contrasena: "",
        tipo: {
          id: 0
        },
        idEmpleado: 0
      },
      errorDisponibilidad: "",
      alerta: false,
      informacion: false
    };
  },
  methods: {
    login() {
      this.limpiarResultado();
      this.loading = true;
      this.disabled = true;
      if (this.usuario.nombre != "") {
        var params = this.usuario;
        console.log(params);
        axios
          .post(`${process.env.BASE_URL}/api/usuario/validar-usuario`, params)
          .then(res => {
            this.loading = false;
            console.log(res);
            if (res.data.resultado == 1110) {
              this.disabled = true;
              this.$session.start();
              this.$session.set("usuario", res.data.usuario);
              console.log(res.data.usuario);
              window.location.reload();
              this.redireccionar();
            } else {
              this.alerta = true;
              this.resultadoOperacion = "Error en los datos de acceso.";
            }
            this.disabled = false;
          }).catch(error=>{
            this.disabled = false;
          });
      }
    },
    redireccionar() {
       var usuario = this.$session.get("usuario");
      if (!this.$session.exists() || usuario == null) {
        this.$router.push("/usuario/login");
      } else if (usuario.tipo.id == 1) {
        this.$router.push("/turno/principal-turno");
      } else if (usuario.tipo.id == 2 || usuario.tipo.id == 3) {
        this.$router.push("/");
      }
    },
    limpiarCajas() {
      this.usuario.nombre = "";
      this.usuario.contrasena = "";
      this.usuario.idEmpleado = 0;
      errorDisponibilidad: "";
    },
    limpiarResultado(){
      this.resultadoOperacion = "";
      this.alerta = false;
      this.informacion = false;
    },
    checkForm() {
      if (this.usuario.nombre && this.usuario.contrasena) {
        return true;
      }

      this.erroresForm = [];

      if (!this.usuario.nombre) {
        this.erroresForm.push("Nombre requerido.");
      }
      if (!this.usuario.contrasena) {
        this.erroresForm.push("Contraseña requerida.");
      }
      this.disabled = false;
      return false;
    }
  }
};
</script>
