function GraphEngine(div,dom) {
    //creating and setting svg
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var WIDTH = 1000;
    var HEIGHT = 500;
    div.innerHTML = null;
    div.appendChild(svg);
    svg.setAttribute("height", HEIGHT);
    svg.setAttribute("width", WIDTH);
    svg.setAttribute("stroke-width", "1px");

    //appending D3.js
    var svg3 = d3.select(svg);
    var MARGINS = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 50
    };

    //set default colors for graphics
    var colorsKit = ['red', 'green', 'blue', 'brown', 'orange', 'darkred', 'darkgreen', 'darkblue', 'black', 'azuse'];

    //creating list of available interpolations
    var inters = ['linear', 'step-before', 'step-after', 'basic', 'basic-open', 'bundle', 'monotone'];
    var interIndex = 0;

    //info about inputs 
    var inputs = []; //graph number - id of elem

    //scale numbers 
    var scale = [1, 1]; //for x and y

    //base data
    var dataBorders = {
        x: [0, 100],
        y: [0, 100]
    };
    //var data=[[{x:10,y:20},{x:20,y:30},{x:30,y:5},{x:55,y:22},{x:100,y:5},{x:101,y:2}],[{x:3,y:29},{x:4,y:33},{x:5,y:8},{x:11,y:1},{x:12,y:25},{x:13,y:2}]];
    var data = [];

    //d3js pathes
    var pathes = {};
    
    //graphs
    var graphs = {};
    var graphsCount = 0;

    findRange();
    restartAxises();
    render();

    function findRange() {
        var first = Object.keys(graphs)[0];
        if (graphsCount === 0 || graphs[first].length < 2) return;
        byX = [graphs[first][0].x, graphs[first][1].x];
        byY = [graphs[first][0].y, graphs[first][1].y];
        for (var i in graphs) {
            for (var ii in graphs[i]) {
                var d = graphs[i][ii];
                if (byX[0] > d.x) byX[0] = d.x;
                else if (byX[1] < d.x) byX[1] = d.x;
                if (byY[0] > d.y) byY[0] = d.y;
                else if (byY[1] < d.y) byY[1] = d.y;
            }
        }
        rangeX = byX[1] - byX[0];
        rangeY = byY[1] - byY[0];
        byX[0] -= rangeX * 0.01;
        byX[1] += rangeX * 0.01;
        byY[0] -= rangeY * 0.05;
        byY[1] += rangeY * 0.05;

        dataBorders = {
            x: byX,
            y: byY
        };
    }

    var xScale, yScale, xAxis, yAxis, reduceX, reduceY;
    function restartAxises() {
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([dataBorders.x[0], dataBorders.x[1]]);
        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([dataBorders.y[0], dataBorders.y[1]]);

        xAxis = d3.svg.axis()
            .scale(xScale);
        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        svg3.append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .attr('id', 'xAxis')
            .call(xAxis);

        svg3.append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .attr('id', 'yAxis')
            .call(yAxis);

        //information about reduction of axises lables
        reduceY = svg3.append("text")
            .attr("x", MARGINS.left - 11)
            .attr("y", MARGINS.top - 11)
            .attr("text-anchor", "end")
            .style("font-size", "11px")
            .text("x1");

        reduceX = svg3.append("text")
            .attr("x", WIDTH - MARGINS.left + 41)
            .attr("y", HEIGHT - MARGINS.bottom - 5)
            .attr("text-anchor", "end")
            .style("font-size", "11px")
            .text("x1");
    }

    function render() {
        //set graph type    
        lineGen = d3.svg.line()
            .x(function (d) {
                return xScale(d.x);
            })
            .y(function (d) {
                return yScale(d.y);
            })
            .interpolate(interIndex);

        //drawing axises
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([dataBorders.x[0], dataBorders.x[1]]);
        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([dataBorders.y[0], dataBorders.y[1]]);
        xAxis = d3.svg.axis()
            .scale(xScale);
        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        d3.select('#xAxis').call(xAxis);
        d3.select('#yAxis').call(yAxis);

        //data rendering
        if (Object.keys(pathes).length > 0)
            for (var i in graphs) {
                var d = graphs[i];                
                pathes[i].attr('d', lineGen(d));
            }
    }    

    function reducingNumsLength() {
        coeff = 10;
        //dataBorders.x[0] /= coeff;
        //dataBorders.x[1] /= coeff;                        
        dataBorders.y[0] = dataBorders.y[0] / coeff;
        dataBorders.y[1] = dataBorders.y[1] / coeff;       
        
        dataBorders.y[0] = Math.round(dataBorders.y[0]);
        dataBorders.y[1] = Math.round(dataBorders.y[1]);         

        for (var i in graphs)
            for (var ii in graphs[i]) {
                var d = graphs[i][ii];
                //d.x /= coeff;
                d.y /= coeff;
            }

        //scale[0] *= coeff;
        scale[1] *= coeff;

        reduceX.text('x' + scale[0]);
        reduceY.text('x' + scale[1]);                
    }
    
    function deleteScaling(){        
        //dataBorders.x[0] /= coeff;
        //dataBorders.x[1] /= coeff;                
        dataBorders.y[0] *= scale[1];
        dataBorders.y[1] *= scale[1];        

        dataBorders.y[0] = Math.round(dataBorders.y[0]);
        dataBorders.y[1] = Math.round(dataBorders.y[1]);
        
        for (var i in graphs)
            for (var ii in graphs[i]) {
                var d = graphs[i][ii];
                //d.x /= coeff;
                d.y *= scale[1];
            }

        //scale[0] *= coeff;
        scale[1] = 1;

        reduceX.text('x' + scale[0]);
        reduceY.text('x' + scale[1]);
    }

    this.addGraph = function (id, d) {
        if (typeof d.length !== 'undefined')
            for (var i in d)
                d[i] = {
                    x: parseFloat(i),
                    y: parseFloat(d[i])
                };
        else if (typeof d.x === 'undefined' || typeof d.y === 'undefined') return false;        
        graphs[id] = d;
        graphsCount++;        

        var path = svg3.append('path')
            .attr('d', lineGen(d))
            .attr('stroke', colorsKit[graphsCount - 1])
            .attr('stroke-WIDTH', 2)
            .attr('id', 'graph' + (graphsCount - 1))
            .attr('fill', 'none');

        pathes[id] = path;
        
        findRange();
        render();
        
        /*if ((dataBorders.y[1] - dataBorders.y[0]).toString().length > 5)// || (dataBorders.x[1]-dataBorders.x[0]).toString().length > 7)
            reducingNumsLength();*/        
        deleteScaling();  
        length = (dataBorders.y[1] - dataBorders.y[0]).toString().length;
        if (length > 6)           
            while(length > 6){            
                length = (dataBorders.y[1] - dataBorders.y[0]).toString().length;
                console.log(length,(dataBorders.y[1] - dataBorders.y[0]).toString());
                reducingNumsLength();
            }
        
        findRange();
        render();

        return true;
    };

    this.removeGraph = function (id) {
        pathes[id].remove();        
        delete graphs[id];
        delete pathes[id];                
        graphsCount--;

        findRange();
        render();
    };
    
    div.resizeEvent = function(w,h){
        if (w) WIDTH = w;
        if (h) HEIGHT = h;                
        findRange();
        render();
    };
    
    dom.internalResizing = function(w, h, target, event) {        
        var res = dom.checkResizeCapability(event.rect.width, event.rect.height);
        var x = (parseFloat(div.getAttribute('data-x')) || 0),
            y = (parseFloat(div.getAttribute('data-y')) || 0);        

        // translate when resizing from top or left edges        
        //if (res[0]) x += event.deltaRect.right;
        if (res[1]) y += event.deltaRect.top;
        
        if (res[0]) WIDTH = w;
        if (res[1]) HEIGHT = h;
        svg.setAttribute("height", HEIGHT);
        svg.setAttribute("width", WIDTH);
        
        findRange();
        render();                        
        
        div.style.webkitTransform = div.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        div.setAttribute('data-x', x);
        div.setAttribute('data-y', y);        
    };
    
    dom.checkResizeCapability = function(w,h){                
        return [(w > (MARGINS.left+MARGINS.right)*5),(h > (MARGINS.top+MARGINS.bottom)*5)];
    };    
}

//d a t a   s t r u c t u r e
    /*  
        [ //data
            [  //graph1
                { //point1
                    x: float,
                    y: float
                },                
                { //point2
                    x: float,
                    y: float
                }...
            ],
            
            [  //graph2
                {  //point1
                    x: float,
                    y: float
                },                
                {  //point2
                    x: float,
                    y: float
                }...
            ]
        ]
    */