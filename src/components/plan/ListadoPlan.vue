<template>
    <div>

        {{ resultadoOperacion }}
        <div class="row">
            <div class="col-sm-12">
                <table class="table">
                    <caption class="captionCustom"><h3>Lista de Planes</h3> <i v-show="loading" class="fa fa-spinner fa-spin"></i> </caption>
                    <thead class="greenBackground">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre plan</th>
                            <th scope="col">Valor cuota</th>
                            <th scope="col">Convenio</th>
                            <th scope="col">Descuento</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="tableBodyBackground">
                        <tr v-for="(plan, index) in planes" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ plan.nombre }}</td>
                            <td>{{ plan.cuota }}</td>
                            <template v-if="plan.convenio == null || plan.convenio.id == 0">
                                <td>--</td> 
                            </template>   
                            <template v-else>
                                <td>{{ plan.convenio.nombreDescriptivo }}</td>   
                            </template>
                            <template v-if="plan.descuento == null">
                                <td>--</td> 
                            </template>   
                            <template v-else>
                                <td>-{{ plan.descuento.porcentaje }}%</td>
                            </template>
                            <td>
                                <router-link :to="{ name: 'EditarPlan', params: { plan: plan }}"><a href="#" class="btn btn-info" role="button">Editar</a></router-link>
                                <router-link :to="{ name: 'EliminarPlan', params: { plan: plan }}"><a href="#" class="btn btn-danger" role="button">Eliminar</a></router-link>
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
    </div>
</template>

<script>
	import axios from 'axios';
	 export default {
        name: 'ListadoPlan',
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion;

            this.loading = true;
            axios.get('${process.env.BASE_URL}/api/cliente/lista-planes', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: this.indicePagina,
                        campo: 'nombre_plan',
                    },
                }
            })
        		.then((res)=>{
                    console.log(res);
                    
        			if(res.data.resultado == 100){
                        this.planes = res.data.planes;
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
            beforeCreate: function () {
                var usuario = this.$session.get('usuario');
                if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
                this.$router.push('/usuario/login')
                } 
        },
        data(){
            return{
                resultadoOperacion: '',
                loading: false,
                planes: [],
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
                axios.get('${process.env.BASE_URL}/api/cliente/lista-planes', {
                params: {
                    condiciones: {
                        orden: 'DESC',
                        tamanoPagina: this.tamanoPagina,
                        indicePagina: index -1,
                        campo: 'nombre_plan',
                    },
                }
                })
        		.then((res)=>{
                    console.log("SI ANDA ESTO");
                    console.log(res);
                    console.log(res.data.resultado);
        			if(res.data.resultado == 100){
                        this.planes = res.data.planes;
                        console.log(this.planes);
                        console.log(res.data.planes);
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