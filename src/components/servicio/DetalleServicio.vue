<template>
    <div>
        <div class="card-header greenBackground" @click=" editar = !editar">Editar Servicio</div>        
        <editar-servicio v-if="editar"/>
        <div class="card-header greenBackground" @click=" eliminar = !eliminar ">Eliminar Servicio</div>        
        <eliminar-servicio v-if="eliminar"/>
    </div>
</template>

<script>
import EditarServicio from "./EditarServicio";
import EliminarServicio from "./EliminarServicio";


export default {
  name: "DetalleServicio",
  components: {
    "editar-servicio": EditarServicio,
    "eliminar-servicio": EliminarServicio
  },
  mounted() {
    console.log("Detalle Servicio");
    this.servicio = this.$parent.servicio;
  },
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
      this.$router.push("/usuario/login");
    }
  },
  data() {
    return {
      editar: true,
      eliminar: false,
      servicio: null
    };
  }
};
</script>