<template>
    <div>
        <h1 class="mainTitle">
        Informe de horas trabajadas
        </h1>
        <hr class="titleUnderline">
        <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
        <div class="row">
            <div class="col-sm-12">
                <div v-if="meses.length" class="form-group">
                    <label>Mes a consultar:</label>
                    <select :disabled="disabled" id="meses" class="form-control" v-model="mesSeleccionado" @change="cargarDatos()">
                        <option  v-for="(mes,index) in meses" :key="index" v-bind:value="mes">
                            {{ mes.textoMes }} - {{mes.anio}}
                        </option>
                    </select>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <div class="table-responsive">
                    <table class="table" id="tablaInformeHoras">
                        <caption class="captionCustom"><h3>Informe de horas</h3></caption>
                        <thead class="greenBackground">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Rol</th>
                                <th scope="col" title="Horas diurnas">D</th>
                                <th scope="col" title="Horas nocturnas">N</th>
                                <th scope="col" title="Horas extra">E</th>
                                <th scope="col" title="Horas retén">R</th>
                                <th scope="col" title="Horas feriado diurnas">F D</th>
                                <th scope="col" title="Horas feriado nocturnas">F N</th>
                                <th scope="col" title="Viáticos mayores a 400km">V +</th>
                                <th scope="col" title="Viáticos menores a 400km">V -</th>
                                <th scope="col" title="Viáticos por cantidad de KM">V KM</th>
                            </tr>
                        </thead>
                        <tbody class="tableBodyBackground">
                            <tr v-for="(informe, index) in informes" :key="index">
                                <template v-if="informe.empleado.listaRoles[0].id != 4">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ informe.empleado.nombre }}</td>
                                    <td>{{ informe.empleado.apellido }}</td>
                                    <td>{{ informe.empleado.documento }}</td>
                                    <td>{{ informe.empleado.listaRoles[0].nombre }}</td>
                                    <td>{{ informe.diurnas }}</td>
                                    <td>{{ informe.nocturnas }}</td>
                                    <td>{{ informe.extra }}</td>
                                    <td>{{ informe.reten }}</td>
                                    <td>{{ informe.feriadoDiurno }}</td>
                                    <td>{{ informe.feriadoNocturno }}</td>
                                    <td>{{ informe.viaticosMayores}}</td>
                                    <td>{{ informe.viaticosMenores }}</td>
                                    <td>{{ informe.cantidadKmViaticos }}</td>
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
<download-excel
	class   = "btn btn-default"
	:data   = "informes"
	:fields = "json_fields"
	name    = "filename.xls">

                    <input type="submit" value="Exportar como planilla" class="btn marginBefore tableHeadingBackground">

</download-excel>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import JsonExcel from 'vue-json-excel'

	 export default {
        name: 'ListarInformeHoras',
        components: {
            'downloadExcel': JsonExcel
        },
        mounted(){
            this.resultadoOperacion = this.$route.params.resultadoOperacion || '';        
            this.cargarSelectMeses();
            this.loading = true;
            axios.get(`${process.env.BASE_URL}/api/empleado/generar-informe-horas-trabajadas`, {
                params: {
                    
                    mes: this.mesSeleccionado.mes + 1,
                    
                }
            })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.informes = res.data.informes;
                        this.cantidadPaginas = 1;
                        console.log(this.cantidadPaginas);
                        this.indexActual = 1;
                    }else if(res.data.resultado == 101){
                        this.resultadoOperacion = "No hay datos para el mes seleccionado";
                        this.alerta = true;
                        this.informes = [];
                    }
                    this.loading = false;
            })
            .catch((error)=>{
                            this.alerta = true;
                            this.resultadoOperacion = 'Ha surgido un error durante el proceso. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                            console.log(error);
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
                mesSeleccionado: {
                    id: 0, 
                    mes: 0, 
                    textoMes: 'textoMes', 
                    anio: 0
                },
                meses: [],
                alerta: false,
                informacion: false,
                disabled: false,
                json_fields: {
            'Nombre': 'empleado.nombre',
            'Apellido': 'empleado.apellido',
            'Documento': 'empleado.documento',
            'Diurnas': 'diurnas',
            'Nocturnas': 'nocturnas',
            'Extras': 'extra',
            'Retén': 'reten',
            'Viáticos + 400': 'viaticosMayores',
            'Viáticos - 400': 'viaticosMenores',
            'Viáticos por cantidad': 'cantidadKmViaticos',

        },
        json_data: [],
        json_meta: [
            [
                {
                    'key': 'charset',
                    'value': 'utf-8'
                }
            ]
        ],
            }

        },
        methods: {
            cargarDatos(index){
                this.limpiarResultado();
                this.loading = true;
                this.disabled = true;
                console.log(this.mesSeleccionado.mes);
                axios.get(`${process.env.BASE_URL}/api/empleado/generar-informe-horas-trabajadas`, {
                params: {
                        mes: this.mesSeleccionado.mes + 1,
           
                }
            })
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.informes = res.data.informes;
                        this.indexActual = index;
                    }
                    else if(res.data.resultado == 101){
                        this.resultadoOperacion = "No hay datos para el mes seleccionado";
                        this.alerta = true;
                        this.informes = [];
                    }
                    this.loading = false;
                    this.disabled = false;
                })
                .catch((error)=>{
                            this.alerta = true;
                            this.resultadoOperacion = 'Ha surgido un error cargando los datos. Inténtelo nuevamente o contacte al soporte si el problema persiste.';
                            console.log(error);
                            this.loading = false;
                            this.disabled = false;
                    });
            },
            exportarExcel(){
                $("tablaInformeHoras").tableExport({
                    bootstrap: false
                });
            },
            obtenerMesDesdeNumero(numeroMes){
                switch(numeroMes){
                    case 0: return 'Enero';
                    case 1: return 'Febrero';
                    case 2: return 'Marzo';
                    case 3: return 'Abril';
                    case 4: return 'Mayo';
                    case 5: return 'Junio';
                    case 6: return 'Julio';
                    case 7: return 'Agosto';
                    case 8: return 'Setiembre';
                    case 9: return 'Octubre';
                    case 10: return 'Noviembre';
                    case 11: return 'Diciembre';
                    default: return 'Mes no definido';
                }
            },
            limpiarResultado(){
                this.alerta = false;
                this.resultadoOperacion = '';
            },
            cargarSiguiente(){
                this.cargarDatos(this.indexActual + 1);
            },
            cargarAnterior(){
                this.cargarDatos(this.indexActual - 1);
            },
            cargarSelectMeses(){
                var fechaActual = moment(new Date());
                var fechaAux = null;

                for(var i = -2; i <= 3; i++){
                    if(i >= 0){
                        fechaAux = moment(fechaActual).clone().add(i, 'M');
                        console.log(fechaAux);
                        console.log(fechaActual);
                    }else{
                        fechaAux = moment(fechaActual).clone().subtract(Math.abs(i), 'months');
                    }
                    var mesAux = moment(fechaAux).clone().month();
                    var anioAux = moment(fechaAux).clone().year();
                    var textoMes = this.obtenerMesDesdeNumero(mesAux);
                    var elMes = {
                        id: i, 
                        mes: mesAux, 
                        textoMes: textoMes, 
                        anio: anioAux,
                    };
                    
                    if(i == 0){
                       this.mesSeleccionado = elMes; 
                       console.log('cabeza');
                       console.log(elMes);
                    }
                    console.log(elMes);
                    this.meses.push(elMes);
                }
            },   
        },    
    }
</script>
