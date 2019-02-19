
<template>
  <ul>
      <item
        class="item"
        :model="treeData"
        :sources="fuentes">
      </item>
    </ul>
</template>

<script>
import Vue from 'vue';

Vue.component('item',{
  template:`
  <li>
    <div
      :class="{bold: isFolder}"      
      >
      <input v-show="edit" v-model="model.name">   
      <span v-show="!edit">{{model.name}}</span>  
      <span @click="toggle" @dblclick="changeType" v-if="isFolder">[{{ open ? '-' : '+' }}]</span>      
      <span v-show="edit">modo edicion</span>     
    </div>
    <div>otro</div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model"
        :sources="sources">
      </item>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
  `,
  props: {
    model: Object,
    sources: Array
  },
  data: function(){
    return {
      edit:'',
      open: false,
      selectedSource:false
    }
  },
   computed: {
    isFolder: function () {
      return this.model.children &&
        this.model.children.length
    }
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
        this.edit = true
       }
      },
      edit: function(){
        this.edit = true
      },
      cancelEdit: function(){
        this.edit = false
      },
      saveEdit: function(){
        this.edit = false
      }
    },
    addChild: function () {
      this.model.children.push({
        name: 'new fuente',
        tipoNodo:'stg'
      })
    }
})

var data = {
  name: 'CAD01-VENTAS',
  children: [
    { 
      name: 'stg',
      children:[
        {
          name: 'MD01_G1',
          children:[
            {
              name:'tabla1_stg',
              tipoNodo:'stg',
              children:[
                {
                  name:'fuente-1'
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
      treeData: data,
      fuentes: font
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

