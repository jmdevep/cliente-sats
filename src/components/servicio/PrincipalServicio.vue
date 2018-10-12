<template>
    <div>
        <h1 class="mainTitle">
            Servicios
        </h1>
        <hr class="titleUnderline">
            <ul class="nav nav-tabs">

            <li class="nav-item"
                v-for="tab in tabs"
                v-bind:key="tab"
                v-on:click="currentTab = tab.component" data-toggle="tab">
                <a :disabled="tab.disabled" v-bind:class="['nav-link', { active: currentTab === tab.component }]" href="#">{{ tab.title }}</a>
            </li>
            </ul>

    <component
    v-bind:is="currentTabComponent"
    class="tab">
    </component>
    </div>
</template>

<script>
    import axios from 'axios';

    import ListadoServicio from './ListadoServicio.vue'
    import RegistroServicio from './RegistroServicio.vue'
    //import DetalleServicio from './DetalleServicio.vue'
    

	export default {
        name: 'PrincipalServicio',
        mounted(){

        },
         components: {
            RegistroServicio,
            ListadoServicio,
          //  DetalleServicio,
        },
        data(){
            return {
            currentTab: ListadoServicio,
            tabs: [
                { component: ListadoServicio, title: 'Lista Servicios' },
                { component: RegistroServicio, title: 'Registrar Servicio'},
               // { compomnent: DetalleServicio, title: 'Detalle Servicio'}
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









