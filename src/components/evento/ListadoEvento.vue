<template>
    <div>
        {{ resultadoOperacion }}
        

    
  <b-row>
            <b-col md="6" class="my-1">
        <b-form-group horizontal label="Fecha Inicio" class="mb-0">
                <datetime type="datetime" value-zone="America/Montevideo" zone="America/Montevideo" format="yyyy-MM-dd HH:mm:ss" :phrases="{ok: 'Continuar', cancel: 'Cancelar'}" v-model="fechaInicioSeleccionada"></datetime>
        </b-form-group>
      </b-col>

              
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Fecha Inicio" class="mb-0">
<datetime type="datetime"   value-zone="America/Montevideo"
                  zone="America/Montevideo"
                  format="yyyy-MM-dd HH:mm:ss"
                  :phrases="{ok: 'Continuar', cancel: 'Cancelar'}"  v-model="fechaFinSeleccionada"></datetime>
                          </b-form-group>
      </b-col>
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
                    
                    <caption class="captionCustom"><h3>Lista de Eventos</h3></caption>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Inicio</th>
                            <th scope="col">Direccion</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Tipo Evento</th>
                            <th scope="col">Servicio</th>
                            <th scope="col">Paciente</th>
                            <th scope="col">Prestador</th>                            
                            <th scope="col">Finaliza</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(evento, index) in eventos" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ evento.inicioEvento }}</td>
                            <td>{{ evento.direccion }}</td>
                            <td>{{ evento.estado.nombre }}</td>
                            <td>{{ evento.tipo.nombre }}</td>
                            <td>{{ evento.servicio.nombre }}</td>
                            <td>{{ evento.persona.nombre }}</td>
                            <template v-if="evento.persona.prestador">
                                <td>{{ evento.persona.prestador.nombreDescriptivo }}</td>
                            </template>
                            <template v-else>
                                <td>Prestador no definido</td>
                            </template>
                            
                            <td>{{ evento.finEvento }}</td>
                            <td>
                                <a href="#" class="btn btn-info" role="button" @click="detalleEvento(evento)">Detalle</a>
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
  name: "ListadoEvento",
  mounted() {
    this.resultadoOperacion = this.$route.params.resultadoOperacion || "";

    this.cargarDatos();
  },
  data() {
    return {
      resultadoOperacion: "",
      empleados: [],
      eventos: [],

      //inicio propiedades tabla
      tamanoPagina: 5,
      indicePagina: 0,
      cantidadPaginas: 0,
      indexActual: 0,
      filtrado: "",
      campoFiltrado: "",
      opcionesFiltrado: [{ value: "inicio_evento", text: "Inicio de Evento" }],
      ordenFiltradoAsc: null,
      paginasFiltrado: [5, 10, 15]
      //fin propiedades tabla
    };
  },
  methods: {
    detalleEvento(evento) {
      this.$parent.evento = evento;
      this.$parent.currentTab = this.$parent.tabs[4].component;
    },
    cargarDatos(index) {
      this.loading = true;
      console.log(index);
      axios
        .get(`${process.env.BASE_URL}/api/evento/lista-eventos`, {
          params: {
            condiciones: {
              orden: this.ordenFiltradoAsc ? "ASC" : "DESC",
              tamanoPagina: this.tamanoPagina,
              indicePagina: this.indexActual,
              campo: this.campoFiltrado || "inicio_evento",
              valor: "%" + this.filtrado + "%" || "%%"
            }
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.resultado == 100) {
            this.eventos = res.data.listaEventos;
            this.cantidadPaginas =
              res.data.cantidadElementos <= this.tamanoPagina
                ? 1
                : Math.ceil(res.data.cantidadElementos / this.tamanoPagina);
          } else {
            this.eventos = [];
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
