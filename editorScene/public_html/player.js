/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Player() {
    var verbose = false;
    this.connection = new WebSocket("ws://localhost:8090");
    var connection = this.connection;
    this.cache = [];
    this.currentFrame = 0;
    this.currentCache = 0;
    this.currentStartFrame = 0;
    this.lengthCache = 400;
    this.totalPedestrianNumberByFrame = 0;
    this.pedestrianLength = 25;
    this.connectionsActives = 0;
    
    this.isOpened = false;
    this.firstLoad = true;
    this.connectionsTrys = 0;
    this.hasFinished = true;
    this.hasStoped = true;
    
    //events
    this.onload = null;
    this.onAnimationFrame = null;
    //methods...
    this.play = __play; 
    this.playBack = __playBack;   
    this.stop = __stop;
    this.next = __getNextFrame;
    this.previous = __getPreviousFrame;
    this.getFrame = __getFrame;
    
    var here = this;
    
    this.connection.onmessage = function(msg) {
        __message.call(here,msg);
    };
    
    function __nextCache() {
        if(this.connectionsActives === 0) {
            this.connectionsActives++;
            this.action = "next";
            var beginFrame = this.currentStartFrame + this.cache.length + 1;
            connection.send(JSON.stringify({action:"next",beginFrame:beginFrame,numberFrames:100}));
            this.connectionsTrys = 0;
        } else {
            console.log("Não eh possivel carregar \"next\" enquanto outra mensagem está sendo processada");
            this.connectionsTrys++;
            if(this.connectionsTrys < 10) {
                setTimeout(__nextCache.bind(this),50);
            } else {
                console.log("Foi evetuado várias tentativas de conexão todas com insucesso, favor recarregar a página.");
            }
        }
    }
    
    function __previousCache() {
        if(this.currentStartFrame > 0) {
            if(this.connectionsActives === 0) {
                this.connectionsActives++;
                this.action = "previous";
                var beginFrame = this.currentStartFrame + 1;
                connection.send(JSON.stringify({action:"previous",beginFrame:beginFrame,numberFrames:100}));
                this.connectionsTrys = 0;
            } else {
                console.log("Não eh possivel carregar \"previous\" enquanto outra mensagem está sendo processada");            
                this.connectionsTrys++;
                if(this.connectionsTrys < 10) {
                    setTimeout(__previousCache.bind(this),50);
                } else {
                    console.log("Foi evetuado várias tentativas de conexão todas com insucesso, favor recarregar a página.");
                }
            }
        }
    }
    
    function __loadMessageIntoCache(message,totalNumberFrames,lengthFrame) {
        var frameIndice = 0,
            frame = new Float32Array(0),
            start = 0,
            end = 0;
        for(frameIndice = 0; frameIndice < totalNumberFrames; frameIndice++) {
            start = frameIndice*lengthFrame;
            end = (frameIndice+1)*lengthFrame;
            frame = message.subarray(start,end);
            if(this.action === "next") {
                this.cache.push(frame);
            } else if(here.action === "previous") {
                this.cache.splice(0,0,frame);
            }
        }
    }
    function __controlCacheLength() {
        var alreadyDecreased = false;
        if(this.cache.length > this.lengthCache) {
            var lengthRemove = this.cache.length - this.lengthCache;
            if(here.action === "next") {
                this.currentCache -= lengthRemove;
                this.currentStartFrame += lengthRemove;
                this.cache.splice(0,lengthRemove);
                console.log("cleaning cache."+lengthRemove);
            } else if(this.action === "previous") {
                this.currentCache += lengthRemove;
                this.currentStartFrame -= lengthRemove;
                this.cache.splice(this.cache.length-lengthRemove,lengthRemove);
            }
        } else if (this.cache.length < this.lengthCache) {
            if(this.connectionsActives === 1) {
                if(this.action === "next") {
                    alreadyDecreased = true;
                    this.connectionsActives--;
                    console.log("next called from missing total cache.");
                    __nextCache.call(this);
                } else if(this.action === "previous") {
                    alreadyDecreased = true;
                    this.connectionsActives--;
                    console.log("previus called from missing total cache.");
                    __previousCache.call(this);
                }
            }
        }
        return alreadyDecreased;
    }
    function __firstLoad() {
        var alreadyDecreased = false;
        this.isOpened = true;
        alreadyDecreased = true;
        this.connectionsActives--;
        __nextCache.call(this);
        return alreadyDecreased;
    }
    function __message(msg) {
        if(this.isOpened) {            
            var binaryData = base64DecToArr(msg.data).buffer,
            result = new Float32Array(binaryData),
            //how many frames there are in the float64 array
            totalNumberFrames = this.lengthCache / 4,
             //the length of floats that each frame uses       
            lengthFrame = result.length / totalNumberFrames,
            //the length of floats that each pedestrian uses
            lengthPedestrian = 11,
            //the totalNumber of pedestrian in each frame
            totalNumberPedestrians = lengthFrame /lengthPedestrian ,         
            alreadyDecreased = false;
            if(result.length > 10) {
                this.totalPedestrianNumberByFrame = totalNumberPedestrians;
                
                __loadMessageIntoCache.call(this,result,totalNumberFrames,lengthFrame);
                
                alreadyDecreased = __controlCacheLength.call(this);        
                
                if(this.firstLoad === true) {
                    if(this.onload !== null) {
                        this.onload();
                    }                    
                    this.firstLoad = false;
                    this.hasFinished = false;
                }
            } else if(result.length === 2) {
                this.hasFinished = true;
                this.stop();
            }
        } else if(msg.data === "OK") {
            alreadyDecreased = __firstLoad.call(this);
        } else {
            console.log("messsage received");
            console.log(msg.data);
        }
        if(!alreadyDecreased) {
            this.connectionsActives--;
        }
    };
    this.connection.onopen = function (event) { 
        here.connectionsActives++;
        connection.send(JSON.stringify({action:"open",fileName:"juliaLog.csv"}));
    };
    
    
    
    function __checkCache(action) {
        if(this.connectionsActives === 0) {
            var middlePoint =  (this.lengthCache / 2),
                quarterPoint = (this.lengthCache / 4);
            if ((this.currentCache  > (middlePoint + quarterPoint) )&&(action === "getNextFrame")) {
                console.log("getNextFrame called from fetching new data.");
                __nextCache.call(this);
            } else if (this.currentCache  < (middlePoint - quarterPoint)&&(action === "getPreviousFrame"))  {
                console.log("getPreviousFrame called from fetching new data.");
                __previousCache.call(this);
            }
        }
    }
    
    function __getNextFrame()  {
        if(this.currentCache < (this.cache.length -1)) {
            this.currentCache++;   
            this.currentFrame++;
            __checkCache.call(this,"getNextFrame");            
        } else if(this.hasFinished !== true) {
            __checkCache.call(this,"getNextFrame");
        }
        return this.getFrame();
    }
    
    function __getPreviousFrame() {
       if(this.currentCache > 0) {
            this.currentCache--;  
            this.currentFrame--;
            __checkCache.call(this,"getPreviousFrame");
        }
       return this.getFrame();
    }
    
    function __getFrame() {
        var frame = null;
        if((this.currentCache < this.cache.length)&&(this.currentCache >= 0)) {            
            frame = this.cache[this.currentCache];
            if(isDefined(frame)) {            
                verbose && console.log("Frame in __getFrame is OK.");
                return frame;
            } else {
                verbose && console.log("Frame in __getFrame is not OK, problem in the load problem, or the the caller...");
                this.stop();
                return null;
            }
        } else {
            console.log("current cache("+this.currentCache+") está fora dos limites do cache. Tamanho da cache "+this.cache.length);
            this.stop();
            return null;
        }
    }   
    
    function __playForward() {
        var frame = null;
        this.next();
        if(this.onAnimationFrame !== null) {
            frame = this.getFrame();
            if(isDefined(frame)) {
                this.onAnimationFrame(frame);
            } else {
                verbose && console.log("Erro com frame repassado por função __getFrame");
            }
        }
        if((!this.hasFinished)&&(!this.hasStoped)) {
            this.animationID = requestAnimationFrame(__playForwardEvent);
        }
    }
    
    function __playBackward() {
        this.previous();
        if(this.onAnimationFrame !== null) {
            this.onAnimationFrame(this.getFrame());
        }
        if((!this.hasFinished)&&(!this.hasStoped)) {
            this.animationID = requestAnimationFrame(__playBackwardEvent);
        }
    }
    function __playForwardEvent() {
        __playForward.call(here);
    }
    
    function __playBackwardEvent() {
        __playBackward.call(here);
    }
    
    function __play() {
        if(this.hasStoped) {
            this.hasStoped = false;
            __playForwardEvent();        
            this.animationID = requestAnimationFrame(__playForwardEvent);
        }
    }
    
    function __playBack() {
        if(this.hasStoped) {
            this.hasStoped = false;
            __playBackwardEvent();        
            this.animationID = requestAnimationFrame(__playBackwardEvent);
        }
    }
    
    function __stop() {
        this.hasStoped = true;
        cancelAnimationFrame(this.animationID);
    }
    
    
}

function isDefined(val) {
    return ((typeof(val) !== "undefined")&&(val !== null));
}