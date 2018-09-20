<template>
    <div id="navegacion">
        <nav class="navbar navbar-expand-lg navbar-dark greenBackground">
            <router-link to="/"><a class="navbar-brand" href="#">SATS</a></router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <router-link to="/"><a class="nav-link" href="#">Inicio<span class="sr-only">(current)</span></a></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/turno/principal-turno"><a class="nav-link" href="#">Turnos</a></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/evento/principal-evento"><a class="nav-link" href="#">Eventos</a></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/empleado/principal-empleado"><a class="nav-link" href="#">Empleados</a></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/cliente/principal-cliente"><a class="nav-link" href="#">Clientes</a></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/tramo/principal-tramo"><a class="nav-link" href="#">Tramos</a></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/prestador/principal-prestador"><a class="nav-link" href="#">Prestadores</a></router-link>
                    </li>
                     <li class="nav-item">
                        <router-link to="/plan/principal-plan"><a class="nav-link" href="#">Planes</a></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/empleado/listar-informe-horas"><a class="nav-link" href="#">Informe horas</a></router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <li v-if="this.$session.exists() && this.$session.get('usuario') != null" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-user-md"></i> {{ usuario.nombre }}</a></li>
                    <li v-if="this.$session.exists() && this.$session.get('usuario') != null" class="nav-item"><a class="nav-link" href="#" @click="logout()"><i class="fas fa-sign-in-alt"></i> Cerrar Sesión</a></li>       
                    <li v-if="this.$session.exists() == false" class="nav-item"><router-link to="/usuario/login"><a class="nav-link" href="#"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</a></router-link></li>                    
                </ul>   
            </div>
        </nav>  
    </div>
</template>

<script>

export default {
  name: 'navadmin',
  data(){
      return{
          logeado: false,
          usuario: null
      }
  },
  methods: {
      logout(){
          console.log("logout");
          this.logeado = false;
          this.$session.destroy();
          window.location.reload();
          this.$router.push('/usuario/login');
      },
      checkLogin(){
        var usuario = this.$session.get('usuario');
        if (this.$session.exists() && usuario != null) {
            this.logeado = true;
            this.usuario = usuario;
            console.log(this.logeado);
        } 
      }
  }, 
  mounted(){
      this.checkLogin();
    },
    watch: {

    }
}
</script>