<template>
    <div>
        <div class="card-header greenBackground" @click=" editarEvento = !editarEvento">Actualizar información Evento</div>        
        <editar-evento v-if="editarEvento"/>
        <div class="card-header greenBackground" @click=" empleadosAsignados = !empleadosAsignados">Empleados Asignados</div>        
        <asignar-empleados v-if="empleadosAsignados"/>
        <div class="card-header greenBackground" @click=" traslado = !traslado ">Traslado</div>        
        <traslado v-if="traslado"/>
        <div class="card-header greenBackground" @click=" eliminar = !eliminar ">Eliminar Evento</div>        
        <eliminar-evento v-if="eliminar"/>
    </div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import EditarEvento from "./EditarEvento";
import AsignarEmpleadosEvento from "./AsignarEmpleadosEvento";
import AsignarViaje from "./AsignarViaje";
import EliminarEvento from "./EliminarEvento";

export default {
  name: "DetalleEvento",
  components: {
    "multi-select": Multiselect,
    "editar-evento": EditarEvento,
    "asignar-empleados": AsignarEmpleadosEvento,
    "traslado": AsignarViaje,
    "eliminar-evento": EliminarEvento
  },
  mounted() {
    this.evento = this.$parent.evento;
  },
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
      this.$router.push("/usuario/login");
    }
  },
  data() {
    return {
      editarEvento: false,
      empleadosAsignados: false,
      traslado: false,
      eliminar: false,
      evento: {
        inicioEvento: "",
        direccion: "",
        persona: null,
        servicio: null,
        tipo: null,
        direccion: "",
        finEvento: "",
        listaEmpleados: [],
      }
    };
  }
};
</script>