<template>
    <div>
        <h1 class="mainTitle">
            Tramos
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

    import ListadoTramo from './ListadoTramo.vue'
    import RegistroTramo from './RegistroTramo.vue'
    import ListadoLocalidad from '../localidad/ListadoLocalidad.vue'
    import RegistroLocalidad from '../localidad/RegistroLocalidad.vue'

	export default {
        name: 'PrincipalTramo',
        mounted(){

        },
         components: {
            ListadoTramo,
            RegistroTramo,
            ListadoLocalidad,
            RegistroLocalidad
        },
        data(){
            return {
            currentTab: ListadoTramo,
            tabs: [
                { component: ListadoTramo, title: 'Lista Tramos' },
                { component: RegistroTramo, title: 'Registrar Tramo'},
                { component: ListadoLocalidad, title: 'Lista Localidades'},
                { component: RegistroLocalidad, title: 'Registrar Localidad'},
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









