<template>
    <div>
        <h1 class="mainTitle">
            Empleados
        </h1>
        <hr class="titleUnderline">
                   <ul class="nav nav-tabs">

                    <li class="nav-item"
                        v-for="tab in tabs"
                        v-bind:key="tab"
                        v-on:click="currentTab = tab.component" data-toggle="tab">
                      <a v-bind:class="['nav-link', { active: currentTab === tab.component }]" href="#">{{ tab.title }}</a>
                    </li>
                  </ul>

    <component
    v-bind:is="currentTabComponent"
    class="tab"
  ></component>
    </div>
</template>

<script>
    import axios from 'axios';
    import ListadoEmpleado from './ListadoEmpleado.vue'
    import RegistroEmpleado from './RegistroEmpleado.vue'
    import ListadoUsuario from '../usuario/ListadoUsuario.vue'
    import RegistroUsuario from '../usuario/RegistroUsuario.vue'

	export default {
        name: 'PrincipalEmpleado',
        mounted(){

        },
         components: {
            ListadoEmpleado,
            RegistroEmpleado,
            ListadoUsuario,
            RegistroUsuario,
        },
        data(){
            return {
            currentTab: ListadoEmpleado,
            tabs: [
                { component: ListadoEmpleado, title: 'Lista Empleados' },
                { component: RegistroEmpleado, title: 'Registar Empleados'},
                { component: ListadoUsuario, title: 'Lista Usuarios'},
                { component: RegistroUsuario, title: 'Registrar Usuarios'},
            ],
            }
        },
       computed: {
         currentTabComponent: function () {
            return this.currentTab
        }
     }
    }   
</script>









