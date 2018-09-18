<template>
    <div>
        <h1 class="mainTitle">
            Turnos
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

    import ListadoTurno from './ListadoTurno.vue'
    import DescargaPlanillaTurnos from './DescargaPlanillaTurnos.vue' 
    import CargaPlanillaTurnos from './CargaPlanillaTurnos.vue'
    //import MarcarTurno from './MarcarTurno.vue'

	export default {
        name: 'PrincipalTurno',
        mounted(){

        },
         components: {
             ListadoTurno,
             DescargaPlanillaTurnos,
             CargaPlanillaTurnos,
             //MarcarTurno
        },
        data(){
            return {
            currentTab: ListadoTurno,
            tabs: [
                { component: ListadoTurno, title: 'Lista Turnos' },
                { component: DescargaPlanillaTurnos, title: 'Descargar Planilla'},
                { component: CargaPlanillaTurnos, title: 'Cargar Planilla'},
                //{ component: MarcarTurno, title: 'Marcar Turno'},
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









