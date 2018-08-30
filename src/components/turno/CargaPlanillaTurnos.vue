<template>
  <div class="container">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Carga de planilla</div>
            <div class="large-12 medium-12 small-12 cell">
                <label>Planilla: 
                    <input type="file" id="archivo" ref="archivo" class="btn marginBefore tableHeadingBackground" v-on:change="cargarArchivo()"/>
                </label>
                <input type="submit" :disabled="disabled" value="Subir archivo" v-on:click="enviarArchivo()" class="btn marginBefore tableHeadingBackground">
            </div>
        </div>
  </div>
</template>
<script>
import axios from 'axios';
  export default {
    name: 'CargaPlanillaTurnos',
    methods: {
      cargarArchivo(){
          this.archivo = this.$refs.archivo.files[0];
      },
      enviarArchivo(){
          let formData = new FormData();
          formData.append('archivo', this.archivo);

          axios.post('https://servidor-sats.herokuapp.com/api/turno/cargar-planilla',
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
            archivo: ''
        }
    },
  }
  
</script><template>
  <div class="container">
      <h1 class="mainTitle">
        Turnos
        </h1>
        <hr class="titleUnderline">
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Carga de planilla</div>
            <div class="large-12 medium-12 small-12 cell">
                <label>Planilla: 
                    <input type="file" id="archivo" ref="archivo" class="btn marginBefore" v-on:change="cargarArchivo()"/>
                </label>
                <input type="submit" :disabled="disabled" value="Subir archivo" v-on:click="enviarArchivo()" class="btn marginBefore tableHeadingBackground">
            </div>
        </div>
  </div>
</template>
<script>
import axios from 'axios';
  export default {
    name: 'CargaPlanillaTurnos',
    methods: {
      cargarArchivo(){
          this.archivo = this.$refs.archivo.files[0];
      },
      enviarArchivo(){
          let formData = new FormData();
          formData.append('archivo', this.archivo);

          axios.post('https://servidor-sats.herokuapp.com/api/turno/cargar-planilla',
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
            archivo: ''
        }
    },
  }
  
</script>