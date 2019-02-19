<template>
<div>
    <div class="row">
        <div class="col-md-5">
            <div class="card">
                <div class="card-header"> DWH </div>
                <div class="card-body" @clicknodo='clickNodo'>
                    <tree @clicknodo='clickNodo'></tree>
                </div>                
            </div>
        </div>
        <div class="col-md-7">
            <div class="card">
                <div class="card-header">
                    <div>Proceso</div>
                </div>
                <div class="card-body">
                    <span v-if="model.tipoNodo=='tablastg'">Fuente destino </span>    
                    <select v-model="model.idfuente">
                        <option v-for="option in fuentes" v-bind:value="option.idfuente" >
                                {{option.idfuente}}
                        </option>
                    </select>   
                    <span v-if="model.tipoNodo=='tablastg'">Base de datos destino: </span>  
                    <select v-if="model.tipoNodo=='tablastg'" v-model="model.bdatos">
                        <option v-for="option in bdatosFilter" v-bind:value="option" >
                                {{option}}
                        </option>
                    </select>  
                    <div v-if="model.tipoNodo=='tablastg'" id="indtruncate">
                        <input type="checkbox" v-model="model.ind_truncate">
                        <label for="indtruncate">Truncar la tabla</label>
                    </div>                                                                               
                    <span v-show="model.tipoNodo=='tablastg'"> SQL de borrado la tabla destino:</span>  
                    <button @click="save"> Grabar </button>  
                    <button @click="getJson"> Obtener json </button>                          
                    <textarea rows="20" style="width:100%" v-model="model.sql">
                    </textarea>
                </div>                
            </div>            
        </div>
    </div>    
</div>  
</template>

<script>
import Tree from '../Miscomponentes/Tree'
import { db } from '@/shared/firebase';



 
export default {
    name: 'procesos',
    components:{ Tree },
    data: function(){
        return {  
            fuentes:[],
            bdatos:[],
            idfuente:'',           
            sql:'',            
            refNodo:'',
            model:''
        }
    
    },
    computed: {
        bdatosFilter: function() {            
            var res = this.fuentes.filter(item => {                             
               return (item.idfuente == this.model.idfuente);
            });
            return res[0].bdatos;
        }
    },
    mounted() {
        var data = [];
       // this.fuentes=[];
        
      //  this.fuentes.push({name:"hola"});
        
        db.collection("fuentes").get().then(res =>{
            res.forEach(doc => {         
                var newnodo = doc.data();
                newnodo.idfuente = doc.id;            
                this.fuentes.push(newnodo);                         
            });                                          
        });
                        
        eventBus.$on('clicknodo',this.clickNodo)
    },
    methods: {        
        clickNodo: function($nodo) {   
            this.refNodo = $nodo;
            this.model = $nodo.model;
           // this.model = $nodo.model;                                          
            if($nodo.model.tipoNodo == 'step') {
                this.sql = $nodo.model.sql               
                this.idfuente = $nodo.model.idfuente
                // db.doc($event.idfuente.path).get().then(res =>{
                //     res = res.data()                    
                // })                
            }             
        },
        save: function() {                                                        
            var jdoc = this.refNodo.root.filter(item=> {return item.name == this.refNodo.model.idDoc })[0];                       
            db.collection("dwh").doc(this.model.idDoc).set(jdoc)
            .then(res=>{
            })
            .catch(err => {
                console.error("Error->",error);
                
            });            
        },
        getJson: function() {
           
        }
    }
}
</script>
