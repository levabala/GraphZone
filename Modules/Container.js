function Container(pos, id, params) {
    Module.apply(this, arguments);

    var container = this;
    
    this.dom.style.width = '250px';
    this.dom.style.height = '150px';
    var list = [
        {
            length: 3,
            toInt: true,
            name: 'FeGaTb'
        }
    ];

    var options = [];
    var selectDiv = document.createElement('div');
    selectDiv.style.margin = '5px'
    selectDiv.style.marginTop = '0px'
    var select = document.createElement('select');
    select.style.margin = '0 auto';
    title = document.createElement('option');
    title.disabled = true;
    title.selected = true;
    title.innerHTML = 'Выберите тип входных данных';
    select.appendChild(title);
    selectDiv.appendChild(select);

    for (var l in list) {
        opt = document.createElement('option');
        opt.params = {};
        opt.innerHTML = list[l].name;
        for (var ll in list[l]) opt.params[ll] = list[l][ll];
        select.appendChild(opt);
    }

    var dropZone = document.createElement('div');
    dropZone.className = 'dropZone';
    dropZone.innerHTML = 'D r o p  Z o n e'
    this.dom.innerHTML = '';
    this.dom.appendChild(selectDiv);
    this.dom.appendChild(dropZone)

    dropZone.addEventListener("dragover", function(event) {
        event.preventDefault();
        dropZone.style.backgroundColor = 'lightblue'
    }, false);
    dropZone.addEventListener("dragleave", function(event) {        
        event.preventDefault();
        dropZone.style.backgroundColor = 'white'
    }, false);
    dropZone.addEventListener("drop", function(event) {
        event.preventDefault();
        console.log('drop')        
        var files = event.dataTransfer.files;
        console.log(files)
        mousePos = {x:event.clientX,y:event.clientY};
            
        if (files.length == 1) presenter.createModule(mousePos,'Data', files[0]);
        else presenter.createModule(mousePos,'DataList', files);        
    }, false);
    
    function dropFeGaTb(event){        
    }
}