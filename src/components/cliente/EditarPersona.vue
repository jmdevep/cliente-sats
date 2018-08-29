<template>
    <div>

        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Editar Persona</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarPersona()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Nombre Completo</label>
                        <input type="text" class="form-control border-success" v-model="persona.nombre" id="nombre" placeholder="Nombre">
                    </div>
                    <div class="form-group">
                        <label for="direccion" class="darkTextCustom">Dirección</label>
                        <input type="text" class="form-control border-success" v-model="persona.direccion" id="direccion" placeholder="Dirección">
                    </div>
                    <div class="form-group">
                        <label for="telefono" class="darkTextCustom">Teléfono</label>
                        <input type="text" class="form-control border-success" v-model="persona.telefono" id="telefono" placeholder="Teléfono">
                    </div>
                    <div class="form-group">
                        <label for="documento" class="darkTextCustom">Documento</label>
                        <input type="text" @blur="verificarDisponibilidad()" class="form-control border-success" v-model="persona.documento" id="documento" placeholder="Documento">
                        <small id="emailHelp" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>
                    </div>
                    <div class="form-group">
                        <label for="fechaNacimiento" class="darkTextCustom">Fecha de Nacimiento</label>
                        <input type="date" class="form-control border-success" v-model="persona.fechaNacimiento" id="fechaNacimiento" placeholder="2019-12-05">
                    </div>
                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'EditarPersona',
        mounted(){
            this.persona = this.$route.params.persona;
            this.documentoOriginal = this.$route.params.persona.documento;
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
            	persona: {
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    documento: '',
                    fechaNacimiento: '',
                },
                errorDisponibilidad: '',
                documentoOriginal: '',
            }
        },
        methods: {
            verificarDisponibilidad() {
                if(this.persona.documento != '' && this.persona.documento != this.persona.documentoOriginal){
                    axios.get('http://localhost:4567/api/cliente/existe-persona', {
                        params: {
                            rut: this.persona.documento,
                        }
                    })
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true){
                                this.disabled = true;
                                this.errorDisponibilidad = "Ya existe una persona registrada con ese documento.";
                            } else {
                                this.errorDisponibilidad = "Documento disponible.";    
                                this.disabled = false;                              
                            }
                    });
                }
            },
            registrarPersona(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.persona;
                    console.log(params);
                    axios.post('http://localhost:4567/api/cliente/modificar-persona', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5304){
                            this.$router.push({ name: 'PrincipalCliente', params: { resultadoOperacion: "Empresa modificada satisfactoriamente." }});                            
                                this.limpiarCajas();
                            } else {
                                this.resultadoOperacion = "Error";
                            }
                        });
                    this.loading = false;
                }
            },
            limpiarCajas(){
                this.persona.nombre = '',
                this.persona.direccion = '',
                this.persona.telefono = '',
                this.persona.documento = '',
                this.errorDisponibilidad = '';
                this.persona.fechaNacimiento = '';
            },
            checkForm() {
                if (this.persona.nombre && this.persona.direccion && this.persona.telefono && this.persona.documento && this.persona.fechaNacimiento) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.persona.nombre) {
                    this.erroresForm.push('Razón Social Requerida.');
                }
                if (!this.persona.direccion) {
                    this.erroresForm.push('Dirección Requerida.');
                }
                if (!this.persona.telefono) {
                    this.erroresForm.push('Teléfono Requerido.');
                }
                if (!this.persona.documento) {
                    this.erroresForm.push('Documento Requerido.');
                }
                if (!this.persona.fechaNacimiento) {
                    this.erroresForm.push('Fecha de Nacimiento Requerida.');
                }

                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
