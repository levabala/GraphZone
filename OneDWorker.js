addEventListener('message', function(e) {
    if (e.data == 'name'){
        postMessage('OneDWorker');
        return;
    }    
    processFile(e.data);
}, false);

function processFile(files) {        
    var res = [];
    [].forEach.call(files, function(file) {
        var d1 = new Date();
        var reader = new FileReaderSync();
        arr = reader.readAsArrayBuffer(file);
        arr2 = new Uint8Array(arr)
        outarr = [];
        
        for (var a = 0; a < arr2.length; a += 4){ 
            var b1 = arr2[a];
            var b2 = arr2[a+1] << 8;
            var b3 = arr2[a+2] << 16;
            var b4 = arr2[a+3] << 24;
            //outarr.push(b1+b2+b3+b4);
            if (res[a/4] == null) res[a/4] = (b1+b2+b3+b4);             
            res[a/4] += (b1+b2+b3+b4);           
        }                
    });        
    postMessage(res);
}
