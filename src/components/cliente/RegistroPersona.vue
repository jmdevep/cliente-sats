<template>
    <div>

        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Persona</div>
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
                    <div class="form-group">
                        <label for="sexos">Seleccione el género</label>
                        <select id="sexos" class="form-control" v-model="persona.sexo">
                            <option value="" selected> 
                                Sin seleccionar
                            </option>
                            <option value="M" selected> 
                                Masculino
                            </option>
                            <option value="F" selected> 
                                Femenino
                            </option>
                        </select>
                    </div>
                    <p>Prestador de Salud: </p>
                    <multi-select v-model="persona.prestador" placeholder="Prestador de Salud"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="prestadores" :option-height="104" :custom-label="customLabelPrestadores" :show-labels="false">    
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">Nombre: {{ props.option.nombreDescriptivo }}</span>
                            </div>
                        </template>
                    </multi-select>

                    <input type="submit" :disabled="disabled" value="Registrar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Multiselect from 'vue-multiselect';
    
	 export default {
        name: 'RegistroPersona',
        components: { 'multi-select': Multiselect,                      
        }, 
        mounted(){
            this.loading = true;
            this.cargarPrestadores();
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
                disabled: true,
            	persona: {
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    documento: '',
                    fechaNacimiento: '',
                    sexo: '',
                    prestador: null
                },
                errorDisponibilidad: '',
                prestadores: [],
            }

        },
        methods: {
            verificarDisponibilidad() {
                if(this.persona.documento != ''){
                    axios.get(`${process.env.BASE_URL}/api/cliente/existe-persona`, {
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
            customLabelPrestadores ({ nombreDescriptivo }) {
                return `${ nombreDescriptivo } `
            },
            cargarPrestadores(){
                axios.get(`${process.env.BASE_URL}/api/cliente/lista-prestadores`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.prestadores = res.data.prestadores;
                    }
                    this.loading = false;
                });
            },
            registrarPersona(){
                this.loading = true;
                if(this.checkForm()){
                    var params = this.persona;
                    console.log(params);
                    axios.post(`${process.env.BASE_URL}/api/cliente/agregar-persona`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5302){
                                this.resultadoOperacion = "Persona agregada satisfactoriamente.";
                                this.limpiarCajas();
                            } else if (res.data.resultado == 1100){
                                this.resultadoOperacion = "Ya existe una persona con ese documento.";
                            }
                        });
                }
                this.loading = false;
            },
            limpiarCajas(){
                this.persona = {
                    nombre: '',
                    direccion: '',
                    telefono: '',
                    documento: '',
                    fechaNacimiento: '',
                    sexo: '',
                    prestador:{
                        id: 0,
                        nombreDescriptivo: '',
                        activo: 0,
                        esConvenio: false,
                    }
                };
                this.errorDisponibilidad = '';
            },
            validarDocumento(documento){
                var verificador = documento[documento.length - 1];
                var aux = 0;
                var i = 0;
                if(documento.length <= 6){
                    for(i = documento.length; i < 7; i++){
                        documento = '0' + documento;
                    }
                }
                for(i = 0; i < 7; i++){
                    aux += (parseInt("2987634"[i]) * parseInt(documento[i])) % 10;
                }
                if(aux%10 === 0){
                    return 0 == verificador;
                }else{
                    return (10 - aux % 10) == verificador;
                }
            },
            esFechaMenorAActual(fecha){
                return this.convertirStringAFecha(fecha) <= new Date();
            },
            convertirStringAFecha(fecha) {
                var laFecha = new Date(fecha);
                return laFecha;
            },
            contieneSoloNumeros(texto){
                var reg = new RegExp('^\\d+$');
                return reg.test(texto);
            },
            checkForm() {
                if (this.persona.nombre && this.persona.direccion && this.persona.telefono && !isNaN(this.persona.telefono) && this.persona.documento && this.persona.fechaNacimiento && this.esFechaMenorAActual(this.persona.fechaNacimiento) && this.persona.sexo && !isNaN(this.persona.documento) && this.validarDocumento(this.persona.documento)) {
                    return true;
                }

                this.erroresForm = [];
                if(this.persona.fechaNacimiento && !this.esFechaMenorAActual(this.persona.fechaNacimiento)){
                    this.erroresForm.push('La fecha de nacimiento no puede ser futura.');
                }
                if (!this.persona.nombre) {
                    this.erroresForm.push('Nombre requerido.');
                }
                if (!this.persona.direccion) {
                    this.erroresForm.push('Dirección requerida.');
                }
                if (!this.persona.telefono) {
                    this.erroresForm.push('Teléfono requerido.');
                }
                if (!this.persona.documento) {
                    this.erroresForm.push('Documento requerido.');
                }
                else if(!contieneSoloNumeros(this.persona.documento)){
                    console.log(contieneSoloNumeros(this.persona.documento));
                    this.erroresForm.push('El documento debe ser numérico, sin guiones ni puntos.');
                }
                else{
                    this.erroresForm.push('El documento no concuerda con el formato de la cédula nacional.');
                }
                if (!this.persona.fechaNacimiento) {
                    this.erroresForm.push('Fecha de nacimiento requerida.');
                }
                if(!this.persona.sexo){
                    this.erroresForm.push('Género requerido.');
                }
                this.disabled = false;
                return false;
            }
        },    
    }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
