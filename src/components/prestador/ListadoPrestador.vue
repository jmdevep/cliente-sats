<template>
    <div>
        <h1 class="mainTitle">
        Prestadores
        </h1>
        <hr class="titleUnderline">
        {{ resultadoOperacion }}

             
  <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Filtrar" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filtrado" placeholder="Escribe para buscar" />
            <b-input-group-append>
              <b-btn :disabled="!filtrado" @keyup.enter="cargarDatos(0)" @click="filtrado = ''">Limpiar</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Ordenar" class="mb-0">
          <b-input-group>
            <b-form-select v-model="campoFiltrado" :options="opcionesFiltrado">
              <option slot="first" :value="null">-- ninguno --</option>
            </b-form-select>
            <b-form-select :disabled="!campoFiltrado" v-model="ordenFiltradoAsc" slot="append">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Por página" class="mb-0">
          <b-form-select :options="paginasFiltrado" v-model="tamanoPagina" />
        </b-form-group>
      </b-col>

    <b-col md="6" class="my-1">
        <b-form-group horizontal label="" class="mb-0">
            <b-btn class="btn btn-success" @click="cargarDatos(0)">Buscar <i class="fas fa-search"></i></b-btn>
        </b-form-group>
      </b-col>
    </b-row>
    
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Lista de prestadores</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(prestador, index) in prestadores" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ prestador.nombreDescriptivo }}</td>
                            <td>
                                <router-link :to="{ name: 'EditarPrestador', params: { prestador: prestador }}"><a href="#" class="btn btn-info" role="button">Editar</a></router-link>
                                <router-link :to="{ name: 'EliminarPrestador', params: { prestador: prestador }}"><a href="#" class="btn btn-danger" role="button">Eliminar</a></router-link>
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
  name: "ListadoPrestador",
  mounted() {
    this.resultadoOperacion = this.$route.params.resultadoOperacion;

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
        this.loading = false;
        console.log(this.prestadores);
      });
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
      loading: false,
      prestadores: [],
      //inicio propiedades tabla
      tamanoPagina: 5,
      indicePagina: 0,
      cantidadPaginas: 0,
      indexActual: 0,
      filtrado: "",
      campoFiltrado: "",
      opcionesFiltrado: [
        { value: "nombre_usuario", text: "Nombre de Usuario" }
      ],
      ordenFiltradoAsc: null,
      paginasFiltrado: [5, 10, 15]
      //fin propiedades tabla
    };
  },
  methods: {
    cargarDatos(index) {
      this.loading = true;
      console.log(index);
      axios
        .get(`${process.env.BASE_URL}/api/cliente/lista-prestadores`, {
          params: {
            condiciones: {
              orden: "DESC",
              tamanoPagina: this.tamanoPagina,
              indicePagina: index - 1,
              campo: "nombre_prestador"
            }
          }
        })
        .then(res => {
          console.log("SI ANDA ESTO");
          console.log(res);
          console.log(res.data.resultado);
          if (res.data.resultado == 100) {
            this.prestadores = res.data.prestadores;
            console.log(this.prestadores);
            console.log(res.data.prestadores);
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
