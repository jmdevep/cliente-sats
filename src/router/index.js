import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

// Usuario
const RegistroUsuario = () => import('@/components/usuario/RegistroUsuario');
const ListadoUsuario = () => import('@/components/usuario/ListadoUsuario');
const EditarUsuario = () => import('@/components/usuario/EditarUsuario');
const EliminarUsuario = () => import('@/components/usuario/EliminarUsuario');
const Login = () => import('@/components/usuario/Login');


//Empleado
const IngresoTurno = () => import('@/components/empleado/IngresoTurno');
const RegistroEmpleado = () => import('@/components/empleado/RegistroEmpleado');
const ListadoEmpleado = () => import('@/components/empleado/ListadoEmpleado');
const EliminarEmpleado = () => import('@/components/empleado/EliminarEmpleado');
const AsociarUsuario = () => import('@/components/empleado/AsociarUsuario');
const EditarEmpleado = () => import('@/components/empleado/EditarEmpleado');

//Turno
const PlanillaTurnos = () => import('@/components/turno/PlanillaTurnos');
const CargaPlanillaTurnos= () => import('@/components/turno/CargaPlanillaTurnos')



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {path: '/', name: 'Home', component: HelloWorld},    
    //Usuario
    {path: '/usuario/registro-usuario', name: 'RegistroUsuario', component: RegistroUsuario},
    {path: '/usuario/listado-usuario', name: 'ListadoUsuario', component: ListadoUsuario},
    {path: '/usuario/editar-usuario', name: 'EditarUsuario', component: EditarUsuario},
    {path: '/usuario/eliminar-usuario', name: 'EliminarUsuario', component: EliminarUsuario},
    {path: '/usuario/login', name: 'Login', component: Login},
    
    //Empleado
    {path: '/empleado/registro-empleado', name: 'RegistroEmpleado', component: RegistroEmpleado},
    {path: '/empleado/ingreso-turno', name: 'IngresoTurno', component: IngresoTurno},
    {path: '/empleado/listado-empleado', name: 'ListadoEmpleado', component: ListadoEmpleado},
    {path: '/empleado/eliminar-empleado', name: 'EliminarEmpleado', component: EliminarEmpleado},
    {path: '/empleado/editar-empleado', name: 'EditarEmpleado', component: EditarEmpleado},
    {path: '/empleado/asociar-usuario', name: 'AsociarUsuario', component: AsociarUsuario},
    
    //Turno
    {path: '/turno/planilla-turnos', name: 'PlanillaTurnos', component: PlanillaTurnos},
    {path: '/turno/carga-planilla-turnos', name: 'CargaPlanillaTurnos', component: CargaPlanillaTurnos},
    
  ]
})
