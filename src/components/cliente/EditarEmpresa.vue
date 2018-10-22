<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modificar de Empresa</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarEmpresa()">
                    <p class="text-danger" v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Razón Social</label>
                        <input type="text" class="form-control border-success" v-model="empresa.nombre" id="nombre" placeholder="Nombre Empresa">
                    </div>
                    <div class="form-group">
                        <label for="direccion" class="darkTextCustom">Dirección</label>
                        <input type="text" class="form-control border-success" v-model="empresa.direccion" id="direccion" placeholder="Dirección">
                    </div>
                    <div class="form-group">
                        <label for="telefono" class="darkTextCustom">Teléfono</label>
                        <input type="text" class="form-control border-success" v-model="empresa.telefono" id="telefono" placeholder="Teléfono">
                    </div>
                    <div class="form-group">
                        <label for="rut" class="darkTextCustom">Rut</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="empresa.rut" id="rut" placeholder="RUT">
                        <small id="emailHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <input type="submit" :disabled="disabled" value="Modificar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EditarEmpresa',
        mounted(){
            this.empresa = this.$route.params.empresa;
            this.rutOriginal = this.$route.params.empresa.rut;
            },
        beforeCreate: function () {
            var usuario = this.$session.get('usuario');
            if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
            this.$router.push('/usuario/login')
            } 
        },
        data(){
            return{
                loading: false,
                resultadoOperacion: '',
                erroresForm: [],
                disabled: false,
            	empresa: {
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    rut: '',
                },
                errorDisponibilidad: '',
                alerta: false,
                informacion: false,
            }
        },
        methods: {
            verificarDisponibilidad() {
                if(this.empresa.rut != '' && this.empresa.rut != this.rutOriginal ){
                    axios.get(`${process.env.BASE_URL}/api/cliente/existe-empresa`, {
                        params: {
                        rut: this.empresa.rut,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Ya existe una empresa registrada con ese rut.";
                            } else {
                                this.errorDisponibilidad = "Rut disponible.";    
                                this.disabled = false;                              
                            }
                    })
                    .catch((error)=>{
                        this.alerta = true;
                        this.errorDisponibilidad = 'Ha surgido un error durante la verificación. Inténtelo nuevamente.';
                        console.log(error);
                        this.loading = false;
                        this.disabled = true;
                    });
                }
            },
            modificarEmpresa(){
                this.limpiarResultado();
                this.loading = true;
                if(this.checkForm()){
                    var params = this.empresa;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/cliente/modificar-empresa`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5204){
                                this.resultadoOperacion = "Empresa agregada satisfactoriamente.";
                                this.informacion = true;
                                this.limpiarCajas();
                                this.$router.push({ name: 'PrincipalCliente', params: { resultadoOperacion: "Empresa modificada satisfactoriamente." }});                                                                                            
                            } else if (res.data.resultado == 5205){
                                this.alerta = true;
                                this.resultadoOperacion = "Ya existe una empresa con ese rut.";
                            }else{
                                this.alerta = true;
                                this.resultadoOperacion = "Hubo un error durante el proceso. Vuelve a intentarlo. Si persiste el problema, contacta al soporte.";
                            }
                        })
                        .catch((error)=>{
                            this.alerta = true;
                            this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                            console.log(error);
                            this.loading = false;
                    });
                    this.loading = false;
                }
            },
            limpiarResultado(){
                this.resultadoOperacion = '';
                this.alerta = false;
                this.informacion = false;
            },
            limpiarCajas(){
                this.empresa.nombre = '',
                this.empresa.direccion = '',
                this.empresa.telefono = '',
                this.empresa.rut = '',
                this.errorDisponibilidad = '';
            },
            checkForm() {
                if (this.empresa.nombre && this.empresa.direccion && this.empresa.telefono && this.empresa.rut) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.empresa.nombre) {
                    this.erroresForm.push('Razón Social Requerida.');
                }
                if (!this.empresa.direccion) {
                    this.erroresForm.push('Dirección Requerida.');
                }
                if (!this.empresa.telefono) {
                    this.erroresForm.push('Teléfono Requerido.');
                }
                if (!this.empresa.rut) {
                    this.erroresForm.push('Rut Requerido.');
                }

                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
