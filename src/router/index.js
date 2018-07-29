import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

// Usuario
const RegistroUsuario = () => import('@/components/usuario/RegistroUsuario');
const ListadoUsuario = () => import('@/components/usuario/ListadoUsuario');

//Empleado
const IngresoTurno = () => import('@/components/empleado/IngresoTurno');
const RegistroEmpleado = () => import('@/components/empleado/RegistroEmpleado');



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {path: '/', name: 'Home', component: HelloWorld},    
    //Usuario
    {path: '/usuario/registro-usuario', name: 'RegistroUsuario', component: RegistroUsuario},
    {path: '/usuario/listado-usuario', name: 'ListadoUsuario', component: ListadoUsuario},
    //Empleado
    {path: '/empleado/registro-empleado', name: 'RegistroEmpleado', component: RegistroEmpleado},
    {path: '/empleado/ingreso-turno', name: 'IngresoTurno', component: IngresoTurno},
    
  ]
})
