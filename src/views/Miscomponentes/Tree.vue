
<template>
<div>
  <button @click="getRate()">llama get </button>
  <ul>
      <item
        class="item"
        :model="treeData"
        :sources="fuentes"
        :root="treeData.children">
      </item>
    </ul>
</div>
</template>

<script>
import Vue from 'vue';
import APIService from '@/services/APIService';
import { db } from '@/shared/firebase';
import { debuglog } from 'util';
import { defaultCoreCipherList, defaultCipherList } from 'constants';


Vue.component('item',{
  template:`
  <li> 
    <div :class="{bold: isFolder}">
      <input v-show="model.edit" v-model="model.name">   
      <span v-show="!model.edit"  @click="clickNodo">{{model.name}}</span>  
      <span @click="toggle" @dblclick="changeType" v-if="isFolder" v-show="!model.edit">[{{ open ? '-' : '+' }}]</span>      
      <span @click="editNodo" v-show="!model.edit">[edit]</span>
      <span @click="edit=model.edit=false" v-show="model.edit">[cancelar]</span>
      <span @click="saveEdit" v-show="model.edit">[save]</span>      
      <span v-show="open" v-if="isFolder" class="add" @click="addChild">[Añadir]</span>        
    </div>    
    <ul v-show="open" v-if="isFolder" >
      <item
        class="item"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model"
        :sources="sources"     
        :root="root"   
        >
      </item>      
    </ul>
  </li>
  `,
  props: {
    model: Object,
    sources: Array,
    root: Array
  },
  data: function(){
    return {
      edit:'',
      open: false,
      selectedSource:false,
      info:null
    }
  },
   computed: {
    isFolder: function () {
      return (this.model.children &&
        this.model.children.length) || this.model.tipoNodo != 'step'
    }
  },
  created () {
    eventBus.$on("savenodo",this.saveNodo);
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function () {
     // if (!this.isFolder) {
       if(true) {
       // Vue.set(this.model, 'children', [])
       // this.addChild()
       // this.open = true
       // this.edit = true
      }
    },
    editNodo: function(){
      this.model.edit = true;      
    },   
    saveEdit: function(){      
      this.model.edit = false
      switch(this.model.tipoNodo)
      {
        case 'cadena':         
          this.model.idDoc = this.model.name;
          this.model.children =  [
            {idDoc:this.model.name,name:'stg',edit:false,tipoNodo:'fasestg',children:[]},
            {idDoc:this.model.name,name:'dim',edit:false,tipoNodo:'fasedim',children:[]},
            {idDoc:this.model.name,name:'fact',edit:false,tipoNodo:'fasefact',children:[]}
          ];
          db.collection("dwh").doc(this.model.name).set(this.model);
          // db.collection("dwh").add(this.model)
          // .then(docRef => {
          //     console.log("Document written with ID: ", docRef.id);
          // })
          // .catch(error => {
          //     console.error("Error adding document: ", error);
          // });
          break;
        case 'cadenastg':
        case 'tablastg':
        case 'tabladim':
        case 'tablafact':
        case 'step':                         
          var jdoc = this.root.filter(item=> {return item.name == this.model.idDoc })[0];
          db.collection("dwh").doc(this.model.idDoc).set(jdoc);
          break;
      }      
    },
    addChild: function () {         
      switch(this.model.tipoNodo)
      {
        case 'root':
          this.model.children.push({
          idDoc:'',
          name: 'CAD',
          tipoNodo:'cadena',
          edit:true,
         
          });
        break;  
        case 'fasestg':        
          this.model.children.push({
          idDoc: this.model.idDoc,
          name: 'CAD_STG_',
          tipoNodo:'cadenastg',
          edit:true,          
          children:[]                    
          });          
        case 'cadenastg':
          this.model.children.push({
            idDoc:this.model.idDoc,
            name:'',
            tipoNodo:'tablastg',
            edit:true,
            children:[]
          });
          break;
        case 'tablastg':
        case 'tabladim':
        case 'tablafact':
          this.model.children.push({
            idDoc:this.model.idDoc,
            name:'',
            tipoNodo:'step',
            edit:true,
            sql:''
          });          
          break;
        case 'fasedim':
          this.model.children.push({
            idDoc:this.model.idDoc,
            name:'dim',
            tipoNodo:'tabladim',
            edit:true,
            children:[]
          });
          break;
        case 'fasefact':
          this.model.children.push({
            idDoc:this.model.idDoc,
            name:'fact',
            tipoNodo:'tablafact',
            edit:true,
            children:[]
          });
          break;
      }            
    },
    clickNodo: function() {      
      eventBus.$emit("clicknodo",this);
    },
    saveNodo: function() {
       var jdoc = this.root.filter(item=> {return item.name == this.model.idDoc })[0];
       //   db.collection("dwh").doc(this.model.idDoc).set(jdoc);
      debugger;
    }
  }
})

var data = {
  name: 'CAD01-VENTAS',
  edit:false,
  children: [
    { 
      name: 'stg',
      children:[
        {
          name: 'MD01_G1',
          edit:false,
          children:[
            {
              name:'tabla1_stg',
              tipoNodo:'stg',
              edit:false,
              children:[
                {
                  name:'fuente-1',
                  edit:false
                },
                {
                  name:'fuente-1'
                }
              ]
            },
            {
              name:'tabla2_stg'
            }
          ]
        },
        {
          name: 'MD01_G2'
        }
      ]
    },
    { 
      name: 'dim',
      children:[
        {name:'td_clientes'},
        {
          name:'td_agentes',
          children:[
            {
              name:'proceso',
              children:[
                {name:'paso-1'},{name:'paso-2'},{name:'paso-3'},{name:'paso-4'},{name:'paso-5'}
              ]
            },
            {
              name:'td_agentes1'              
            }
          ]
        }
      ]
    },
    { name: 'fact' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        },
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        }
      ]
    }
  ]
}

var font= [{text:'fuente1'},{text:'fuente2'},{text:'fuente3'}]
export default {
  name: 'tree',
  data: function(){
    return {
      treeData:{},
      fuentes: font
    }
  },
  mounted () {    

  },
  created () {    
    this.treeData = this.getDwh();       
  },
  methods: {
     getDwh() {
      //this.info = APIService.getRate().then(res=> this.info = res.data);    
      var jdoc = { name:'dwh',tipoNodo:'root',children:[]};      
      db.collection("dwh").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
         // console.log(doc.id,"=>",doc.data());
          var newNodo = doc.data();
          newNodo.idDoc = doc.id;
          jdoc.children.push(newNodo);             
          //debugger;      
        });
        this.treeData = jdoc;
      });        
      return jdoc;
    },
    addDoc(doc) {
      db.collection("dwh").add(data)
      .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(error => {
          console.error("Error adding document: ", error);
      });
    }
  }
}

</script>
<style>
body {
  font-family: Menlo, Consolas, monospace;
  color: #444;
}
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>

