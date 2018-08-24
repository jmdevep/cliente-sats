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
const DescargaPlanillaTurnos = () => import('@/components/turno/DescargaPlanillaTurnos');
const CargaPlanillaTurnos= () => import('@/components/turno/CargaPlanillaTurnos')


//Cliente
const RegistroPersona = () => import('@/components/cliente/RegistroPersona');
const ListadoPersona = () => import('@/components/cliente/ListadoPersona');
const EditarPersona = () => import('@/components/cliente/EditarPersona');
const EliminarPersona = () => import('@/components/cliente/EliminarPersona');
const RegistroEmpresa = () => import('@/components/cliente/RegistroEmpresa');
const ListadoEmpresa = () => import('@/components/cliente/ListadoEmpresa');
const EliminarEmpresa = () => import('@/components/cliente/EliminarEmpresa');
const EditarEmpresa = () => import('@/components/cliente/EditarEmpresa');
const CargaPlanillaClientes = () => import('@/components/cliente/CargaPlanillaClientes');
const RegistroPlan = () => import('@/components/cliente/RegistroPlan');

//Descuentos y planes
const RegistroDescuento = () => import('@/components/cliente/RegistroDescuento');
const ListadoPlan = () => import('@/components/cliente/ListadoPlan');
const ListadoDescuento = () => import('@/components/cliente/ListadoDescuento');
const EliminarPlan = () => import('@/components/cliente/EliminarPlan');
const EditarPlan = () => import('@/components/cliente/EditarPlan');
const EliminarDescuento = () => import('@/components/cliente/EliminarDescuento');
const EditarDescuento = () => import('@/components/cliente/EditarDescuento');

//Servicio
const RegistroServicio = () => import('@/components/servicio/RegistroServicio');
const ListadoServicio = () => import('@/components/servicio/ListadoServicio');
const EliminarServicio = () => import('@/components/servicio/EliminarServicio');
const EditarServicio = () => import('@/components/servicio/EditarServicio');

//Localidad
const RegistroLocalidad = () => import('@/components/localidad/RegistroLocalidad');
const ListadoLocalidad = () => import('@/components/localidad/ListadoLocalidad');
const EliminarLocalidad = () => import('@/components/localidad/EliminarLocalidad');
const EditarLocalidad = () => import('@/components/localidad/EditarLocalidad');



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
    {path: '/turno/descarga-planilla-turnos', name: 'DescargaPlanillaTurnos', component: DescargaPlanillaTurnos},
    {path: '/turno/carga-planilla-turnos', name: 'CargaPlanillaTurnos', component: CargaPlanillaTurnos},

    //Persona
    {path: '/persona/registro-persona', name: 'RegistroPersona', component: RegistroPersona},
    {path: '/persona/listado-persona', name: 'ListadoPersona', component: ListadoPersona},
    {path: '/persona/editar-persona', name: 'EditarPersona', component: EditarPersona},
    {path: '/persona/eliminar-persona', name: 'EliminarPersona', component: EliminarPersona},

    //Empresa
    {path: '/empresa/registro-empresa', name: 'RegistroEmpresa', component: RegistroEmpresa},
    {path: '/empresa/listado-empresa', name: 'ListadoEmpresa', component: ListadoEmpresa},
    {path: '/empresa/eliminar-empresa', name: 'EliminarEmpresa', component: EliminarEmpresa},

    //Cliente
    {path: '/cliente/carga-planilla-clientes', name: 'CargaPlanillaClientes', component: CargaPlanillaClientes},
    {path: '/cliente/registro-plan', name: 'RegistroPlan', component: RegistroPlan},
    {path: '/cliente/registro-descuento', name: 'RegistroDescuento', component: RegistroDescuento},
    {path: '/cliente/listado-plan', name: 'ListadoPlan', component: ListadoPlan},
    {path: '/cliente/listado-descuento', name: 'ListadoDescuento', component: ListadoDescuento},
    {path: '/cliente/eliminar-plan', name: 'EliminarPlan', component: EliminarPlan},
    {path: '/cliente/editar-plan', name: 'EditarPlan', component: EditarPlan},
    {path: '/cliente/eliminar-descuento', name: 'EliminarDescuento', component: EliminarDescuento},
    {path: '/cliente/editar-descuento', name: 'EditarDescuento', component: EditarDescuento},
    
    //Servicio
    {path: '/servicio/registro-servicio', name: 'RegistroServicio', component: RegistroServicio},
    {path: '/servicio/listado-servicio', name: 'ListadoServicio', component: ListadoServicio},
    {path: '/servicio/eliminar-servicio', name: 'EliminarServicio', component: EliminarServicio},
    {path: '/servicio/editar-servicio', name: 'EditarServicio', component: EditarServicio},

    //Localidad
    {path: '/localidad/registro-localidad', name: 'RegistroLocalidad', component: RegistroLocalidad},
    {path: '/localidad/listado-localidad', name: 'ListadoLocalidad', component: ListadoLocalidad},
    {path: '/localidad/eliminar-localidad', name: 'EliminarLocalidad', component: EliminarLocalidad},
    {path: '/localidad/editar-localidad', name: 'EditarLocalidad', component: EditarLocalidad},
    
  ]
})
