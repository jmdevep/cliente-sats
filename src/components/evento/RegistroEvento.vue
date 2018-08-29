<template>
    <div>
        <h1 class="mainTitle">
        Tramos
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Registro de Tramos</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="registrarEvento()">
                    <p v-if="erroresForm.length">
                        <b>Por favor corrija lo siguiente:</b>
                        <ul>
                            <li v-for="(error, index) in erroresForm" :key="index">{{ error }}</li>
                        </ul>
                    </p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>
                    <p>{{ resultadoOperacion }}</p>
                    
                    <div id="project-label">Select a project (type "j" for a start):</div>
                    <input id="project" />
                    <input type="hidden" id="project-id" />
                    <p id="project-title"></p><p id="project-description"></p><p id="project-other"></p>

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
        name: 'RegistroEvento',
        mounted(){
            this.loading = true;
                       axios.get('http://localhost:4567/api/localidad/lista-localidades', {
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
                    axios.post('http://localhost:4567/api/tramo/agregar-tramo', params) 
                        .then((res)=>{
                            console.log(res.data.resultado);                            
                            if(res.data.resultado == 5702){
                                this.resultadoOperacion = "Tramo agregado satisfactoriamente.";
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

    $(function() {
    var projects = [
        {
            value: "jquery",
            label: "Julian Montes de Oca",
            ci: "48640076",
            socio: "Hospital Evengelico"
        },
        {
            value: "fan buitres",
            label: "Agostina Sol Camacho",
            ci: "48659878",
            socio: "Hospital Evangelico"
        },
        {
            value: "sizzlejs",
            label: "Sizzle JS",
            ci: "a pure-JavaScript CSS selector engine",
            socio: "49857 2389442 573489057 89024375 928037890"
        }
    ];
    
    function lightwell(request, response) {
        function hasMatch(s) {
            return s.toLowerCase().indexOf(request.term.toLowerCase())!==-1;
        }
        var i, l, obj, matches = [];

        if (request.term==="") {
		    response([]);
            return;
        }
           
        for  (i = 0, l = projects.length; i<l; i++) {
            obj = projects[i];
            if (hasMatch(obj.label) || hasMatch(obj.ci) || hasMatch(obj.value)) {
                matches.push(obj);
            }
        }
        response(matches);
    }
    
    $( "#project" ).autocomplete({
        minLength: 0,
        source: lightwell,
        focus: function( event, ui ) {
            $( "#project" ).val( ui.item.label );
            return false;
        },
        select: function( event, ui ) {
            $( "#project" ).val( ui.item.label );
            $( "#project-id" ).val( ui.item.value ); // is this needed?
            $( "#project-title" ).html( ui.item.label );
            $( "#project-description" ).html( ui.item.desc );
            $( "#project-other" ).html( ui.item.other );
            
            return false;
        }
    })
    
    .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<a>" + item.label + 
                "<br><span style='font-size: 80%;'>Ci: " + item.ci + "</span>" +
                "<br><span style='font-size: 60%;'>Socio: " + item.socio + "</span></a>" )
            .appendTo( ul );
    };
});

</script>
<style>
#project-label {
    display: block;
    font-weight: bold;
    margin-bottom: 1em;
}
#project-description {
    margin: 0;
    padding: 0;
}
</style>
