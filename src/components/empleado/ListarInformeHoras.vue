<template>
    <div>
        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
                <div class="table-responsive">
                    <table class="table">
                        <caption class="captionCustom"><h3>Informe de horas no médicos</h3></caption>
                        <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                        <thead class="greenBackground">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                                <th scope="col">Documento</th>
                                <th scope="col" title="Horas diurnas">Horas D</th>
                                <th scope="col" title="Horas nocturnas">Horas N</th>
                                <th scope="col" title="Horas extra">Horas E</th>
                                <th scope="col" title="Horas retén">Horas R</th>
                                <th scope="col" title="Horas feriado diurnas">Horas F D</th>
                                <th scope="col" title="Horas feriado nocturnas">Horas F N</th>
                                <th scope="col" title="Viáticos mayores a 400km">Viáticos +</th>
                                <th scope="col" title="Viáticos menores a 400km">Viáticos -</th>
                            </tr>
                        </thead>
                        <tbody class="tableBodyBackground">
                            <tr v-for="(informe, index) in informes" :key="index">
                                <template v-if="informe.resumen.rol.id != 4">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ informe.empleado.nombre }}</td>
                                    <td>{{ informe.empleado.apellido }}</td>
                                    <td>{{ informe.empleado.documento }}</td>
                                    <td>{{ informe.resumen.datosGenerales[0] }}</td>
                                    <td>{{ informe.resumen.datosGenerales[1] }}</td>
                                    <td>{{ informe.resumen.datosGenerales[2] }}</td>
                                    <td>{{ informe.resumen.datosGenerales[3] }}</td>
                                    <td>{{ informe.resumen.datosGenerales[4] }}</td>
                                    <td>{{ informe.resumen.datosGenerales[5] }}</td>
                                    <td>{{ informe.resumen.datosGenerales[6] }}</td>
                                    <td>{{ informe.resumen.datosGenerales[7] }}</td>
                                    <td>
                                        
                                    </td>
                                </template>
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
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Informe de horas médicos</h3></caption>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Documento</th>
                            <th scope="col" title="Horas diurnas">Horas D</th>
                            <th scope="col" title="Horas nocturnas">Horas N</th>
                            <th scope="col" title="Horas feriado diurnas">Feriado D</th>
                            <th scope="col" title="Horas feriado nocturnas">Feriado N</th>
                            <th scope="col" title="Viáticos en km">Viáticos km</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(informe, index) in informes" :key="index">
                            <template v-if="informe.resumen.rol.id == 4">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ informe.empleado.nombre }}</td>
                                <td>{{ informe.empleado.apellido }}</td>
                                <td>{{ informe.empleado.documento }}</td>
                                <td>{{ informe.resumen.datosGenerales[0] }}</td>
                                <td>{{ informe.resumen.datosGenerales[1] }}</td>
                                <td>{{ informe.resumen.datosGenerales[2] }}</td>
                                <td>{{ informe.resumen.datosGenerales[3] }}</td>
                                <td>{{ informe.resumen.datosGenerales[4] }}</td>
                           </template>
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
        name: 'ListarInformeHoras',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion || '';        

            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/empleado/generar-informe-horas-trabajadas`, {
                params: {
                    condiciones: {
                        inicio: this.inicio,
                        fin: this.fin,
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.informes = res.data.informes;
                        /*if(res.data.cantidadElementos <= this.tamanoPagina){
                            this.cantidadPaginas = 1;
                        } else {
                            this.cantidadPaginas = Math.ceil( res.data.informes.length / this.tamanoPagina);                            
                        }*/
                        this.cantidadPaginas = 1;
                        console.log(this.cantidadPaginas);
                        this.indexActual = 1;
                    }
                    this.loading = false;
        	});

        	},
        data(){
            return{
                resultadoOperacion: '',
                informes: [],
                tamanoPagina: 2,
                indicePagina: 0,
                cantidadPaginas: 0,
                indexActual: 0,
                inicio: '2018-08-01 00:00:00',
                fin: '2018-09-30 23:59:59',
            }

        },
        methods: {
            cargarDatos(index){
                this.loading = true;
                console.log(index);
                axios.get(`${process.env.BASE_URL}/api/empleado/generar-informe-horas-trabajadas`, {
                params: {
                    condiciones: {
                        inicio: this.inicio,
                        fin: this.fin,
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.informes = res.data.informes;
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
