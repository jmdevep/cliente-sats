<template>
    <div>
        <h1 class="mainTitle">
            Planes
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

    import ListadoPlan from './ListadoPlan.vue'
    import RegistroPlan from './RegistroPlan.vue' 
    import AsociarCliente from './AsociarCliente.vue'
    import AgregarSocioGrupo from './AgregarSocioGrupo.vue'
    import ListadoDescuento from '../descuento/ListadoDescuento.vue'
    import RegistroDescuento from '../descuento/RegistroDescuento.vue'


	export default {
        name: 'PrincipalPlan',
        mounted(){

        },
         components: {
            ListadoPlan,
            RegistroPlan,
            AsociarCliente,
            ListadoDescuento,
            RegistroDescuento
        },
        data(){
            return {
            currentTab: ListadoPlan,
            tabs: [
                { component: ListadoPlan, title: 'Lista Planes' },
                { component: RegistroPlan, title: 'Registrar Plan'},
                { component: AsociarCliente, title: 'Asociar Cliente'},
                { component: ListadoDescuento, title: 'Lista Descuentos'},
                { component: RegistroDescuento, title: 'Registrar Descuento'},
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









