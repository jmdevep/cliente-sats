<template>
    <div>

        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Tramos</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarTramo()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    <label>Seleccionar localidad de Origen:</label>
                    <select class="form-control" v-model="tramo.localidadOrigen" @change="cambioSelectOrigen()">
                        <option v-for="(localidad,index) in localidades" :key="index" :disabled="localidad.disabled" v-bind:value="localidad">
                            {{ localidad.nombre }}
                        </option>
                    </select>
                    <p v-if="tramo.localidadOrigen">
                        <b>Origen Seleccionado:</b>

                            {{ tramo.localidadOrigen.nombre }} 
                                <a href="#" @click="removerLocalidadOrigen()">
                                    - <i class="fas fa-trash-alt"></i></a>
                    </p>
                    <label>Seleccionar localidad de Destino:</label>
                    <select class="form-control" v-model="tramo.localidadDestino" @change="cambioSelectDestino()">
                        <option v-for="(localidad,index) in localidades" :disabled="localidad.disabled" :key="index" v-bind:value="localidad">
                            {{ localidad.nombre }}
                        </option>
                    </select>
                    <p v-if="tramo.localidadDestino">
                        <b>Destino Seleccionado:</b>

                            {{ tramo.localidadDestino.nombre }} 
                                <a href="#" @click="removerLocalidadDestino()">
                                    - <i class="fas fa-trash-alt"></i></a>
                    </p>
                    <div class="form-group">
                        <label for="nombre" class="darkTextCustom">Cantidad de Kilómetros</label>
                        <input type="number" class="form-control border-success" v-model="tramo.cantidadKm" id="cantidadKm" placeholder="Cantidad km">
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
        name: 'RegistroTramo',
        mounted(){
            this.loading = true;
                       axios.get('https://servidor-sats.herokuapp.com/api/localidad/lista-localidades', {
                params: {

                }
            })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.localidades = res.data.listaLocalidades;
                        this.localidades.forEach(function(obj) { obj.disabled = false; });
                    }
                    this.loading = false;
        	});
            
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
            	localidades: [],
                errorDisponibilidad: '',
                tramo: {
                    localidadOrigen: null,
                    localidadDestino: null,
                    cantidadKm: null
                },
            }
        },
        methods: {
            cambioSelectOrigen() {
                var indexRol = this.localidades.findIndex((x => x.id == this.tramo.localidadOrigen.id));
                this.localidades[indexRol].disabled = true;
            },
            cambioSelectDestino() {
                var indexRol = this.localidades.findIndex((x => x.id == this.tramo.localidadDestino.id));
                this.localidades[indexRol].disabled = true;
            },
            removerLocalidadOrigen(){
                var index = this.localidades.findIndex((x => x.id == this.tramo.localidadOrigen.id));
                this.localidades[index].disabled = false;
                this.tramo.localidadOrigen = null;
            },
            removerLocalidadDestino(){
                var index = this.localidades.findIndex((x => x.id == this.tramo.localidadDestino.id));
                this.localidades[index].disabled = false;
                this.tramo.localidadDestino = null;
            },
            registrarTramo(){
                this.loading = true;
                if(this.checkForm()){
                    this.tramo.localidadOrigen.disabled = undefined;
                    this.tramo.localidadDestino.disabled = undefined;
                    var params = this.tramo;
                    console.log(params);
                    axios.post('https://servidor-sats.herokuapp.com/api/tramo/agregar-tramo', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5702){
                                this.$router.push({ name: 'PrincipalTramo', params: { resultadoOperacion: "Tramo registrado satisfactoriamente." }});                                                            
                                this.limpiarCajas();
                            } else if (res.data.resultado == 5703){
                                this.resultadoOperacion = "Ya existe un tramo con esas localidades.";
                            }
                        });
                    this.loading = false;
                }
            },
            limpiarCajas(){
                this.tramo.localidadOrigen = '';
                this.tramo.localidadDestino = '';
                this.tramo.cantidadKm = 0;
                errorDisponibilidad: '';
            },
            checkForm() {
                if (this.tramo.localidadOrigen && this.tramo.localidadDestino && this.tramo.cantidadKm != 0) {
                    return true;
                }

                this.erroresForm = [];

                if (!this.tramo.localidadOrigen) {
                    this.erroresForm.push('Origen requerido.');
                }
                if (!this.tramo.localidadDestino) {
                    this.erroresForm.push('Destino requerido.');
                }
                if (!this.tramo.cantidadKm == 0) {
                    this.erroresForm.push('Cantidad de Kilómetros requerida.');
                }
                this.disabled = false;
                return false;
            }
    
        },    
    }
</script>
