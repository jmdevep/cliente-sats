<template>
    <div>
        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    
                    <caption class="captionCustom"><h3>Lista de Eventos</h3></caption>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Inicio</th>
                            <th scope="col">Direccion</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Tipo Evento</th>
                            <th scope="col">Servicio</th>
                            <th scope="col">Paciente</th>
                            <th scope="col">Prestador</th>                            
                            <th scope="col">Finaliza</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(evento, index) in eventos" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ evento.inicioEvento }}</td>
                            <td>{{ evento.direccion }}</td>
                            <td>{{ evento.estado.nombre }}</td>
                            <td>{{ evento.tipo.nombre }}</td>
                            <td>{{ evento.servicio.nombre }}</td>
                            <td>{{ evento.persona.nombre }}</td>
                            <template v-if="evento.persona.prestador">
                                <td>{{ evento.persona.prestador.nombreDescriptivo }}</td>
                            </template>
                            <template v-else>
                                <td>Prestador no definido</td>
                            </template>
                            
                            <td>{{ evento.finEvento }}</td>
                            <router-link :to="{ name: 'EditarEvento', params: { evento: evento }}"><a href="#" class="btn btn-info" role="button">Editar</a></router-link>
                            <router-link :to="{ name: 'EliminarEvento', params: { evento: evento }}"><a href="#" class="btn btn-danger" role="button">Eliminar</a></router-link>                                                           
                            <router-link :to="{ name: 'AsignarEmpleadosEvento', params: { evento: evento }}"><a href="#" class="btn btn-danger" role="button">Empleados Asignados</a></router-link>                                                           
                            <router-link :to="{ name: 'AsignarViaje', params: { evento: evento }}"><a href="#" class="btn btn-danger" role="button">Traslado</a></router-link>                                                                                       
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
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'ListadoEvento',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion || '';        

            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/evento/lista-eventos`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'nombre',
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.eventos = res.data.listaEventos;
                        if(res.data.cantidadElementos <= this.tamanoPagina){
                            this.cantidadPaginas = 1;
                        } else {
                            this.cantidadPaginas = Math.ceil( res.data.cantidadElementos / this.tamanoPagina);                            
                        }
                        console.log(this.cantidadPaginas);
                        this.indexActual = 1;
                    }
                    this.loading = false;
        	});

        	},
        data(){
            return{
                resultadoOperacion: '',
                empleados: [],
                eventos: [],
                tamanoPagina: 2,
                indicePagina: 0,
                cantidadPaginas: 0,
                indexActual: 0,
            }

        },
        methods: {
            cargarDatos(index){
                this.loading = true;
                console.log(index);
                axios.get(`${process.env.BASE_URL}/api/empleado/lista-empleados`, {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
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
            cargarSiguiente(){
                this.cargarDatos(this.indexActual + 1);
            },
            cargarAnterior(){
                this.cargarDatos(this.indexActual - 1);
            }   
        },    
    }
</script>
