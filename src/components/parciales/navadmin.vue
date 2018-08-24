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
                        <router-link to="/turno/carga-planilla-turnos"><a class="dropdown-item" href="#">Cargar Planilla <i class="fas fa-upload"></i></a></router-link>                        
                        <router-link to="/turno/descarga-planilla-turnos"><a class="dropdown-item" href="#">Descargar Planilla <i class="fas fa-download"></i></a></router-link>
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
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Personas
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <router-link to="/persona/registro-persona"><a class="dropdown-item" href="#">Registrar</a></router-link>
                        <router-link to="/persona/listado-persona"><a class="dropdown-item" href="#">Listado</a></router-link>
                        <router-link to="/cliente/carga-planilla-clientes"><a class="dropdown-item" href="#">Cargar clientes por planilla</a></router-link>
                        <router-link to="/cliente/registro-plan"><a class="dropdown-item" href="#">Registrar plan</a></router-link>
                        <router-link to="/cliente/registro-descuento"><a class="dropdown-item" href="#">Registrar descuento</a></router-link>
                        <router-link to="/cliente/listado-plan"><a class="dropdown-item" href="#">Listado planes</a></router-link>
                        <router-link to="/cliente/listado-descuento"><a class="dropdown-item" href="#">Listado descuentos</a></router-link>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Empresas
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <router-link to="/empresa/registro-empresa"><a class="dropdown-item" href="#">Registrar</a></router-link>
                        <router-link to="/empresa/listado-empresa"><a class="dropdown-item" href="#">Listado</a></router-link>
                        </div>
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