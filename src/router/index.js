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
const CargaPlanillaTurnos= () => import('@/components/turno/CargaPlanillaTurnos');
const ListadoTurno= () => import('@/components/turno/ListadoTurno');
const ListadoAsistenciaEvento= () => import('@/components/turno/ListadoAsistenciaEvento');

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


//Descuento
const EliminarDescuento = () => import('@/components/descuento/EliminarDescuento');
const EditarDescuento = () => import('@/components/descuento/EditarDescuento');
const RegistroDescuento = () => import('@/components/descuento/RegistroDescuento');
const ListadoDescuento = () => import('@/components/descuento/ListadoDescuento');

//Plan
const RegistroPlan = () => import('@/components/plan/RegistroPlan');
const ListadoPlan = () => import('@/components/plan/ListadoPlan');
const EliminarPlan = () => import('@/components/plan/EliminarPlan');
const EditarPlan = () => import('@/components/plan/EditarPlan');
const AsociarCliente = () => import('@/components/plan/AsociarCliente');
const RegistroSociedad = () => import('@/components/plan/RegistroSociedad');
const EliminarSociedad = () => import('@/components/plan/EliminarSociedad');

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

//Prestador
const ListadoPrestador = () => import('@/components/prestador/ListadoPrestador');
const RegistroPrestador = () => import('@/components/prestador/RegistroPrestador');
const EliminarPrestador = () => import('@/components/prestador/EliminarPrestador');
const EditarPrestador = () => import('@/components/prestador/EditarPrestador');

//Tramo
const RegistroTramo = () => import('@/components/tramo/RegistroTramo');
const ListadoTramo = () => import('@/components/tramo/ListadoTramo');
const EliminarTramo = () => import('@/components/tramo/EliminarTramo');
const EditarTramo =  () => import('@/components/tramo/EditarTramo');

//Evento
const RegistroEvento = () => import('@/components/evento/RegistroEvento');
const EditarEvento = () => import('@/components/evento/EditarEvento');
const EliminarEvento = () => import('@/components/evento/EliminarEvento');
const AsignarEmpleadosEvento  =  () => import('@/components/evento/AsignarEmpleadosEvento');
const AsignarViaje = () => import('@/components/evento/AsignarViaje');


//Principales
const PrincipalEmpleado = () => import('@/components/empleado/PrincipalEmpleado')
const PrincipalCliente = () => import('@/components/cliente/PrincipalCliente')
const PrincipalEvento  = () => import('@/components/evento/PrincipalEvento')
const PrincipalTramo = () => import('@/components/tramo/PrincipalTramo')
const PrincipalTurno = () => import('@/components/turno/PrincipalTurno')
const PrincipalPlan = () => import('@/components/plan/PrincipalPlan')

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
    {path: '/turno/listado-turno', name: 'ListadoTurno', component: ListadoTurno},
    {path: '/turno/listado-asistencia-evento', name: 'ListadoAsistenciaEvento', component: ListadoAsistenciaEvento},

    //Persona
    {path: '/persona/registro-persona', name: 'RegistroPersona', component: RegistroPersona},
    {path: '/persona/listado-persona', name: 'ListadoPersona', component: ListadoPersona},
    {path: '/persona/editar-persona', name: 'EditarPersona', component: EditarPersona},
    {path: '/persona/eliminar-persona', name: 'EliminarPersona', component: EliminarPersona},

    //Empresa
    {path: '/empresa/registro-empresa', name: 'RegistroEmpresa', component: RegistroEmpresa},
    {path: '/empresa/listado-empresa', name: 'ListadoEmpresa', component: ListadoEmpresa},
    {path: '/empresa/eliminar-empresa', name: 'EliminarEmpresa', component: EliminarEmpresa},

    //Descuento
    {path: '/cliente/carga-planilla-clientes', name: 'CargaPlanillaClientes', component: CargaPlanillaClientes},
    {path: '/descuento/registro-descuento', name: 'RegistroDescuento', component: RegistroDescuento},
    {path: '/descuento/listado-descuento', name: 'ListadoDescuento', component: ListadoDescuento},
    {path: '/descuento/eliminar-descuento', name: 'EliminarDescuento', component: EliminarDescuento},
    {path: '/descuento/editar-descuento', name: 'EditarDescuento', component: EditarDescuento},
    
    //Plan
    {path: '/plan/eliminar-plan', name: 'EliminarPlan', component: EliminarPlan},
    {path: '/plan/editar-plan', name: 'EditarPlan', component: EditarPlan},
    {path: '/plan/listado-plan', name: 'ListadoPlan', component: ListadoPlan},
    {path: '/plan/registro-plan', name: 'RegistroPlan', component: RegistroPlan},
    {path: '/plan/asociar-cliente', name: 'AsociarCliente', component: AsociarCliente},
    {path: '/plan/registro-sociedad', name: 'RegistroSociedad', component: RegistroSociedad},
    {path: '/plan/eliminar-sociedad', name: 'EliminarSociedad', component: EliminarSociedad},

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

    //prestador
    {path: '/prestador/listado-prestador', name: 'ListadoPrestador', component: ListadoPrestador},
    {path: '/prestador/registro-prestador', name: 'RegistroPrestador', component: RegistroPrestador},
    {path: '/prestador/eliminar-prestador', name: 'EliminarPrestador', component: EliminarPrestador},
    {path: '/prestador/editar-prestador', name: 'EditarPrestador', component: EditarPrestador},

    //Tramo
    {path: '/tramo/registro-tramo', name: 'RegistroTramo', component: RegistroTramo},
    {path: '/tramo/listado-tramo', name: 'ListadoTramo', component: ListadoTramo},
    {path: '/tramo/eliminar-tramo', name: 'EliminarTramo', component: EliminarTramo},
    {path: '/tramo/editar-tramo', name: 'EditarTramo', component: EditarTramo},

    //Evento
    {path: '/evento/registro-evento', name: 'RegistroEvento', component: RegistroEvento},
    {path: '/evento/editar-evento', name: 'EditarEvento', component: EditarEvento},
    {path: '/evento/eliminar-evento', name: 'EliminarEvento', component: EliminarEvento},
    {path: '/evento/asignar-empleados-evento', name: 'AsignarEmpleadosEvento', component: AsignarEmpleadosEvento},
    {path: '/evento/asignar-viaje', name: 'AsignarViaje', component: AsignarViaje},

    //Principales
    {path: '/empleado/principal-empleado', name: 'PrincipalEmpleado', component: PrincipalEmpleado},
    {path: '/cliente/principal-cliente', name: 'PrincipalCliente', component: PrincipalCliente},
    {path: '/evento/principal-evento', name: 'PrincipalEvento', component: PrincipalEvento},
    {path: '/tramo/principal-tramo', name: 'PrincipalTramo', component: PrincipalTramo},
    {path: '/turno/principal-turno', name: 'PrincipalTurno', component: PrincipalTurno},
    {path: '/plan/principal-plan', name: 'PrincipalPlan', component: PrincipalPlan},
    
    
  ]
})
