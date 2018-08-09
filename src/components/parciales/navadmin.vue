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
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Turnos
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <router-link to="/turno/carga-planilla-turnos"><a class="dropdown-item" href="#">Cargar Planilla</a></router-link>                        
                        <router-link to="/turno/planilla-turnos"><a class="dropdown-item" href="#">Planilla de Turnos</a></router-link>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Eventos</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Usuarios
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <router-link to="/usuario/registro-usuario"><a class="dropdown-item" href="#">Registrar</a></router-link>
                        <router-link to="/usuario/listado-usuario"><a class="dropdown-item" href="#">Listado</a></router-link>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Empleados
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <router-link to="/empleado/registro-empleado"><a class="dropdown-item" href="#">Registrar</a></router-link>
                        <router-link to="/empleado/listado-empleado"><a class="dropdown-item" href="#">Listado</a></router-link>
                        </div>
                    </li>
                    <li v-if="this.$session.exists() && this.$session.get('usuario') != null" class="nav-item"><a class="nav-link" href="#"><span class="glyphicon glyphicon-user"></span>{{ usuario.nombre }}</a></li>
                    <li v-if="this.$session.exists() && this.$session.get('usuario') != null" class="nav-item"><a class="nav-link" href="#" @click="logout()"><span class="glyphicon glyphicon-log-in"></span>Cerrar Sesión</a></li>       
                    <li v-if="this.$session.exists() == false" class="nav-item"><router-link to="/usuario/login"><a class="nav-link" href="#"><span class="glyphicon glyphicon-log-in"></span>Iniciar Sesión</a></router-link></li>
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