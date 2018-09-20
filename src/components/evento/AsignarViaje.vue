<template>
    <div>
    
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Traslado </div>
            <div class="card-body darkTextCustom">
                <template v-if="!existeViaje">
                    <p>Este evento no tiene un traslado registrado.</p>
                    <button @click="toggleForm()" class="btn marginBefore tableHeadingBackground">
                        {{ mostrarForm ? "Cancelar" : "Ingresar Traslado"}}
                    </button>
                </template>
                <template v-else>
                    <button @click="disabled = !disabled" class="btn marginBefore tableHeadingBackground">
                        {{ disabled ? "Editar" : "Cancelar " }}
                    </button>
                </template>
                <template v-if="mostrarForm">
                    <form v-on:submit.prevent="registrarViaje()">
                        <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                        <p v-if="erroresForm.length">
                            <b>Por favor corrija lo siguiente:</b>
                            <ul>
                                <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                            </ul>
                        </p>
                        <p v-if="resultadoOperacion">{{ resultadoOperacion }}</p>

                        <p>Insitución que solicita el traslado </p>
                        <multi-select :disabled="disabled" v-model="viaje.solicitante" placeholder="Institución solicitante"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="prestadores" :option-height="104" :custom-label="customLabelPrestadores" :show-labels="false">
                            
                            <template slot="option" slot-scope="props">
                                <div class="option__desc">
                                    <span class="option__title">Nombre: {{ props.option.nombreDescriptivo }}</span>
                                </div>
                            </template>
                        </multi-select>

                        <br>
                        <p>Tramos </p>

                        <multi-select :disabled="disabled" v-model="tramoSeleccionado" @select="cambioSelect" placeholder="Tramos"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="tramos" :option-height="104" :custom-label="customLabelTramos" :show-labels="false">
                            
                            <template slot="option" slot-scope="props">
                                <div class="option__desc">
                                    <span class="option__title">Origen: {{ props.option.localidadOrigen.nombre }}</span>
                                    <br>
                                    <span class="option__small">Destino: {{ props.option.localidadDestino.nombre }}</span>
                                </div>
                            </template>
                        </multi-select>

                        <br> 

                        <template v-if="viaje.listaTramos != null && viaje.listaTramos.length">
                            <p>
                                <b>Tramos Seleccionados:</b>
                            </p>
                            <div class="list-group">
                                <a v-for="(tramo, index) in viaje.listaTramos" :key="index" href="#" class="list-group-item lista-tramos list-group-item-action flex-column align-items-start list-group-flush no-pointer">
                                    <div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">Origen: {{ tramo.localidadOrigen.nombre }}</h5>
                                        <template v-if="!disabled">
                                            <small class="small-x-large"><a href="#" @click="removerTramo(tramo)"><i class="fas fa-trash"></i></a></small>
                                        </template>
                                    </div>
                                    <p class="mb-1">Destino: {{ tramo.localidadDestino.nombre }} </p>
                                    <small>Cantidad de kilómetros: {{ tramo.cantidadKm }}</small>
                                </a>
                            </div>
                        </template>
                        <template v-if="!disabled">
                            <input type="submit" value="Actualizar Traslado" class="btn marginBefore tableHeadingBackground">
                        </template>
                    </form>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Multiselect from 'vue-multiselect'

	 export default {
        name: 'AsignarViaje',
        components: { 'multi-select': Multiselect },                           
        mounted(){
            this.evento = this.$route.params.evento;
            
            this.loading = true;    

            this.cargarViaje();
            this.viaje.fechaInicio = this.evento.inicioEvento;
            this.viaje.fechaFin = this.evento.finEvento;
            this.cargarPrestadores();
            this.cargarTramos();
           

        	},
        data(){
            return{
                mostrarForm: false,
                existeViaje: false,
                evento: null,
                loading: false,
                resultadoOperacion: null,
                erroresForm: [],
                disabled: false,
                tramoSeleccionado: null,
                tramos: [],
                prestadores: [],
                viaje: {
                    listaTramos: null,
                    solicitante: null,
                    fechaInicio: null,
                    fechaFin: null,
                },
                disabled: true
            }
        },
        methods: {
            toggleForm(){
                this.mostrarForm = !this.mostrarForm;
                this.disabled = !this.disabled;
            },
            cargarTramos(){
                axios.get(`${process.env.BASE_URL}/api/tramo/lista-tramos`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.tramos = res.data.listaTramos;
                        this.tramos.forEach(function(obj) { obj.$isDisabled = false; });
                        
                    }
                    this.loading = false;
                });
            },
            cargarViaje(){
                axios.get(`${process.env.BASE_URL}/api/evento/buscar-viaje`, {
                params: {
                    evento: {
                        id: this.evento.id
                    },
                }
                })
        		.then((res)=>{
                    console.log(res);
                    console.log(res.data.viaje)
                    if(res.data.resultado == 5950){
                        this.viaje = res.data.viaje;
                        this.existeViaje = true;
                        this.mostrarForm = true;
                        this.viaje.listaTramos.forEach( tramo => {
                            this.tramos.forEach( t => {
                                if(tramo.id == t.id){
                                    t.$isDisabled = true;
                                }
                            });
                        });
                    }
                });
                console.log(this.viaje);
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

            cambioSelect(option){
                if(this.viaje.listaTramos == null){
                    this.viaje.listaTramos = [];
                }
                console.log(option);
                this.viaje.listaTramos.push(option);
                var indexRol = this.tramos.findIndex((t => t.id == option.id));
                this.tramos[indexRol].$isDisabled = true;
            },
            removerTramo(pTramo){
                this.viaje.listaTramos = this.viaje.listaTramos.filter(t => t.id != pTramo.id);
                var indexRol = this.tramos.findIndex((t => t.id == pTramo.id));
                this.tramos[indexRol].$isDisabled = false;
                this.tramoSeleccionado = null;
            },
            customLabelTramos ({ localidadOrigen, localidadDestino }) {
                return `${localidadOrigen.nombre } – ${localidadDestino.nombre }`
            },
            customLabelPrestadores ({ nombreDescriptivo }) {
                return `${ nombreDescriptivo } `
            },
            registrarViaje(){
                var params =  {
                    id: this.evento.id,
                    viaje: this.viaje,
                }
                console.log(params);
                
                this.loading = true;
                if(this.checkForm()){
                   
                    axios.post(`${process.env.BASE_URL}/api/evento/asignar-viaje`, params) 
                        .then((res)=>{
                            console.log(res); 
                            if(res.data.resultado == 5952){
                                this.resultadoOperacion = "Actualización traslado existosa.";
                                this.limpiarCajas();
                            } else if(res.data.resultado == 5953){
                                this.resultadoOperacion = "Error 0004, por favor comunicarse con soporte."
                            }
                        });  
                }
                this.loading = false;
            },
            limpiarCajas(){
                

            },
            limpiarMensajes(){
                this.resultadoOperacion = "";
                this.erroresForm = [];
            },
            checkForm() {
                return true;
                this.limpiarMensajes();
                if (this.empleado.nombre && this.empleado.apellido && this.empleado.documento && this.empleado.fechaNacimiento && this.empleado.domicilio
                    && this.empleado.telefono ) {
                    return true;
                }

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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.lista-tramos{
    width: fit-content;
    min-width: 60%;
}

.no-pointer{
    cursor: default;
}

.small-x-large{
    font-size: larger;
}
</style>
