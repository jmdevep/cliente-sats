<template>
    <div>
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

    import RegistroPrestador from './RegistroPrestador.vue'
    import ListadoPrestador from './ListadoPrestador.vue'
    

	export default {
        name: 'PrincipalPrestador',
        mounted(){

        },
         components: {
            RegistroPrestador,
            ListadoPrestador,
        },
        data(){
            return {
            currentTab: ListadoPrestador,
            tabs: [
                { component: ListadoPrestador, title: 'Lista Prestadores' },
                { component: RegistroPrestador, title: 'Registar Prestador'},
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









