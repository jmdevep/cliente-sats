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

//Convenio
const ListadoConvenio = () => import('@/components/convenio/ListadoConvenio');
const ListadoEmpresaSinConvenio = () => import('@/components/convenio/ListadoEmpresaSinConvenio');
const RegistroConvenio = () => import('@/components/convenio/RegistroConvenio');
const EliminarConvenio = () => import('@/components/convenio/EliminarConvenio');
const EditarConvenio = () => import('@/components/convenio/EditarConvenio');

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

    //Convenio
    {path: '/convenio/listado-convenio', name: 'ListadoConvenio', component: ListadoConvenio},
    {path: '/convenio/listado-empresa-sin-convenio', name: 'ListadoEmpresaSinConvenio', component: ListadoEmpresaSinConvenio},
    {path: '/convenio/registro-convenio', name: 'RegistroConvenio', component: RegistroConvenio},
    {path: '/convenio/eliminar-convenio', name: 'EliminarConvenio', component: EliminarConvenio},
    {path: '/convenio/editar-convenio', name: 'EditarConvenio', component: EditarConvenio},
    
  ]
})
