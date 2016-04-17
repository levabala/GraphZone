function Graph(div) {
    var startW = 1000;
    var startH = 500;

    //prepare div for actions
    div.style.width = startW + 'px';
    div.style.height = startH + 'px';
    div.style.padding = '0px';

    //set a canvas
    var canvas = document.createElement('canvas');
    var borderWidth = parseInt(div.style.borderLeftWidth.replace("px", "")) + parseInt(div.style.borderRightWidth.replace("px", ""));
    var width = Math.abs(startW - borderWidth * 2);
    var height = Math.abs(startH - borderWidth * 2);

    console.log(width, height)

    canvas.width = width;
    canvas.height = height;
    canvas.style.border = 'none';
    canvas.resizable = true;

    //set link
    this.dom = canvas;

    //set resize, dblclick, click and focus listener
    canvas.resizeEvent = resizeEvent;
    canvas.checkMinSize = checkMinSize;
    canvas.ondblclick = div.ondblclick;
    canvas.onclick = div.onlclick;
    window.addEventListener('focus', render);

    //add the canvas to the div
    div.appendChild(canvas)

    //getting drawing context
    var ctx = canvas.getContext('2d');

    //set the ctx
    ctx.textBaseline = 'middle';

    //set default axises
    var axisX = { min: -500, max: 100000, step: 1, marginLeft: 20, marginRight: 10, range: 1, coeff: (width-25) / 10, minStep: 20,stepBetweenDots:1};
    var axisY = { min: -10, max: 100, step: 1, marginTop: 15, marginBottom: 25, range: 1, coeff: (height-25) / 10, minStep: 20,stepBetweenDots:1};        
    //fitAxises();
    
    //set diagrams
    var diagrams = {};  //color - data

    //mininum size
    var minSize = [200,100];

    //public functions
    this.info = function(color, array) {
        if (diagrams[color] != null) {
            delete diagrams[color];
            return;
        }
        this.addDiagram(color, array, 1, 1);
    }

    this.addDiagram = function(color, data, quality, lineWidth) {
        console.log('add diagram', color, data.length)
        if (!color || typeof data != 'object' || typeof quality != 'number' || typeof width != 'number' || typeof data[0] != 'number') return false; //Strong security :)        
        diagrams[color] = {
            data: data,
            quality: quality,
            lineWidth: lineWidth
        };
        resizeEvent();
    }

    resizeEvent(); //set basic state        


    //private functions
    function render() {
        ctx.clearRect(0, 0, width, height);

        //draw axises base
        var ax1 = [axisX.marginLeft, height - axisY.marginBottom];
        var ax2 = [width - axisX.marginRight + axisX.step*axisX.coeff, height - axisY.marginBottom];

        var ay1 = [axisX.marginLeft, height - axisY.marginBottom];
        var ay2 = [axisX.marginLeft, axisY.marginTop-axisY.step*axisY.coeff];

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(ax1[0], ax1[1]);
        ctx.lineTo(ax2[0], ax2[1]);
        ctx.moveTo(ay1[0], ay1[1]);
        ctx.lineTo(ay2[0], ay2[1]);
        ctx.stroke();
        
        //draw axisX divisions
        var size = 5;
        var y1 = height - axisY.marginBottom + size;
        var y2 = height - axisY.marginBottom - size;
        var freeDivs = 1;
        var divsC = 0;
        for (var i = axisX.min; i <= axisX.max+axisX.step; i += axisX.step){            
            var x = (i - axisX.min) * axisX.coeff + axisX.marginLeft;            
            ctx.moveTo(x,y1);
            ctx.lineTo(x,y2);
            divsC++;                                                                        
            if (divsC >= freeDivs) {
                var printed = i.toString();
                var c = 0;                
                while (printed.length > 6){
                    printed.slice(0,-3);
                    c++;
                }                
                var kkk = '';
                for (var a = 0; a < c; a++) kkk += 'k';                
                var textWidth = ctx.measureText(printed).width;                
                ctx.fillText(i,x-textWidth/2,height - axisY.marginBottom + size * 3);
                divsC = 0;
            }                
        }               
        
        //draw axisY divisions
        var x1 = axisX.marginLeft - size;
        var x2 = axisX.marginLeft + size;
        freeDivs = 1; 
        divsC = 0;       
        for (var i = axisY.min; i <= axisY.max+axisY.step; i += axisY.step){
            divsC++;            
            var y = height - (i-axisY.min) * axisY.coeff - axisY.marginBottom;
            ctx.moveTo(x1,y);
            ctx.lineTo(x2,y);                                                            
            if (divsC >= freeDivs) {
                var printed = i.toString();                
                var c = 0;                
                while (printed.length > 6){
                    printed.slice(0,-3);
                    c++;
                }                
                var kkk = '';
                for (var a = 0; a < c; a++) kkk += 'k';                
                var textWidth = ctx.measureText(printed).width;                
                ctx.fillText(i,axisX.marginLeft-textWidth-size,y+3);
                divsC = 0;
            }                            
        }       
        
        ctx.stroke();
        
        var arc = true;
        if (axisX.coeff < 10) arc = false;
        //draw diagrams
        for (var d in diagrams) {
            var dia = diagrams[d];
            ctx.strokeStyle = d;
            ctx.lineWidth = dia.lineWidth;            
            ctx.beginPath();
            if (arc) ctx.arc(axisX.marginLeft, calcY(dia.data[0]), 5, 0, Math.PI * 2);
            ctx.moveTo(axisX.marginLeft, calcY(dia.data[0]));            
            for (var i = 1; i < dia.data.length; i += dia.quality) {
                var x = calcX(i);
                var y = calcY(dia.data[i]);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                if (arc) ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.moveTo(x, y);
                ctx.stroke();                                                
            }
            ctx.lineTo(calcX(dia.data.length - 1), calcY(dia.data[dia.data.length - 1]));
            ctx.stroke();
        }
    }

    function resizeEvent() {
        width = (div.offsetWidth || fromPxToNumber(div.style.width)) - borderWidth * 2;
        height = (div.offsetHeight || fromPxToNumber(div.style.height)) - borderWidth * 2;

        canvas.width = width;
        canvas.height = height;

        fitForMaxRange();
        fitAxises();
        render();
    }

    function changeRangeX(ranges) {
        axisX.min = ranges[0];
        axisX.max = ranges[1];
    }

    function changeRangeY(ranges) {
        axisY.min = ranges[0];
        axisY.max = ranges[1];
    }

    function fitForMaxRange() {
        if (!Object.keys(diagrams).length) return;
        var xr = [0, diagrams[Object.keys(diagrams)[0]].data.length]; //min,max
        var yr = [diagrams[Object.keys(diagrams)[0]].data[0], diagrams[Object.keys(diagrams)[0]].data[0]];
        for (var d in diagrams) {
            var xr2 = [0, diagrams[d].data.length];
            var yr2 = getMinAndMaxY(diagrams[d].data);
            if (xr2[0] < xr[0]) xr[0] = xr2[0];
            if (xr2[1] > xr[1]) xr[1] = xr2[1];
            if (yr2[0] < yr[0]) yr[0] = yr2[0];
            if (yr2[1] > yr[1]) yr[1] = yr2[1];
        }        
        changeRangeX(xr);
        changeRangeY(yr);        
    }


    function fitAxises() {
        var maxTextWidth = ctx.measureText(axisX.max.toString()).width;
        axisX.range = axisX.max - axisX.min;
        axisY.range = axisY.max - axisY.min;
        axisX.coeff = (width - axisX.marginLeft - axisX.marginRight - maxTextWidth*2) / axisX.range;
        axisY.coeff = (height - axisY.marginBottom - axisY.marginTop - 20) / axisY.range;
        axisX.marginLeft = ctx.measureText(axisY.max.toString()).width+10;
        
        axisX.step = 1;
        axisY.step = 0.25;        
        while(axisX.step * axisX.coeff < maxTextWidth) axisX.step *= 2;
        while(axisY.step * axisY.coeff < axisY.minStep) axisY.step *= 2;                
        
        //if (axisX.coeff < 1) axisX.stepBetweenDots = 
    }

    function checkMinSize(w,h) {
        var res = [w > minSize[0], h > minSize[1]];         
        return res;
    }
    
    function getRange(data) {
        var min = data[0];
        var max = data[0];
        for (var d in data) {
            if (data[d] > max) max = data[d];
            if (data[d] < min) min = data[d];
        }
        return Math.abs(min) + Math.abs(max);
    }

    function getMinAndMaxY(data) {
        var min = data[0];
        var max = data[0];
        for (var d in data) {
            if (data[d] > max) max = data[d];
            if (data[d] < min) min = data[d];
        }
        return [min, max];
    }

    function calcY(value) {        
        return height - value * axisY.coeff - axisY.marginBottom
    }
    function calcX(value) {
        return value * axisX.coeff + axisX.marginLeft
    }
    
    this.canvas = canvas;
}