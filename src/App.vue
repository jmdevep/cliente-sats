<template>
  <div id="app">
          <div id="navegacion">
                <nav class="navbar navbar-expand-lg navbar-dark greenBackground">
                        <router-link to="/"><a class="navbar-brand" href="#">SATS</a></router-link>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                            <router-link to="/"><a class="nav-item nav-link active" href="#">Inicio<span class="sr-only">(current)</span></a></router-link>
                            <router-link to="/usuario/registro-usuario"><a class="nav-item nav-link" href="/">Usuarios</a></router-link>
                             <router-link to="/empleado/registro-empleado"><a class="nav-item nav-link" href="/">Empleados</a></router-link>
                            <a class="nav-item nav-link disabled" href="#">Disabled</a>
                            </div>
                        </div>
                </nav>
        </div>
        <div id="contenido" class="container">
          <router-view/>
        </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
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
</style>
