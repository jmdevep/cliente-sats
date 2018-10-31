<template>
 
</template>

<script>
export default {
  name: "Inicio",
  data() {
    return {};
  },
  mounted() {},
  beforeCreate: function() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null) {
      this.$router.push("/usuario/login");
    } 
    else{
      this.$router.push("/turno/principal-turno");
    }
  }
};
</script>

