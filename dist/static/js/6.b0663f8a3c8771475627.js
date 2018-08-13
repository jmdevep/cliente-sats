webpackJsonp([6],{ZTaR:function(o,i,a){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=a("mtWM"),r=a.n(s),e={name:"EditarUsuario",mounted:function(){var o=this;this.loading=!0,r.a.get("http://localhost:4567/api/tipo-usuario/lista-tipos").then(function(i){console.log(i),(i.data.resultado="general_listado_hay_datos")&&(o.tiposUsuario=i.data.tiposUsuario),o.loading=!1}),console.log(this.$route.params.usuario),this.usuario=this.$route.params.usuario,this.nombreOriginal=this.$route.params.usuario.nombre},beforeCreate:function(){this.$session.exists()||this.$router.push("/usuario/login")},data:function(){return{loading:!1,resultadoOperacion:"",erroresForm:[],disabled:!0,usuario:{id:0,nombre:"",contrasena:"",tipo:{id:0},idEmpleado:0},tiposUsuario:[],errorDisponibilidad:"",nombreOriginal:""}},methods:{cambioSelect:function(){},verificarDisponibilidad:function(){var o=this;""!=this.usuario.nombre&&this.usuario.nombre!=this.nombreOriginal?r.a.get("http://localhost:4567/api/usuario/existe-usuario",{params:{nombreUsuario:this.usuario.nombre}}).then(function(i){console.log(i),1==i.data.existe?(o.disabled=!0,o.errorDisponibilidad="Nombre de usuario ya se encuentra en uso."):(o.errorDisponibilidad="Nombre de usuario disponible.",o.disabled=!1)}):this.disabled=!1},modificarUsuario:function(){var o=this;if(this.checkForm()){var i=this.usuario;console.log(i),r.a.post("http://localhost:4567/api/usuario/modificar-usuario",i).then(function(i){console.log(i),1100==i.data.resultado?(o.$router.push({name:"ListadoUsuario",params:{resultadoOperacion:"Usuario modificado satisfactoriamente."}}),o.limpiarCajas()):1101==i.data.resultado&&(o.resultadoOperacion="El usuario seleccionado no existe.")})}},limpiarCajas:function(){this.usuario.nombre="",this.usuario.contrasena="",this.usuario.tipo.id=0,this.usuario.idEmpleado=0,this.empleados=this.cargarEmpleadosDisponibles()},cargarEmpleadosDisponibles:function(){},checkForm:function(){return!(!this.usuario.nombre||!this.usuario.contrasena||0==this.usuario.tipo.id)||(this.erroresForm=[],this.usuario.nombre||this.erroresForm.push("Nombre requerido."),this.usuario.contrasena||this.erroresForm.push("Contraseña requerida."),0==!this.usuario.tipo.id&&this.erroresForm.push("Debes seleccionar un tipo de usuario."),this.disabled=!1,!1)}}},t=function(){var o=this,i=o.$createElement,a=o._self._c||i;return a("div",[a("h1",{staticClass:"mainTitle"},[o._v("\n    Usuarios\n    ")]),o._v(" "),a("hr",{staticClass:"titleUnderline"}),o._v(" "),a("div",{staticClass:"card border-success mb-3"},[a("div",{staticClass:"card-header greenBackground"},[o._v("Modificar Usuario")]),o._v("\n        "+o._s(o.resultadoOperacion)+"\n        "),a("div",{staticClass:"card-body darkTextCustom"},[a("form",{on:{submit:function(i){i.preventDefault(),o.modificarUsuario()}}},[o.erroresForm.length?a("p",[a("b",[o._v("Por favor corrija lo siguiente:")]),o._v(" "),a("ul",o._l(o.erroresForm,function(i,s){return a("li",{key:s},[o._v(o._s(i))])}))]):o._e(),o._v(" "),a("i",{directives:[{name:"show",rawName:"v-show",value:o.loading,expression:"loading"}],staticClass:"fa fa-spinner fa-spin"}),o._v(" "),a("label",[o._v("Seleccione el tipo de Usuario:")]),o._v(" "),a("select",{directives:[{name:"model",rawName:"v-model",value:o.usuario.tipo.id,expression:"usuario.tipo.id"}],staticClass:"form-control",on:{change:[function(i){var a=Array.prototype.filter.call(i.target.options,function(o){return o.selected}).map(function(o){return"_value"in o?o._value:o.value});o.$set(o.usuario.tipo,"id",i.target.multiple?a:a[0])},o.cambioSelect]}},[a("option",{attrs:{value:"",selected:"selected"}},[o._v("Tipo de Usuario")]),o._v(" "),o._l(o.tiposUsuario,function(i,s){return a("option",{key:s,domProps:{value:i.id}},[o._v("\n                        "+o._s(i.nombre)+"\n                    ")])})],2),o._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"darkTextCustom",attrs:{for:"nombre"}},[o._v("Nombre de Usuario")]),o._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:o.usuario.nombre,expression:"usuario.nombre"}],staticClass:"form-control border-success",attrs:{type:"text",id:"nombre",placeholder:"Nombre de Usuario"},domProps:{value:o.usuario.nombre},on:{blur:function(i){o.verificarDisponibilidad()},input:function(i){i.target.composing||o.$set(o.usuario,"nombre",i.target.value)}}}),o._v(" "),a("small",{staticClass:"form-text textMutedCustom",attrs:{id:"emailHelp"}},[o._v(o._s(o.errorDisponibilidad))])]),o._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"darkTextCustom",attrs:{for:"contrasena"}},[o._v("Contraseña")]),o._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:o.usuario.contrasena,expression:"usuario.contrasena"}],staticClass:"form-control border-success",attrs:{type:"password",id:"contrasena",placeholder:"Contraseña"},domProps:{value:o.usuario.contrasena},on:{input:function(i){i.target.composing||o.$set(o.usuario,"contrasena",i.target.value)}}})]),o._v(" "),a("input",{staticClass:"btn marginBefore tableHeadingBackground",attrs:{type:"submit",disabled:o.disabled,value:"Modificar"}})])])])])};t._withStripped=!0;var n={render:t,staticRenderFns:[]},u=n;var l=a("VU/8")(e,u,!1,null,null,null);l.options.__file="src\\components\\usuario\\EditarUsuario.vue";i.default=l.exports}});
//# sourceMappingURL=6.b0663f8a3c8771475627.js.map