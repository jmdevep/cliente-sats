<template>
    <div>
        <h1 class="mainTitle">
        Asociar Usuario
        </h1>
        <hr class="titleUnderline">
        <h2>Empleado: {{ empleado.nombre }} {{ empleado.apellido }}</h2>
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Lista de Usuarios sin Asociar</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Tipo de Usuario</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(usuario, index) in usuarios" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ usuario.id }}</td>
                            <td>{{ usuario.nombre }}</td>
                            <td>{{ usuario.tipo.nombre }}</td>
                            <td>
                                <a href="#" @click="asociarUsuario(usuario.id)" class="btn btn-info" role="button">Asociar</a>                                
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ul class="pagination">
                    <li class="page-item" v-bind:class="{ 'disabled' : (indexActual==1) }">
                    <a @click="cargarAnterior()" class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Anterior</span>
                    </a>
                    </li> 
                    <li class="page-item" v-bind:class="{ 'disabled' : (index==indexActual) }" v-for="index in cantidadPaginas" :key="index"><a @click="cargarDatos(index)" class="page-link" href="#">{{ index }}</a></li>
                    <li class="page-item"  v-bind:class="{ 'disabled' : (indexActual==cantidadPaginas) }">
                    <a @click="cargarSiguiente()" class="page-link" href="#" aria-label="Next">
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
export default {
  name: "AsociarUsuario",
  mounted() {
    if (this.$route.params.empleado != null) {
      this.empleado = this.$route.params.empleado;
    } else {
      this.$router.push("/empleado/principal-empleado");
    }
    this.loading = true;
    axios
      .get(`${process.env.BASE_URL}/api/usuario/lista-usuarios-asociar`, {
        params: {
          condiciones: {
            orden: "DESC",
            tamanoPagina: this.tamanoPagina,
            indicePagina: this.indicePagina,
            campo: "nombre"
          }
        }
      })
      .then(res => {
        console.log(res);

        if (res.data.resultado == 100) {
          this.usuarios = res.data.listaUsuarios;
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
  data() {
    return {
      loading: false,
      usuarios: [],
      tamanoPagina: 2,
      indicePagina: 0,
      cantidadPaginas: 0,
      indexActual: 0,
      empleado: null
    };
  },
  methods: {
    asociarUsuario(idUsuario) {
      var params = {
        id: this.empleado.id,
        usuario: {
          id: idUsuario
        }
      };
      console.log(params);
      axios
        .post(`${process.env.BASE_URL}/api/empleado/asociar-usuario`, params)
        .then(res => {
          console.log(res);
          if (res.data.resultado == 1) {
            this.$router.push({
              name: "PrincipalEmpleado",
              params: {
                resultadoOperacion: "Usuario asociado satisfactoriamente."
              }
            });
          } else if (res.data.resultado == 1101) {
            this.resultadoOperacion = "El usuario seleccionado no existe.";
          }
        });
    },
    cargarDatos(index) {
      this.loading = true;
      console.log(index);
      axios
        .get(`${process.env.BASE_URL}/api/usuario/lista-usuarios-asociar`, {
          params: {
            condiciones: {
              orden: "DESC",
              tamanoPagina: this.tamanoPagina,
              indicePagina: index - 1,
              campo: "nombre"
            }
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.usuarios = res.data.listaUsuarios;
            this.indexActual = index;
          }
          this.loading = false;
        });
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
