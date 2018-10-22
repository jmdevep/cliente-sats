<template>
    <div>
        <h1 class="mainTitle">
        Tramos
        </h1>
        <hr class="titleUnderline">
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
        <p v-show="resultadoOperacion != ''" class="text-info"><i v-show="resultadoOperacion != ''" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Lista de Tramos</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Origen</th>
                            <th scope="col">Destino</th>
                            <th scope="col">Kilómetros</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(tramo, index) in tramos" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ tramo.localidadOrigen.nombre }}</td>
                            <td>{{ tramo.localidadDestino.nombre }}</td>
                            <td>{{ tramo.cantidadKm }}</td>
                            <td>
                                <router-link :to="{ name: 'EditarTramo', params: { tramo: tramo }}"><a href="#" class="btn btn-info" role="button">Editar</a></router-link>
                                <router-link :to="{ name: 'EliminarTramo', params: { tramo: tramo }}"><a href="#" class="btn btn-danger" role="button">Eliminar</a></router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                     <ul class="pagination">
                        <li class="page-item" v-bind:class="{ 'disabled' : (indexActual==0) }">
                        <a @click="cargarAnterior()" class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Anterior</span>
                        </a>
                        </li> 
                        <li class="page-item" v-bind:class="{ 'disabled' : (index - 1 == indexActual) }" v-for="index in cantidadPaginas" :key="index"><a @click="indexActual = index -1; cargarDatos()" class="page-link" href="#">{{ index }}</a></li>
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
  name: "ListadoTramo",
  mounted() {
    this.resultadoOperacion = this.$route.params.resultadoOperacion;

    this.cargarDatos();
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
      tramos: [],

      //inicio propiedades tabla
      tamanoPagina: 5,
      indicePagina: 0,
      cantidadPaginas: 0,
      indexActual: 0,
      filtrado: "",
      campoFiltrado: "",
      opcionesFiltrado: [
        { value: "id_localidad_origen", text: "Localidad de Origen" }
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
        .get(`${process.env.BASE_URL}/api/tramo/lista-tramos`, {
          params: {
            condiciones: {
           orden: this.ordenFiltradoAsc ? "ASC" : "DESC",
              tamanoPagina: this.tamanoPagina,
              indicePagina: this.indexActual,
              campo: this.campoFiltrado || "id_localidad_origen",
              valor: "%" + this.filtrado + "%"|| "%%"
            }
          }
        })
    .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.tramos = res.data.listaTramos;
            this.cantidadPaginas =
              res.data.cantidadElementos <= this.tamanoPagina
                ? 1
                : Math.ceil(res.data.cantidadElementos / this.tamanoPagina);
          } else {
            this.tramos = [];
            this.indexActual = 0;
          }
          this.loading = false;
        });
    },
    cargarSiguiente() {
      this.indexActual += 1;
      this.cargarDatos();
    },
    cargarAnterior() {
      this.indexActual -= 1;
      this.cargarDatos();
    }
  }
};
</script>
