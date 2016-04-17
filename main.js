var WORKERS = {
    OneDWorker: new Worker('OneDWorker.js')    
};
var presenter = new Presenter($('.field'), $('#workplaceList'));
var wp = presenter.createWP(true);
console.log(wp);    
