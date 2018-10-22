<template>
  <div class="container">
        <p v-show="alerta" class="text-danger"><i v-show="alerta" class="fas fa-exclamation-circle"></i> {{resultadoOperacion}}</p>
        <p v-show="informacion" class="text-info"><i v-show="informacion" class="fas fa-info-circle"></i> {{resultadoOperacion}}</p>
        <i v-show="loading" class="fa fa-spinner fa-spin"></i>    
        <div class="card border-success mb-3">
            <div class="card-header greenBackground">Carga de planilla</div>
            <div class="large-12 medium-12 small-12 cell">
                <label>Planilla: 
                    <input type="file" id="archivo" ref="archivo" required class="btn marginBefore" accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" v-on:change="cargarArchivo()"/>
                </label>
                <input type="submit" :disabled="disabled" value="Subir archivo" v-on:click="enviarArchivo()" class="btn marginBefore btn-success">
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
      limpiarResultado(){
          this.resultadoOperacion = '';
          this.alerta = false;
          this.informacion = false;
      },
      checkForm(){
          if(!this.archivo || this.archivo == ''){
              this.limpiarResultado();
              this.resultadoOperacion = "Debe seleccionar un archivo";
              this.alerta = true;
              this.loading = false;
              return false;
          }
          return true;
      },
      enviarArchivo(){
          this.limpiarResultado();
          this.loading = true;
          console.log(this.archivo);
          if(this.checkForm()){
              this.disabled = true;
                let formData = new FormData();
                formData.append('archivo', this.archivo);

                axios.post(`${process.env.BASE_URL}/api/turno/cargar-planilla`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    ).then((res)=>{
                        this.informacion = true;
                        this.resultadoOperacion = 'Archivo cargado exitosamente.'
                        this.loading = false;
                        this.disabled = false;
                    })
                    .catch((error)=>{
                        this.alerta = true;
                        this.resultadoOperacion = 'Ha surgido un error al cargar el archivo. Verifique el formato e inténtelo nuevamente. ';
                        console.log(error);
                        this.loading = false;
                        this.disabled = false;
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
            alerta: false,
            informacion: false,
            loading: false,
            disabled: false,
        }
    },
}
  
</script>
