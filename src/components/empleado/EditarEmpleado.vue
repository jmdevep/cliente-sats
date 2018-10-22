<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modificar Empleado</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarEmpleado()">
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p class="text-danger" v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
                    <div v-if="roles.length" class="form-group">
                        <label>Seleccione los roles del empleado:</label>
                        <select id="roles" class="form-control" v-model="rolSeleccionado" @change="cambioSelect()">
                            <option  v-for="(rol,index) in roles" :key="index" v-bind:value="rol" :disabled="rol.disabled">
                                {{ rol.nombre }}
                            </option>
                        </select>
                    </div>                    
                    <p v-if="rolesSeleccionados.length">
                        <b>Roles Seleccionados:</b>
                        <ul>
                            <li v-for="(rol, index) in rolesSeleccionados" :key="index">{{ rol.nombre }} 
                                <a href="#" @click="removerRol(rol)">
                                    - <i class="fas fa-trash-alt"></i>
                                </a>
                            </li>
                        </ul>
                    </p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre </label>
                        <input type="text" maxlength="45" class="form-control border-success" v-model="empleado.nombre" id="nombre" placeholder="Nombre">
                    </div>
                    <div class="form-group">
                        <label for="apellido" class="darkTextCustom">Apellido</label>
                        <input type="text" maxlength="45" class="form-control border-success" v-model="empleado.apellido" id="apellido" placeholder="Apellidos">
                    </div>
                    <div class="form-group">
                        <label for="documento" class="darkTextCustom">Documento de Identidad</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="empleado.documento" id="documento" placeholder="Documento">
                        <small id="emailHelp" maxlength="21" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>                    
                    </div>
                    <div class="form-group">
                        <label for="fechaNacimiento" class="darkTextCustom">Fecha de Nacimiento</label>
                        <input type="date" class="form-control border-success" v-model="empleado.fechaNacimiento" id="fechaNacimiento" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="domicilio" class="darkTextCustom">Domicilio</label>
                        <input type="text" maxlength="80" class="form-control border-success" v-model="empleado.domicilio" id="domicilio" placeholder="Domicilio">
                    </div>
                    <div class="form-group">
                        <label for="telefono" class="darkTextCustom">Teléfono</label>
                        <input type="text" maxlength="15" class="form-control border-success" v-model="empleado.telefono" id="telefono" placeholder="Teléfono">
                    </div>
                    <div class="form-group">
                        <label for="vencimientoCarnetSalud" class="darkTextCustom">Vencimiento Carnet Salud</label>
                        <input type="date" class="form-control border-success" v-model="empleado.vencimientoCarnetSalud" id="vencimientoCarnetSalud" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="vencimientoCarnetChofer" class="darkTextCustom">Vencimiento Libreta de Conducir</label>
                        <input type="date" class="form-control border-success" v-model="empleado.vencimientoCarnetChofer" id="vencimientoCarnetChofer" placeholder="2019-12-05">
                    </div>
                    <input type="submit" :disabled="disabled" value="Modificar" class="btn marginBefore btn-success">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EditarEmpleado',
        mounted(){
            this.empleado = this.$route.params.empleado;
            if(this.empleado.fechaNacimiento){
                this.empleado.fechaNacimiento = moment(this.empleado.fechaNacimiento).format('YYYY-MM-DD');
            }
            if(this.empleado.vencimientoCarnetSalud){
                this.empleado.vencimientoCarnetSalud = moment(this.empleado.vencimientoCarnetSalud).format('YYYY-MM-DD');
            }
            if(this.empleado.vencimientoCarnetChofer){
                this.empleado.vencimientoCarnetChofer = moment(this.empleado.vencimientoCarnetChofer).format('YYYY-MM-DD');
            }
            this.documentoOriginal = this.$route.params.empleado.documento;
            console.log(this.empleado);
            this.cargarListaRoles();
        	},
        data(){
            return{
                loading: false,
                resultadoOperacion: null,
                erroresForm: [],
                disabled: true,
            	empleado: {
                    nombre: '',
                    apellido: '',
                    documento: '',
                    fechaNacimiento: '',
                    domicilio: '',
                    telefono: '',
                    vencimientoCarnetSalud: '',
                    vencimientoCarnetChofer: '',
                },
                documentoOriginal: '',
                roles: [],
                rolesSeleccionados: [],
                rolSeleccionado: [],
                alerta: false,
                informacion: false,
            }
        },
        methods: {
            cargarRolesActuales(){
                if(this.empleado.listaRoles.length){
                    console.log(this.empleado.listaRoles);
                    this.empleado.listaRoles.forEach(rol => {
                        this.rolesSeleccionados.push(rol);
                        var indexRol = this.roles.findIndex((r => r.id == rol.id));
                        console.log(indexRol);
                        this.roles[indexRol].disabled = true;
                    })
                }
            },
            cambioSelect(){
                this.rolesSeleccionados.push(this.rolSeleccionado);
                var indexRol = this.roles.findIndex((rol => rol.id == this.rolSeleccionado.id));
                this.roles[indexRol].disabled = true;
            },
            removerRol(pRol){
                this.rolesSeleccionados = this.rolesSeleccionados.filter(rol => rol.id != pRol.id);
                var indexRol = this.roles.findIndex((rol => rol.id == pRol.id));
                console.log(indexRol);
                this.roles[indexRol].disabled = false;

            },
            cargarListaRoles(){
                this.loading = true;    
                axios.get(`${process.env.BASE_URL}/api/turno/lista-roles`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.roles = res.data.roles;
                        this.roles.forEach(function(obj) { obj.disabled = false; });
                        this.cargarRolesActuales();
                    }
                    this.loading = false;
        	    });
            },
            verificarDisponibilidad() {
                
                if(this.empleado.documento != '' && this.documentoOriginal != this.empleado.documento){
                    this.errorDisponibilidad = "Verificando..";
                    axios.get(`${process.env.BASE_URL}/api/empleado/existe-empleado`, {
                        params: {
                        documento: this.empleado.documento,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true || res.data.resultado == 1300){
                                this.disabled = true;
                                this.errorDisponibilidad = "Documento ya registrado.";
                            } else {
                                this.errorDisponibilidad = "";    
                                this.disabled = false;                              
                            }
                    });
                } else {
                    this.disabled = false;
                }
            },
            limpiarResultado(){
                this.alerta = false;
                this.informacion = false;
                this.resultadoOperacion = '';
            },
            modificarEmpleado(){
                this.limpiarResultado();
                this.loading = true;
                if(this.checkForm()){
                    this.empleado.listaRoles = this.rolesSeleccionados;
                    var params = this.empleado;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/empleado/modificar-empleado`, params) 
                        .then((res)=>{
                            console.log(res);
                            if(res.data.resultado == 1304){
                                this.$router.push({ name: 'PrincipalEmpleado', params: { resultadoOperacion: "Empleado modificado satisfactoriamente." }});                                                            
                            } else if(res.data.resultado == 200){
                                this.alerta = true;
                                this.resultadoOperacion = 'Error de conexión, inténtelo nuevamente.';
                            }else{
                                this.alerta = true;
                                this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                            }
                            this.loading = false;
                        })
                        .catch((error)=>{
                            this.alerta = true;
                            this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                            console.log(error);
                            this.loading = false;
                    });
                }
            },
            limpiarCajas(){
                this.empleado.nombre = '';
                this.empleado.apellido = '';
                this.empleado.documento = '';
                this.empleado.fechaNacimiento = '';
                this.empleado.domicilio = '';
                this.empleado.telefono = '';
                this.empleado.vencimientoCarnetSalud = '';
                this.empleado.vencimientoCarnetChofer = '';
            },
            checkForm() {
                if (this.empleado.nombre && this.empleado.apellido && this.empleado.documento && this.empleado.fechaNacimiento && this.empleado.domicilio
                    && this.empleado.telefono ) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.empleado.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }                
                if (!this.empleado.apellido) {
                    this.erroresForm.push('Apellido requerido.');
                }                
                if (!this.empleado.documento) {
                    this.erroresForm.push('Documento requerido.');
                }      
                if (!this.empleado.fechaNacimiento) {
                    this.erroresForm.push('Fecha de nacimiento requerida.');
                }                
                if (!this.empleado.domicilio) {
                    this.erroresForm.push('Domicilio requerido.');
                }
                if (!this.empleado.telefono) {
                    this.erroresForm.push('Teléfono requerido.');
                }

                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
