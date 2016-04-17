function Graphic(pos,id,data){    
    Module.apply(this,arguments);
    
    var colors = {};
    var counter = 0;
    
    this.dom.resizable = true;        
    this.dom.innerHTML = []; 
    var colorKit = ['red','green','blue','orange','brown','pink'];      
    var graph = new Graph(this.dom);
    this.dom.appendChild(graph.canvas);
    this.children.push(graph);    
    for (var d in data){
        var dataForDiagram = data[d];        
        var color;
        if (typeof d == 'number') color = colorKit[d];
        else color = d;        
        graph.addDiagram(color,dataForDiagram,1,1);
        counter++;        
    }
    
    this.changeTo = function(res,id,isNew){        
        if (isNew){
            graph.addDiagram(colorKit[counter],res,1,1);
            counter++; 
            return;
        }
        if (!res.length) return;
        if (colors[id] != null) {
            graph.addDiagram(colorKit[colors[id]],res,1,1);
            return;
        }
        colors[id] = counter;                
        graph.addDiagram(colorKit[counter],res,1,1);        
        counter++; 
    }
}