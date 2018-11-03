<template>
  <div id="app">
    <template v-if="admin">   
        <nav-admin/>
    </template>
    <template v-else-if="empleado">
        <nav-empleado/>
    </template>    
    <template v-else-if="coordinador">
        <nav-coordinador/>
    </template>
    <div id="contenido" class="container">
        <router-view/>
    </div>
  </div>
</template>

<script>
import NavAdmin from './components/parciales/NavAdmin';
import NavEmpleado from './components/parciales/NavEmpleado';
import NavCoordinador from './components/parciales/NavCoordinador';

export default {
  name: 'App',
  components: {
      'nav-admin': NavAdmin,
      'nav-empleado': NavEmpleado,
      'nav-coordinador': NavCoordinador
  },
  data() {
    return {
        admin: false,
        empleado: true,
        logueado: false,
        coordinador: false,
    };
  },
  mounted() {
    var usuario = this.$session.get("usuario");
    if (!this.$session.exists() || usuario == null) {
      this.$router.push("/usuario/login");
    } else if(usuario.tipo.id == 1){
        this.empleado = true;
        this.logueado = true;
    } else if (usuario.tipo.id == 2){
        this.admin = true;
        this.logueado = true;        
    } else if (usuario.tipo.id == 3){
        this.admin = false;
        this.empleado = false;
        this.coordinador = true;
        this.logueado = true;
    }
  },
}

window.setInterval(function(){
  $('li.active').removeClass('active').removeClass('show');
}, 1000);

</script>

<style>
.tab {
  margin-top: 20px;
}

.dropdown-toggle::after {
    display:none;
}

.darkTextCustom{
    color: #173517 !important;
}

.greenBackground{
    background-color: #5cb85c;
    color: white;
}

.lightGreenBackground{
   background-color: #99ff99;
   color: #2f6a2f;
}

.tableHeadingBackground{
    background-color: #2f6a2f;
    color: white;
}

.tableBodyBackground{
    background-color: #e8ffd2;
    color: #1f471f;
}

.captionCustom{
    color: #3e8e3e;
    caption-side: top;
}

.footerCustom{
    color: white;
}

.footerCustom a{
    color:  #b8e0b8;
}

.footerCopyright{
    background-color: #3e8e3e;
    color: white;
}

hr{
    border:1px solid #a6d8a6;
    background-color: #a6d8a6;
    margin-left:2%;
    margin-right:2%;
}
.titleUnderline{
    border:1px solid #a6d8a6;
}

.mainTitle{
    color: #3e8e3e;
    margin-left:2%;
    margin-top:2%;
}

.decoratedTitle:after {
    content: "";
    display: inline-block;
    width: 100%;
    margin-left: .5em;
    border-bottom: 1px #a6d8a6 solid;
  }
  
.marginBefore{
    margin-top: 1%;
}

.marginAter{
    margin-bottom:1%;
}

.textMutedCustom{
    color: #5fb95f !important;
}

.nav-item .active{
    color: #1f471f !important;
}

.nav-item .nav-link{
    color: #3e8e3e;
}

.nav-item .disabled{
    color: #5fb95f !important;
} 

.card .border-success .mb-3{
    margin-top: 20px;
}
.contenido{
    margin-top: 20px;
}
h1 { font-family: Lato; font-size: 24px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 26.4px; } h3 { font-family: Lato; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 15.4px; } p { font-family: Lato; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 20px; } blockquote { font-family: Lato; font-size: 21px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 30px; } pre { font-family: Lato; font-size: 13px; font-style: normal; font-variant: normal; font-weight: 400; line-height: 18.5714px; }
</style>
