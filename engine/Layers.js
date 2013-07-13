define(["./Layer"], function(Layer){
   return {
       AddLayer: function(){
           this.layers.push(new Layer())
       },
       layers: [
           new Layer()
       ]
   }
});
