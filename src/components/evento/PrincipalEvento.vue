<template>
    <div>
        <h1 class="mainTitle">
            Eventos
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

    import ListadoServicio from '../servicio/ListadoServicio.vue'
    import RegistroServicio from '../servicio/RegistroServicio.vue'
    import RegistroEvento from './RegistroEvento.vue'
    import ListadoEvento from './ListadoEvento.vue'

	export default {
        name: 'PrincipalEvento',
        mounted(){

        },
         components: {
            RegistroEvento,
            ListadoServicio,
            RegistroServicio,
            ListadoEvento,
        },
        data(){
            return {
            currentTab: RegistroEvento,
            tabs: [
                { component: ListadoServicio, title: 'Lista Servicios' },
                { component: RegistroServicio, title: 'Registar Servicio'},
                { component: RegistroEvento, title: 'Registrar Evento'},
                { component: ListadoEvento, title: 'Lista Eventos' },
                
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









