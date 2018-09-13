<template>
    <div>
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Modificar puesto</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="modificarPuesto()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>

                    
                    <multi-select v-model="puesto.empleado" placeholder="Empleados"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="empleados" :option-height="104" :custom-label="customLabelEmpleados" :show-labels="false">
                        
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <span class="option__title">{{ props.option.nombre }} {{props.option.apellido}}</span>
                                <br>
                                <span class="option__small">{{ props.option.documento }}</span>
                            </div>
                        </template>
                    </multi-select>
                    <small id="empleadoDisponibilidad" class="form-text textMutedCustom">{{ errorDisponibilidad }}</small>   
                    <br> 
                    <div class="form-group">
                        <label for="fechaI" class="darkTextCustom">Rol</label>
                        <input type="text" disabled="true" class="form-control border-success" v-model="puesto.rol.nombre" id="fechaI" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="fechaI" class="darkTextCustom">Inicio</label>
                        <input type="text" disabled="true"  class="form-control border-success" v-model="puesto.inicio" id="fechaI" placeholder="2019-12-05">
                    </div>
                    <div class="form-group">
                        <label for="fechaF" disabled="true" class="darkTextCustom">Fin</label>
                        <input type="text" disabled="true" class="form-control border-success" v-model="puesto.fin" id="fechaF" placeholder="2019-12-05">
                    </div>

                    <input type="submit" :disabled="disabled" value="Modificar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Multiselect from 'vue-multiselect'

	 export default {
        name: 'EditarPuesto',
            components: { 'multi-select': Multiselect,                      
        },
        mounted(){
            this.loading = true;
            this.puesto = this.$route.params.puesto; 
            this.cargarEmpleados();

            
            console.log("puesto");
            console.log(this.puesto);
            this.loading = false;
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
                errorDisponibilidad: '',
                empleados: [],
                puesto: {
                    id: 0,
                    inicio: '',
                    fin: '',
                    rol: {
                        id: 0,
                        nombre: '',
                        descripcion: '',
                    },
                    empleado: null,
                    estado: 0,
                    tipo: 0,
                    idTurno: 0,
                },
            }
        },
        methods: {
            customLabelEmpleados ({ nombre, apellido, documento }) {
                return `${nombre} ${apellido} – ${documento}`
            },
            cargarEmpleados(){
                axios.get(`${process.env.BASE_URL}/api/turno/lista-empleados-por-rol`, {
                    params: {
                        condiciones: {
                            orden: 'DESC',
                            tamanoPagina: 100,
                            indicePagina: 0,
                            campo: 'nombre_rol',
                            valor: this.puesto.rol.id.toString(),
                        },
                    }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.empleados = res.data.listaEmpleados;
                    }
                    this.loading = false;
        	    });         
            },
            modificarPuesto(){
                this.loading = true;

                if(this.checkForm()){
                    var params = this.puesto;
                    console.log(params);
                    
                    axios.post(`${process.env.BASE_URL}/api/turno/modificar-puesto`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5804){
                                this.$router.push({ name: 'PrincipalTurno', params: { resultadoOperacion: "Turno modificado satisfactoriamente." }});                            
                                this.limpiarCajas();    
                            } else if (res.data.resultado == 5805){
                                this.resultadoOperacion = "Error en modificación.";
                            }
                        }); 
                    this.loading = false;
                }
            },
            limpiarCajas(){
                errorDisponibilidad: '';
            },
            checkForm() {
                if (this.puesto != null && this.puesto.empleado != null) {
                    return true;
                }

                this.erroresForm = [];
                
                if (!this.puesto) {
                    this.erroresForm.push('Debe elegir un puesto a modificar.');
                } 
                if(!this.puesto.empleado){
                    this.erroresForm.push('Debe seleccionar un empleado asignado.');
                }
                this.disabled = false;
                return false;
            },
        verificarDisponibilidad() {
                this.errorDisponibilidad = "Verificando...";
                if(this.puesto.inicio && this.puesto.fin){
                    axios.get(`${process.env.BASE_URL}/api/turno/esta-empleado-ocupado`, this.puesto)
                        .then((res)=>{
                            console.log(res);
                            if(res.data.existe == true || res.data.resultado == '3100'){
                                this.disabled = true;
                                this.errorDisponibilidad = "El empleado ya tiene un puesto asignado en ese turno.";
                            } else if (res.data.existe == false || res.data.resultado == '3101'){
                                this.errorDisponibilidad = "";    
                                this.disabled = false;                              
                            }
                            else{
                                this.errorDisponibilidad = "Hubo un error en la verificación, recargue la página e inténtelo nuevamente."
                                this.disabled = true;
                            }
                    });
                }
            },
        },    
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>