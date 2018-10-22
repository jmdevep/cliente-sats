<template>
  <div class="container">
        <div class="card border-success mb-3">
                            <div class="card-header greenBackground">Registro de Localidades</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="enviarArchivo()">
                    <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
                    <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
                    <i v-show="loading" class="fa fa-spinner fa-spin"></i>   
   
            <p>Plan: </p>
            <multi-select v-model="planSeleccionado" placeholder="Seleccionar Plan"  :optionsLimit="3" :tabindex="1"  track-by="nombre" :options="planes" :option-height="104" :custom-label="customLabelPlanes" :show-labels="false">    
                <template slot="option" slot-scope="props">
                    <div class="option__desc">
                        <span class="option__title">{{ props.option.nombre }}</span>
                        <!--<br>
                        <span class="option__small">Prestador: {{ props.option.prestador.nombreDescriptivo }}</span>-->
                    </div>
                </template>
            </multi-select>

            <div class="large-12 medium-12 small-12 cell">
                <label>Planilla: 
                    <input type="file" id="archivo" ref="archivo" accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" class="btn marginBefore" v-on:change="cargarArchivo()"/>
                </label>
            </div>
                    <input type="submit" :disabled="disabled" value="Cargar" class="btn marginBefore tableHeadingBackground">
                </form>
            </div>
        </div>
  </div>
</template>
<script>

    import axios from 'axios';
    import Multiselect from 'vue-multiselect';  

export default {
    name: 'CargaPlanillaClientes',
    mounted(){
        this.cargarPlanes();
    },
         components: { 'multi-select': Multiselect,                      
        },  
    methods: {
        customLabelPlanes ({ nombre }) {
                return `${ nombre } `; // -  ${ prestador.nombreDescriptivo } `;
        },
        cargarPlanes(){
            axios.get(`${process.env.BASE_URL}/api/cliente/lista-planes`)
        		.then((res)=>{
                    console.log(res);
        			if(res.data.resultado == 100){
                        this.planes = res.data.planes;
                        console.log(this.planes);
                    }
                    this.loading = false;
            });
        },
      cargarArchivo(){
          this.archivo = this.$refs.archivo.files[0];
      },
      limpiarResultado(){
          this.resultadoOperacion = '';
          this.alerta = false;
          this.informacion = false;
      },
      enviarArchivo(){
          this.limpiarResultado();
          if(!this.archivo || this.archivo == ''){
              this.alerta = true;
              this.resultadoOperacion = 'Debe seleccionar un archivo.';
          }else{
            this.disabled = true;
            var data = this.planSeleccionado;
            const json = JSON.stringify(data);
            const blob = new Blob([json], {
                type: 'application/json'
            });
            let formData = new FormData();
            formData.append('archivo', this.archivo);
            formData.append('data', blob);

            axios.post(`${process.env.BASE_URL}/api/cliente/cargar-planilla`,
                formData,

                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }       
                }
                ).then((res)=>{
                    this.informacion = true;
                    this.resultadoOperacion = 'Archivo cargado exitosamente.';
                    this.disabled = false;
                })
                .catch((error)=>{
                    console.log(error);
                    this.alerta = true;
                    this.disabled = false;
                    this.resultadoOperacion = 'Error al cargar el archivo. Valide el formato e inténtelo nuevamente. Si el problema persiste, contacte al soporte.';
                });
          }
      }
    },
                beforeCreate: function () {
                var usuario = this.$session.get('usuario');
                if (!this.$session.exists() || usuario == null || usuario.tipo.id != 2) {
                    this.$router.push('/usuario/login')
                } 
        },
    data(){
        return {
            archivo: '',
            planes: [],
            planSeleccionado: null,
            disabled: false,
            alerta: false,
            informacion: false,
            resultadoOperacion:'',
        }
    },
  }
  
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
