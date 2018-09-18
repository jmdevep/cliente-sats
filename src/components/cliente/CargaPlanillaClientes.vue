<template>
  <div class="container">
        <div class="card border-success mb-3">
                            <div class="card-header greenBackground">Registro de Localidades</div>
            <div class="card-body darkTextCustom">
                <form v-on:submit.prevent="enviarArchivo()">
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
                    <input type="file" id="archivo" ref="archivo" class="btn marginBefore" v-on:change="cargarArchivo()"/>
                </label>
            </div>
                    <input type="submit" value="Cargar" class="btn marginBefore tableHeadingBackground">
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
      enviarArchivo(){
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
            ).then(function(){
                console.log('SUCCESS!!');
            })
            .catch(function(){
                console.log('FAILURE!!');
            });
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
        }
    },
  }
  
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
