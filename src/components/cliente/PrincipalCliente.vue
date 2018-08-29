<template>
    <div>
        <h1 class="mainTitle">
            Clientes
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

    import ListadoEmpresa from './ListadoEmpresa.vue'
    import RegistroEmpresa from './RegistroEmpresa.vue'
    import ListadoPersona from './ListadoPersona.vue'
    import RegistroPersona from './RegistroPersona.vue'
    import CargaPlanillaClientes from './CargaPlanillaClientes.vue'


	export default {
        name: 'PrincipalCliente',
        mounted(){

        },
         components: {
            ListadoEmpresa,
            RegistroEmpresa,
            ListadoPersona,
            RegistroPersona,
            CargaPlanillaClientes
        },
        data(){
            return {
            currentTab: ListadoEmpresa,
            tabs: [
                { component: ListadoEmpresa, title: 'Lista Empresas' },
                { component: RegistroEmpresa, title: 'Registar Empresas'},
                { component: ListadoPersona, title: 'Lista Personas'},
                { component: RegistroPersona, title: 'Registrar Persona'},
                { component: CargaPlanillaClientes, title: 'Cargar desde planilla'},
                
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









