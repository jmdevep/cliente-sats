<template>
    <div>
        <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
        <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
        <i v-show="loading" class="fa fa-spinner fa-spin"></i>   
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    
                    <caption class="captionCustom"><h3>Lista de empleados {{puesto.rol.nombre}} disponibles</h3></caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Documento</th>                      
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(empleado, index) in empleados" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ empleado.id }}</td>
                            <td>{{ empleado.nombre }}</td>
                            <td>{{ empleado.apellido }}</td>
                            <td>{{ empleado.documento }}</td>
                            <td>
                                <b-btn class="btn btn-success" @click="gestionarIntercambio(empleado);">Elegir</b-btn>                              
                            </td>
 
                        </tr>
                    </tbody>
                </table>
                <ul class="pagination">
                    <li class="page-item" v-bind:class="{ 'disabled' : (indexActual==1) }">
                    <a @click="cargarAnterior()" class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Anterior</span>
                    </a>
                    </li> 
                    <li class="page-item" v-bind:class="{ 'disabled' : (index==indexActual) }" v-for="index in cantidadPaginas" :key="index"><a @click="cargarDatos(index)" class="page-link" href="#">{{ index }}</a></li>
                    <li class="page-item"  v-bind:class="{ 'disabled' : (indexActual==cantidadPaginas) }">
                    <a @click="cargarSiguiente()" class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Siguiente</span>
                    </a>
                    </li>
                </ul>
            </div>
        </div>
        <b-modal id="intercambioModal" v-model="mostrarModal" ref="intercambioModal" title="Intercambiar turno">
            <i v-show="loading" class="fa fa-spinner fa-spin"></i>
            <p class="my-4">Presione el botón "Aceptar" si desea intercambiar su turno con {{intercambio.empleadoIntercambio.nombre}} {{intercambio.empleadoIntercambio.apellido}}. Si no, cierre este mensaje.</p>
            <div slot="modal-footer" class="w-100">
                <p class="float-left"></p>
                <b-btn size="sm" id="btnIntercambiarConfirmar"  class="float-right" variant="primary" @click="intercambiarTurno(); mostrar=false">
                    Aceptar
                </b-btn>
            </div>
        </b-modal>
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'IntercambiarTurno',
        mounted(){
            this.puesto = this.$route.params.puesto;

            this.resultadoOperacion = this.$route.params.resultadoOperacion || '';        
            var params = {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: 1000,
                        indicePagina: this.indicePagina,
                        campo: 'nombre',
                        valor: this.puesto.rol.id,
                    },
                    puesto: this.puesto
                };
            console.log(params);
            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/empleado/lista-empleados-intercambio`, {
                params
            })
            .then((res)=>{
                console.log(res);
                if(res.data.resultado == 100){
                    this.empleados = res.data.listaEmpleados;
                    if(res.data.cantidadElementos == 0){
                        this.resultadoOperacion = "No hay empleados con los que realizar intercambio."
                        this.alerta = true;
                    }
                    else if(res.data.cantidadElementos <= this.tamanoPagina){
                        this.cantidadPaginas = 1;
                    } else {
                        this.cantidadPaginas = Math.ceil( res.data.cantidadElementos / this.tamanoPagina);                            
                    }
                    console.log(this.cantidadPaginas);
                    this.indexActual = 1;
                }
                this.loading = false;
            })
                .catch((error)=>{
                    this.alerta = true;
                    this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                    console.log(error);
                    this.loading = false;
                    this.listaEmpleados = [];
            });
        	},
        data(){
            return{
                resultadoOperacion: '',
                empleados: [],
                tamanoPagina: 2,
                indicePagina: 0,
                cantidadPaginas: 0,
                indexActual: 0,
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
                intercambio:{
                    id:0,
                    puestoViejo: {
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
                    empleadoIntercambio:{
                        nombre: '',
                        apellido: '',
                        documento: '',
                        fechaNacimiento: '',
                        domicilio: '',
                        telefono: '',
                        vencimientoCarnetSalud: '',
                        vencimientoCarnetChofer: '',
                    },
                    estado: 0,
                },
                alerta: false,
                informacion: false,
                mostrarModal: false,
            }

        },
        methods: {
            cargarDatos(index){
                this.loading = true;
                console.log(index);
                axios.get(`${process.env.BASE_URL}/api/empleado/lista-empleados-intercambio`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: 1000,
                        indicePagina: index -1,
                        campo: 'nombre',
                    },
                }
                })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.empleados = res.data.listaEmpleados;
                        this.indexActual = index;
                    }
                    this.loading = false;
        	    });
            },
            gestionarIntercambio(empleado){
                this.intercambio.empleadoIntercambio = empleado;
                this.intercambio.puestoViejo = this.puesto;
                this.mostrarModal = true;
            },
            intercambiarTurno(empleado){
                this.loading = true;

                if(this.checkForm()){
                    var params = this.intercambio;
                    console.log(params);
                    
                    axios.post(`${process.env.BASE_URL}/api/turno/crear-intercambio`, params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 3121){
                                this.$router.push({ name: 'PrincipalTurno', params: { resultadoOperacion: "Intercambio creado satisfactoriamente." }});                            
                                this.limpiarCajas();    
                            } else if (res.data.resultado == 3120){
                                this.resultadoOperacion = "Error creando intercambio.";
                            }
                        }); 
                    this.loading = false;
                }
            },
            checkForm() {
                if (this.puesto != null && this.puesto.empleado != null && this.intercambio.empleadoIntercambio) {
                    return true;
                }

                this.erroresForm = [];
                
                if (!this.puesto) {
                    this.erroresForm.push('Debe elegir un puesto a modificar.');
                } 
                if(!this.puesto.empleado){
                    this.erroresForm.push('Debe seleccionar un empleado asignado.');
                }
                if(!this.intercambio.empleadoIntercambio){
                    this.erroresForm.push('Debe seleccionar un empleado al cual intercambiar.');
                }
                this.disabled = false;
                return false;
            },
            cargarSiguiente(){
                this.cargarDatos(this.indexActual + 1);
            },
            cargarAnterior(){
                this.cargarDatos(this.indexActual - 1);
            }   
        },    
    }
</script>
