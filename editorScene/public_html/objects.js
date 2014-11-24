/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//alert([Number.MAX_VALUE, Number.MIN_VALUE]);
//alert(2^32);
//alert(Math.pow(2,32));
//alert(Math.log(Number.MAX_VALUE));

function Scene(canvas, name) {
    var verbose = false;
    "use strict";
    this.name = name;
    this.frame = 0;
    this.player = new Player();
    //register event
    this.player.onAnimationFrame = __updatePestriansOnlyEvent;
    
    this.pedestrianRegions = [];
    this.pedestrians = [];
    this.obstacles = [];
    this.wayPoints = [];
    this.objectives = [];
    
    this.__canvas = canvas;
    
    this.__transform = 1;
    this.__topChange = 0;
    this.__leftChange = 0;
    
    this.createPedestrianRegion = __createPedestrianRegion;
    this.createObstacle = __createObstacle;
    this.createWayPoint = __createWayPoint;
    this.createObjective = __createObjective;
    
    this.createPedestrianRegionFromJson = __createPedestrianRegionFromJson;
    this.createObstacleFromJson = __createObstacleFromJson;
    this.createWayPointFromJson = __createWayPointFromJson;
    this.createObjectiveFromJson = __createObjectiveFromJson;
    
    this.update = __update;
    this.updateFromScreen = __updateFromScreen;
    
    this.clear = __clear;
    this.play = __play;
    this.playBack = __playBack;
    this.stop = __stop;
    this.next = __next;
    this.previous = __previous;
    this.findPedestrianByPosition = __findPedestrianByPosition;
    
    this.toXML = __toXML;
    this.loadStringXML = __loadStringXML;
    var here = this;
    
    
    function __loadStringXML(str) {
        var xmlDOM = StringtoXML(str),
            jsonDom = xmlToJson(xmlDOM),
            pedestrianRegionsT = null,
            obstaclesT = null,
            wayPointsT = null,
            objectivesT = null,
            pedestrianRegionT = null,
            obstacleT = null,
            wayPointT = null,
            objectiveT = null,
            length= 0,
            contador = 0;
        
        this.clear();
        this.pedestrianRegions = [];
        this.obstacles = [];
        this.wayPoints = [];
        this.objectives = [];
        this.__canvas.renderAll();
        
        if(jsonDom.hasOwnProperty("welcome")) {            
            if(jsonDom.welcome.hasOwnProperty('agent')) {
                pedestrianRegionsT = jsonDom.welcome.agent;
                if(pedestrianRegionsT.hasOwnProperty("@attributes")) {
                    this.createPedestrianRegionFromJson(pedestrianRegionsT);
                } else {
                    length = pedestrianRegionsT.length;
                    for(contador = 0; contador < length; contador++) {
                        pedestrianRegionT = pedestrianRegionsT[contador];
                        this.createPedestrianRegionFromJson(pedestrianRegionT);
                    }
                }
            }

            if(jsonDom.welcome.hasOwnProperty('obstacle')) {
                obstaclesT = jsonDom.welcome.obstacle;
                if(obstaclesT.hasOwnProperty("@attributes")) {
                    this.createObstacleFromJson(obstaclesT);
                } else {
                    length = obstaclesT.length;
                    for(contador = 0; contador < length; contador++) {
                        obstacleT = obstaclesT[contador];
                        this.createObstacleFromJson(obstacleT);
                    }
                }
            }

            if(jsonDom.welcome.hasOwnProperty('waypoint')) {
                wayPointsT = jsonDom.welcome.waypoint;
                if(wayPointsT.hasOwnProperty("@attributes")) {
                   this.createWayPointFromJson(wayPointsT);
                } else {
                    length = wayPointsT.length;
                    for(contador = 0; contador < length; contador++) {
                        wayPointT = wayPointsT[contador];
                        this.createWayPointFromJson(wayPointT);
                    }
                }
            }

            if(jsonDom.welcome.hasOwnProperty('objective')) {
                objectivesT = jsonDom.welcome.objective;
                if(objectivesT.hasOwnProperty("@attributes")) {
                    this.createObjectiveFromJson(objectivesT);
                } else {
                    length = objectivesT.length;
                    for(contador = 0; contador < length; contador++) {
                        objectiveT = objectivesT[contador];
                        this.createObjectiveFromJson(objectiveT);
                    }
                }
            }
        } else {
            console.log("Não foi possivel processar o XML.");
        }
    }
    
    function __createPedestrianRegion (newX,newY,newDX,newDY,number) {
        var ped = new PedestrianRegion(this,newX,newY,newDX,newDY,number);
        this.pedestrianRegions.push(ped);
        return ped;
    }
    
    function __createObstacle(newX1,newY1,newX2,newY2) {
        var obstacle = new Obstacle(this,newX1,newY1,newX2,newY2);
        this.obstacles.push(obstacle);
        return obstacle;
        
    }
    
    function __createWayPoint(newX,newY,newRadius) {
        var wayPoint = new WayPoint(this,newX,newY,newRadius);
        this.wayPoints.push(wayPoint);
        return wayPoint;
        
    }
    
    function __createObjective(newX,newY,newRadius) {
        var objective = new Objective(this,newX,newY,newRadius);
        this.objectives.push(objective);
        return objective;
        
    }
    
    function __createPedestrianRegionFromJson(jsonT) {
        return this.createPedestrianRegion(jsonT["@attributes"].x,
                                jsonT["@attributes"].y,
                                jsonT["@attributes"].dx,
                                jsonT["@attributes"].dy,
                                jsonT["@attributes"].n);
    }
    
    function __createObstacleFromJson(jsonT) {
        return this.createObstacle(jsonT["@attributes"].x1,
                                jsonT["@attributes"].y1,
                                jsonT["@attributes"].x2,
                                jsonT["@attributes"].y2);
        
    } 

    function __createWayPointFromJson(jsonT) {
        return this.createWayPoint(jsonT["@attributes"].x,
                                jsonT["@attributes"].y,
                                jsonT["@attributes"].r);
        
    }
    
    function __createObjectiveFromJson(jsonT) {
        return this.createObjective(jsonT["@attributes"].x,
                                jsonT["@attributes"].y,
                                jsonT["@attributes"].r);
        
    }
    
    function __toXML() {
        var length =0,
            contador = 0,
            
            pedestrianRegion = null,
            obstacle = null,
            wayPoint = null,
            objective = null,
            
            pedestrianRegionsStr = "",
            obstaclesStr = "",
            wayPointsStr = "",
            objectivesStr = "",
            
            xmlTodo = "";
        
        length = this.pedestrianRegions.length;
        for(contador = 0; contador < length; contador++) {
            pedestrianRegion = this.pedestrianRegions[contador];
            pedestrianRegionsStr +=  pedestrianRegion.toXML()+"\n<br>";
        }
        
        length = this.obstacles.length;
        for(contador = 0; contador < length; contador++) {
            obstacle = this.obstacles[contador];
            obstaclesStr +=  obstacle.toXML()+"\n<br>";
        }
        
        length = this.wayPoints.length;
        for(contador = 0; contador < length; contador++) {
            wayPoint = this.wayPoints[contador];
            wayPointsStr +=  wayPoint.toXML()+"\n<br>";
        }
        
        length = this.objectives.length;
        for(contador = 0; contador < length; contador++) {
            objective = this.objectives[contador];
            objectivesStr +=  objective.toXML()+"\n<br>";
        }
        
        xmlTodo += "&lt;welcome&gt;";
        if(this.wayPoints.length > 0) {
            xmlTodo += "\n<br>";
            xmlTodo += wayPointsStr;
        }
        if(this.objectives.length > 0) {
            xmlTodo += "\n<br>";
            xmlTodo += objectivesStr;
        }
        if(this.obstacles.length > 0) {
            xmlTodo += "\n<br>";
            xmlTodo += obstaclesStr;
        }
        if(this.pedestrianRegions.length > 0) {
            xmlTodo += "\n<br>";
            xmlTodo += pedestrianRegionsStr;
        }
        
        xmlTodo += "\n<br>&lt;/welcome&gt;";
        
        return xmlTodo;
    }
    
    function __update() {
        var length =0,
            contador = 0,
            pedestrianRegion = null,
            obstacle = null,
            wayPoint = null,
            objective = null,
            pedestrian,
            obj = null;
        
        length = this.pedestrianRegions.length;
        for(contador = 0; contador < length; contador++) {
            pedestrianRegion = this.pedestrianRegions[contador];
            pedestrianRegion.update();
        }
        
        length = this.obstacles.length;
        for(contador = 0; contador < length; contador++) {
            obstacle = this.obstacles[contador];
            obstacle.update();
        }
        
        length = this.wayPoints.length;
        for(contador = 0; contador < length; contador++) {
            wayPoint = this.wayPoints[contador];
            wayPoint.update();
        }
        
        length = this.objectives.length;
        for(contador = 0; contador < length; contador++) {
            objective = this.objectives[contador];
            objective.update();
        }
        
        length = this.pedestrians.length;
        for(contador = 0; contador < length; contador++) {
            pedestrian = this.pedestrians[contador];
            pedestrian.update();
        }
        
        this.__canvas.renderAll();
    }
    
    function __updateFromScreen() {
        var length =0,
            contador = 0,
            pedestrianRegion = null,
            obstacle = null,
            wayPoint = null,
            objective = null,
            obj = null;
        
        length = this.pedestrianRegions.length;
        for(contador = 0; contador < length; contador++) {
            pedestrianRegion = this.pedestrianRegions[contador];
            pedestrianRegion.updateFromScreen();
        }
        
        length = this.obstacles.length;
        for(contador = 0; contador < length; contador++) {
            obstacle = this.obstacles[contador];
            obstacle.updateFromScreen();
        }
        
        length = this.wayPoints.length;
        for(contador = 0; contador < length; contador++) {
            wayPoint = this.wayPoints[contador];
            wayPoint.updateFromScreen();
        }
        
        length = this.objectives.length;
        for(contador = 0; contador < length; contador++) {
            objective = this.objectives[contador];
            objective.updateFromScreen();
        }
    }
    
    function __clear() {
        var length =0,
            contador = 0,
            pedestrianRegion = null,
            obstacle = null,
            wayPoint = null,
            objective = null,
            obj = null;
        
        length = this.pedestrianRegions.length;
        for(contador = 0; contador < length; contador++) {
            pedestrianRegion = this.pedestrianRegions[contador];
            if((pedestrianRegion.hasOwnProperty("screenObj"))&&(pedestrianRegion.screenObj !== null)) {
                obj = pedestrianRegion.screenObj;
                obj.remove();
            }
        }
        
        length = this.obstacles.length;
        for(contador = 0; contador < length; contador++) {
            obstacle = this.obstacles[contador];
            if((obstacle.hasOwnProperty("screenObj"))&&(obstacle.screenObj !== null)) {
                obj = obstacle.screenObj;
                obj.remove();
            }
        }
        
        length = this.wayPoints.length;
        for(contador = 0; contador < length; contador++) {
            wayPoint = this.wayPoints[contador];
            if((wayPoint.hasOwnProperty("screenObj"))&&(wayPoint.screenObj !== null)) {
                obj = wayPoint.screenObj;
                obj.remove();
            }
        }
        
        length = this.objectives.length;
        for(contador = 0; contador < length; contador++) {
            objective = this.objectives[contador];
            if((objective.hasOwnProperty("screenObj"))&&(objective.screenObj !== null)) {
                obj = objective.screenObj;
                obj.remove();
            }
        }
    }
    
    function __play() {
        this.player.play();        
    }
    
    function __playBack() {
        this.player.playBack();        
    }
    function __stop() {
        this.player.stop();
    }
    function __next() {
        var frame = this.player.next();
        __updatePestriansOnlyEvent(frame);
    }
    function __previous() {
        var frame = this.player.previous();
        __updatePestriansOnlyEvent(frame);
    }
    //get pedestrian which it radius is nearest to the click
    function __findPedestrianByPosition(position) {
        var indice = 0,
            x = 0,
            y = 0,
            distance = 0,
            pedestrian = null,
            minDistance = Math.pow(2,31),
            finalPed = null;
        for(indice = 0; indice < this.pedestrians.length; indice++) {
            pedestrian = this.pedestrians[indice];
            x = pedestrian.trueX - position.x;
            y = pedestrian.trueY - position.y;
            distance = Math.sqrt(x*x + y*y);
            if(minDistance > distance) {
                minDistance = distance;
                finalPed = pedestrian;
            }
        }
        return finalPed;
    }
    
    function __updatePestriansOnly(frame) {
        var indice = 0,
            indiceBaseFrame = 0,
            pedestrian = null,
            counter = 0,
            counterIndex = 0,
            tamanhoFrame = this.pedestrians.length * this.player.pedestrianLength;
        if((isDefined(frame))&&(frame.length > 0)) {
            verbose && console.log("Frame ok em __updatePestriansOnly");
            if(tamanhoFrame === frame.length) {
                for(indice = 0; indice < this.pedestrians.length;indice++) {
                    indiceBaseFrame = indice*this.player.pedestrianLength;
                    pedestrian = this.pedestrians[indice];
                    counterIndex = 0;
                    pedestrian.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.velocity.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.velocity.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.acceleration.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.acceleration.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.socialForce.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.socialForce.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.socialGranularForce.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.socialGranularForce.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.obstacleForce.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.obstacleForce.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.obstacleGranularForce.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.obstacleGranularForce.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.desiredForce.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.desiredForce.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.lookAheadForce.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.lookAheadForce.y = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;                    
                    pedestrian.maxVelocity = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.active = frame[indiceBaseFrame+counterIndex];
                    
                    counterIndex++;
                    pedestrian.wayPoint.x = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.wayPoint.y = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.wayPoint.radius = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.wayPoint.deepness = frame[indiceBaseFrame+counterIndex];
                    counterIndex++;
                    pedestrian.wayPoint.distance = frame[indiceBaseFrame+counterIndex];

                    
                    pedestrian.update();
                }
            } else if((this.pedestrians.length === 0)) {
                counter = (frame.length / this.player.pedestrianLength);
                for(indice = 0; indice < counter;indice++) {
                    indiceBaseFrame = indice*this.player.pedestrianLength;
                    pedestrian = new Pedestrian(this,
                    frame[indiceBaseFrame],//position
                    frame[indiceBaseFrame+1],//position
                    {x:frame[indiceBaseFrame+2],y:frame[indiceBaseFrame+3]},//velocity
                     {x:frame[indiceBaseFrame+4],y:frame[indiceBaseFrame+5]},//acceleration
                     {x:frame[indiceBaseFrame+6],y:frame[indiceBaseFrame+7]},//socialForce
                     {x:frame[indiceBaseFrame+8],y:frame[indiceBaseFrame+9]},//socialGranularForce
                     {x:frame[indiceBaseFrame+10],y:frame[indiceBaseFrame+11]},//obstacleForce
                     {x:frame[indiceBaseFrame+12],y:frame[indiceBaseFrame+13]},//obstacleGranularForce
                     {x:frame[indiceBaseFrame+14],y:frame[indiceBaseFrame+15]},//desiredForce
                     {x:frame[indiceBaseFrame+16],y:frame[indiceBaseFrame+17]},//lookAheadForce
                     frame[indiceBaseFrame+18],
                     frame[indiceBaseFrame+19],
                     {x:frame[indiceBaseFrame+20],y:frame[indiceBaseFrame+21],radius:frame[indiceBaseFrame+22],deepness:frame[indiceBaseFrame+23],distance:frame[indiceBaseFrame+24]});
                    this.pedestrians.push(pedestrian);

                }
            } else {
                console.log("Frame repassado não está seguindo padrão, deveria ser tamanho ("+tamanhoFrame+"), mas está com tamanho("+frame.length+")");
            }
        } else {
            console.log("frame repassado incorreto por __updatePestriansOnlyEvent.");
        }
        this.__canvas.renderAll();
    }
    function __updatePestriansOnlyEvent(frame) {
        if((isDefined(frame))&&(frame.length > 0)) {
            verbose && console.log("Frame ok em __updatePestriansOnlyEvent");
            __updatePestriansOnly.call(here,frame);
        } else {
            console.log("Frame foi repassado errado por evento do player.");
        }
    }
    //Define WayPoint class
    //########################################
    function WayPoint(newScenes,newX,newY,radius) {
        this.scene = newScenes;
        if((arguments.length >= 2)&&(isDefined(newX))) {
            this.x = parseFloat(newX);
        } else {
            this.x = 1;
        }
        
        if((arguments.length >= 3)&&(isDefined(newY))) {
            this.y = parseFloat(newY);
        } else {
            this.y = 1;
        }
        
        if((arguments.length >= 4)&&(isDefined(radius))) {
            this.r = parseFloat(radius);
        } else {
            this.r = 3;
        }
        
        var circle = new fabric.Circle({
                radius: this.trueR,
                fill: 'green',
                opacity:0.2,
                left: this.trueX,
                top: this.trueY,
                hasRotatingPoint: false
            });
        
        circle.obj = this;
        this.screenObj = circle;
        this.scene.__canvas.add(circle);
        
        this.update = __updateWayPointEObjective;
        this.updateFromScreen = __updateWayPointEObjectiveFromScreen;
        this.toXML =  __toXMLWayPoint;
        
    }
    
    function __updateWayPointEObjective() {
        var indice = 0;
        if((this.hasOwnProperty("screenObj"))&&(this.screenObj !== null)) {
            if((numbersNotEqual(this.trueX,this.screenObj.left))||
            (numbersNotEqual(this.trueY,this.screenObj.top))||
            (numbersNotEqual(this.trueR,this.screenObj.radius))) {
                this.screenObj.set({
                    left:this.trueX,
                    top:this.trueY,
                    radius:this.trueR
                });
                this.screenObj.setCoords();
                if(this.hasOwnProperty("forces")) {
                    for(indice = 0; indice < this.forces.length; indice++) {
                        this.forces[indice].update();
                    }
                }
            }
        }
    }
    function __updateWayPointEObjectiveFromScreen() {
        this.trueX = this.screenObj.left;
        this.trueY = this.screenObj.top;
        this.trueR = this.screenObj.radius;
    }
    function __toXMLWayPoint() {
        var wayPointStr = "&lt;waypoint ";
            
        wayPointStr += " x=\"";
        wayPointStr += round4(this.x);
        wayPointStr += "\"";

        wayPointStr += " y=\"";
        wayPointStr += round4(this.y);
        wayPointStr += "\"";

        wayPointStr += " r=\"";
        wayPointStr += round4(this.r);
        wayPointStr += "\"";

        wayPointStr += "/&gt;";
        return wayPointStr;
    }
    
    Object.defineProperty(WayPoint.prototype, "trueX", {
        get: function() {return this.x*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX) { 
            if(numbersNotEqual(this.trueX,newX)) {
                this.x = (newX - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(WayPoint.prototype, "trueY", {
        get: function() {return this.y*this.scene.__transform + this.scene.__topChange; },
        set: function(newY) { 
            if(numbersNotEqual(this.trueY,newY)) {
                this.y = (newY - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(WayPoint.prototype, "trueR", {
        get: function() {return this.r*this.scene.__transform; },
        set: function(newRadius) { 
            if(numbersNotEqual(this.trueR,newRadius)) {
                this.r = (newRadius) / this.scene.__transform;
            }
        }
    });
    //##############################################
    
    //Define Objective class
    //########################################
    function Objective(newScenes,newX,newY,radius) {
        this.scene = newScenes;
        if((arguments.length >= 2)&&(isDefined(newX))) {
            this.x = parseFloat(newX);
        } else {
            this.x = 0;
        }
        if((arguments.length >= 3)&&(isDefined(newY))) {
            this.y = parseFloat(newY);
        } else {
            this.y = 0;
        }
        if((arguments.length >= 4)&&(isDefined(radius))) {
            this.r = parseFloat(radius);
        } else {
            this.r = 0;
        }
        
        var circle = new fabric.Circle({
                radius: this.trueR,
                fill: 'black',
                opacity:0.2,
                left: this.trueX,
                top: this.trueY,
                hasRotatingPoint: false
            });
        circle.obj = this;
        this.screenObj = circle;
        
        this.update = __updateWayPointEObjective;
        this.updateFromScreen = __updateWayPointEObjectiveFromScreen;
        this.scene.__canvas.add(circle);
        this.toXML = __toXMLObjective;
    }
    function __toXMLObjective() {
        var objectiveStr = "&lt;objective ";
            
        objectiveStr += " x=\"";
        objectiveStr += round4(this.x);
        objectiveStr += "\"";

        objectiveStr += " y=\"";
        objectiveStr += round4(this.y);
        objectiveStr += "\"";

        objectiveStr += " r=\"";
        objectiveStr += round4(this.r);
        objectiveStr += "\"";

        objectiveStr += "/&gt;";
        return objectiveStr;
    }
    Object.defineProperty(Objective.prototype, "trueX", {
        get: function() {return this.x*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX) { 
            if(numbersNotEqual(this.trueX,newX)) {
                this.x = (newX - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Objective.prototype, "trueY", {
        get: function() {return this.y*this.scene.__transform + this.scene.__topChange; },
        set: function(newY) { 
            if(numbersNotEqual(this.trueY,newY)) {
                this.y = (newY - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Objective.prototype, "trueR", {
        get: function() {return this.r*this.scene.__transform; },
        set: function(newRadius) { 
            if(numbersNotEqual(this.trueR,newRadius)) {
                this.r = (newRadius) / this.scene.__transform;
            }
        }
    });
    
    //##############################################
    
    //Define Pedestrian class
    //########################################
    function Pedestrian(scene,x,y,velocity,acceleration,socialForce,socialGranularForce,obstacleForce,obstacleGranularForce,desiredForce,lookAheadForce,maxVelocity,active,wayPoint) {
        var fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16),
            contador = 0;
        this.r = 0.2;
        
        this.update = __updateWayPointEObjective;
        this.updateFromScreen = __updateWayPointEObjectiveFromScreen;
        this.addForce = __addForce;
        this.removeForce = __removeForce;
        this.addAllForces  = __addAllForces;
        this.removeAllForces = __removeAllForces;
        contador++;
        if((arguments.length >= contador)&&(isDefined(scene))) {
            this.scene = scene;
        } else {
            this.scene = null;
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(x))) {
            this.x = parseFloat(x);
        } else {
            this.x = 0;
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(y))) {
            this.y = parseFloat(y);
        } else {
            this.y = 0;
        }       
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(velocity))) {
            this.velocity = velocity;
        } else {
            this.velocity = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(acceleration))) {
            this.acceleration = acceleration;
        } else {
            this.acceleration = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(socialForce))) {
            this.socialForce = socialForce;
        } else {
            this.socialForce = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(socialGranularForce))) {
            this.socialGranularForce = socialGranularForce;
        } else {
            this.socialGranularForce = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(obstacleForce))) {
            this.obstacleForce = obstacleForce;
        } else {
            this.obstacleForce = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(obstacleGranularForce))) {
            this.obstacleGranularForce = obstacleGranularForce;
        } else {
            this.obstacleGranularForce = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(desiredForce))) {
            this.desiredForce = desiredForce;
        } else {
            this.desiredForce = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(lookAheadForce))) {
            this.lookAheadForce = lookAheadForce;
        } else {
            this.lookAheadForce = {x:0,y:0};
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(maxVelocity))) {
            this.maxVelocity = maxVelocity;
        } else {
            this.maxVelocity = 0;
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(active))) {
            this.active= active;
        } else {
            this.active = true;
        }
        
        contador++;
        if((arguments.length >= contador)&&(isDefined(wayPoint))) {
            this.wayPoint = wayPoint;
        } else {
            this.wayPoint = {x:0,y:0};
        }

        var circle = new fabric.Circle({
                radius: this.trueR,
                fill: fillStyle,
                opacity:0.5,
                left: this.trueX,
                top: this.trueY,
                hasRotatingPoint: false
            });
        circle.obj = this;
        this.screenObj = circle;
        
        this.scene.__canvas.add(circle);
    }
    function __addForce(type) {
        var projecao = this[type],
            force = new Force(this.scene, this, projecao);
        if(this.hasOwnProperty("forces")) {
            this.forces.push(force);
        } else {
            this.forces = [];
            this.forces.push(force);
        }
    }
    function __removeForce(type) {
        var projecao = this[type],
            index = this.forces.findIndex(function (element,index,arr) {
           return element.projecao.x === this.x && element.projecao.y === this.y;
        },projecao);
        
        this.forces[index].screenObj.obj = null;
        this.forces[index].screenObj.remove();
        this.forces[index].screenObj = null;
        this.forces.splice(index,1);
    }
    function __removeAllForces() {
        var indice = 0,
            allForces = ["velocity",
                "acceleration",
                "socialForce",
                "socialGranularForce",
                "obstacleForce",
                "obstacleGranularForce",
                "desiredForce",
                "lookAheadForce"];
        for(indice = 0; indice < allForces.length; indice++) {
           this.removeForce(allForces[indice]);
        }
    }
    
    function __addAllForces() {
        var indice = 0,
            allForces = ["velocity",
                "acceleration",
                "socialForce",
                "socialGranularForce",
                "obstacleForce",
                "obstacleGranularForce",
                "desiredForce",
                "lookAheadForce"];
        for(indice = 0; indice < allForces.length; indice++) {
            this.addForce(allForces[indice]);
        }
    }
    
    Object.defineProperty(Pedestrian.prototype, "trueX", {
        get: function() {return this.x*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX) { 
            if(numbersNotEqual(this.trueX,newX)) {
                this.x = (newX - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Pedestrian.prototype, "trueY", {
        get: function() {return this.y*this.scene.__transform + this.scene.__topChange; },
        set: function(newY) { 
            if(numbersNotEqual(this.trueY,newY)) {
                this.y = (newY - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Pedestrian.prototype, "trueR", {
        get: function() {return this.r*this.scene.__transform; },
        set: function(newRadius) { 
            if(numbersNotEqual(this.trueR,newRadius)) {
                this.r = (newRadius) / this.scene.__transform;
            }
        }
    });
    
    //##############################################
    
    
    //Define PedestrianRegion class
    //#################################################
    function PedestrianRegion(newScenes,newX,newY,rangeX,rangeY,number) {
        this.scene = newScenes;
        
        if((arguments.length >= 2)&&(isDefined(newX))) {
            this.x = parseFloat(newX);
        } else {
            this.x = 1;
        }
        
        if((arguments.length >= 3)&&(isDefined(newY))) {
            this.y = parseFloat(newY);
        } else {
            this.y = 1;
        }
        
        if((arguments.length >= 4)&&(isDefined(rangeX))) {
            this.dx = parseFloat(rangeX);
        } else {
            this.dx = 3;
        }
        
        if((arguments.length >= 5)&&(isDefined(rangeY))) {
            this.dy = parseFloat(rangeY);
        } else {
            this.dy = 3;
        }
        
        if((arguments.length >= 6)&&(isDefined(number))) {
            this.n = parseFloat(number);
        } else {
            this.n = 1;
        }
        
        var rect = new fabric.Rect({
                left: this.trueX,
                top: this.trueY,
                fill: 'red',
                opacity:0.2,
                width: this.trueDX,
                height: this.trueDY,
                hasRotatingPoint: false
            });
        rect.obj = this;
        this.screenObj = rect;
        this.update = __updatePedestrianRegion;
        this.updateFromScreen = __updatePedestrianRegionFromScreen;
        this.toXML = __toXMLPedestrianRegion;
        this.scene.__canvas.add(rect);
    }
    function __updatePedestrianRegion() {
        if((this.hasOwnProperty("screenObj"))&&(this.screenObj !== null)) {
            if((numbersNotEqual(this.trueX,this.screenObj.x))||
            (numbersNotEqual(this.trueY,this.screenObj.y))||
            (numbersNotEqual(this.trueDX,this.screenObj.width))||
            (numbersNotEqual(this.trueDY,this.screenObj.height))) {
        
                this.screenObj.set({
                    left:this.trueX,
                    top:this.trueY,
                    width:this.trueDX,
                    height:this.trueDY
                });
                this.screenObj.setCoords();
            }
        }
    }
    function __updatePedestrianRegionFromScreen() {
        this.trueX = this.screenObj.left;
        this.trueY = this.screenObj.top;
        this.trueDX = this.screenObj.width;
        this.trueDY = this.screenObj.height;
    }
    function __toXMLPedestrianRegion() {
        var pedestrianRegionStr = "&lt;agent";
        pedestrianRegionStr += " x=\"";
        pedestrianRegionStr += round4(this.x);
        pedestrianRegionStr += "\"";

        pedestrianRegionStr += " y=\"";
        pedestrianRegionStr += round4(this.y);
        pedestrianRegionStr += "\"";

        pedestrianRegionStr += " dx=\"";
        pedestrianRegionStr += round4(this.dx);
        pedestrianRegionStr += "\"";

        pedestrianRegionStr += " dy=\"";
        pedestrianRegionStr += round4(this.dy);
        pedestrianRegionStr += "\"";

        pedestrianRegionStr += " n=\"";
        pedestrianRegionStr += round4(this.n);
        pedestrianRegionStr += "\"";

        pedestrianRegionStr += "/&gt;";
        return pedestrianRegionStr;
    }
    Object.defineProperty(PedestrianRegion.prototype, "trueX", {
        get: function() {return this.x*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX) { 
            if(numbersNotEqual(this.trueX,newX)) {
                this.x = (newX - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(PedestrianRegion.prototype, "trueY", {
        get: function() {return this.y*this.scene.__transform + this.scene.__topChange; },
        set: function(newY) { 
            if(numbersNotEqual(this.trueY,newY)) {
                this.y = (newY - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(PedestrianRegion.prototype, "trueDX", {
        get: function() {return this.dx*this.scene.__transform; },
        set: function(newDX) { 
            if(numbersNotEqual(this.trueDX,newDX)) {
                this.dx = (newDX) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(PedestrianRegion.prototype, "trueDY", {
        get: function() {return this.dy*this.scene.__transform; },
        set: function(newDY) { 
            if(numbersNotEqual(this.trueDY,newDY)) {
                this.dy = (newDY) / this.scene.__transform;
            }
        }
    });    
    
    //##############################################
    
    
    //Define Obstacle class
    //##############################################3
    function Obstacle(newScene,x1,y1,x2,y2) {
        this.scene = newScene;
        
        if((arguments.length >= 2)&&(isDefined(x1))) {
            this.x1 = parseFloat(x1);
        } else {
            this.x1 = 1;
        }
        
        if((arguments.length >= 3)&&(isDefined(y1))) {
            this.y1 = parseFloat(y1);
        } else {
            this.y1 = 1;
        }
        
        if((arguments.length >= 4)&&(isDefined(x2))) {  
            this.x2 = parseFloat(x2);
        } else {
            this.x2 = 10;
        }
        
        if((arguments.length >= 5)&&(isDefined(y2))) {
            this.y2 = parseFloat(y2);
        } else {
            this.y2 = 10;
        }
        
        var line = new fabric.Line([this.trueX1,
                    this.trueY1,
                    this.trueX2,
                    this.trueY2]
                ,{
                    fill: 'blue',
                    stroke: 'blue',
                    strokeWidth: 1,
                    hasRotatingPoint: false
                });
                
        line.obj = this;
        this.screenObj = line;
        this.update = __updateLine;
        this.updateFromScreen = __updateLineFromScren;
        this.toXML = __toXMLObstacle;
        this.scene.__canvas.add(line);
    }
    function __updateLine() {
        
        if((this.hasOwnProperty("screenObj"))&&(this.screenObj !== null)) {
            if((numbersNotEqual(this.trueX1,this.screenObj.x1))||
            (numbersNotEqual(this.trueY1,this.screenObj.y1))||
            (numbersNotEqual(this.trueX2,this.screenObj.x2))||
            (numbersNotEqual(this.trueY2,this.screenObj.y2))) {
                this.screenObj.set({
                    x1:this.trueX1,
                    y1:this.trueY1,
                    x2:this.trueX2,
                    y2:this.trueY2
                });
                this.screenObj.setCoords();
            }
        }
    }
    function __updateLineFromScren() {
        this.trueX1 = this.screenObj.x1;
        this.trueY1 = this.screenObj.y1;
        this.trueX2 = this.screenObj.x2;
        this.trueY2 = this.screenObj.y2;
    }
    function __toXMLObstacle() {
        var obstaclesStr = "&lt;obstacle ";

        obstaclesStr += " x1=\"";
        obstaclesStr += round4(this.x1);
        obstaclesStr += "\"";

        obstaclesStr += " y1=\"";
        obstaclesStr += round4(this.y1);
        obstaclesStr += "\"";

        obstaclesStr += " x2=\"";
        obstaclesStr += round4(this.x2);
        obstaclesStr += "\"";

        obstaclesStr += " y2=\"";
        obstaclesStr += round4(this.y2);
        obstaclesStr += "\"";

        obstaclesStr += "/&gt;";

        return obstaclesStr;
    }
    Object.defineProperty(Obstacle.prototype, "trueX1", {
        get: function() {return this.x1*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX1) { 
            if(numbersNotEqual(this.trueX1,newX1)) {
                this.x1 = (newX1 - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Obstacle.prototype, "trueY1", {
        get: function() {return this.y1*this.scene.__transform + this.scene.__topChange; },
        set: function(newY1) { 
            if(numbersNotEqual(this.trueY1,newY1)) {
                this.y1 = (newY1 - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Obstacle.prototype, "trueX2", {
        get: function() {return this.x2*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX2) { 
            if(numbersNotEqual(this.trueX2,newX2)) {
                this.x2 = (newX2 - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Obstacle.prototype, "trueY2", {
        get: function() {return this.y2*this.scene.__transform + this.scene.__topChange; },
        set: function(newY2) {
            if(numbersNotEqual(this.trueY2,newY2)) {
                this.y2 = (newY2 - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    //######################################################
    
    
    
    
    //Define Force class
    //##############################################3
    function Force(newScene,pedestrian, projecao) {
        var fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16),
            setas = null;
    
        this.scene = newScene;
        this.update = __updateForce;
        this.updateFromScreen = __updateForceFromScren;
        this.getCoordsQuiver = __getCoordsQuiver;
        
        if((arguments.length >= 2)&&(isDefined(pedestrian))) {
            this.pedestrian = pedestrian;
        } else {
            this.pedestrian = {x:0,y:0};
        }
        
        if((arguments.length >= 3)&&(isDefined(projecao))) {
            this.projecao = projecao;
        } else {
            this.projecao = {x:0,y:0};
        }
        
        var line = new fabric.Line([this.trueX1,
                    this.trueY1,
                    this.trueX2,
                    this.trueY2]
                ,{
                    fill: fillStyle,
                    stroke: fillStyle,
                    strokeWidth: 1,
                    hasRotatingPoint: false
                });
        setas = this.getCoordsQuiver();
        var seta1 = new fabric.Line([setas[0].x,
                    setas[0].y,
                    this.trueX2,
                    this.trueY2]
                ,{
                    fill: fillStyle,
                    stroke: fillStyle,
                    strokeWidth: 1,
                    hasRotatingPoint: false
                });
                
        var seta2 = new fabric.Line([setas[1].x,
                    setas[1].y,
                    this.trueX2,
                    this.trueY2]
                ,{
                    fill: fillStyle,
                    stroke: fillStyle,
                    strokeWidth: 1,
                    hasRotatingPoint: false
                });
                
        line.obj = this;
        this.screenObj = line;
        this.seta1Obj = seta1;
        this.seta2Obj = seta2;
        
        this.scene.__canvas.add(line);
        this.scene.__canvas.add(seta1);
        this.scene.__canvas.add(seta2);
    }
    
    function __updateForce() {
        var setas = null,
            seta1 = null,
            seta2 = null;
        if((this.hasOwnProperty("screenObj"))&&(this.screenObj !== null)) {
            if((numbersNotEqual(this.trueX1,this.screenObj.x1))||
            (numbersNotEqual(this.trueY1,this.screenObj.y1))||
            (numbersNotEqual(this.trueX2,this.screenObj.x2))||
            (numbersNotEqual(this.trueY2,this.screenObj.y2))) {
                this.screenObj.set({
                    x1:this.trueX1,
                    y1:this.trueY1,
                    x2:this.trueX2,
                    y2:this.trueY2
                });
                
                setas = this.getCoordsQuiver();
                seta1 = setas[0];
                seta2 = setas[1];
                
                this.seta1Obj.set({
                    x1:seta1.x,
                    y1:seta1.y,
                    x2:this.trueX2,
                    y2:this.trueY2
                });
                
                this.seta2Obj.set({
                    x1:seta2.x,
                    y1:seta2.y,
                    x2:this.trueX2,
                    y2:this.trueY2
                });
                
                this.screenObj.setCoords();
            }
        }
    }
    function __updateForceFromScren() {
        this.trueX1 = this.screenObj.x1;
        this.trueY1 = this.screenObj.y1;
        this.trueX2 = this.screenObj.x2;
        this.trueY2 = this.screenObj.y2;
    }
    
    function __getCoordsQuiver() {
        var origem = {x:this.trueX1,y:this.trueY1},
            projecao = {x:this.trueX2-this.trueX1,y:this.trueY2-this.trueY1},
            inicio = {x:0,y:0},
            final = {x:0,y:0},
            seta = {x:0,y:0},
            inicioSeta = {x:0,y:0},
            Graus90Seta = {x:0,y:0},
            inicioSeta1 = {x:0,y:0},
            inicioSeta2 = {x:0,y:0};   
        
        inicio.x = origem.x;
        inicio.y = origem.y;
        
        final.x = inicio.x + projecao.x;
        final.y = inicio.y + projecao.y;
        
        seta.x = projecao.x / 10;
        seta.y = projecao.y / 10;
        
        inicioSeta.x = final.x - seta.x;
        inicioSeta.y = final.y - seta.y;
        
        Graus90Seta.x = -seta.y;
        Graus90Seta.y = seta.x;
   
        inicioSeta1.x = inicioSeta.x + (Graus90Seta.x * 0.5);
        inicioSeta1.y = inicioSeta.y + (Graus90Seta.y * 0.5);
        
        inicioSeta2.x = inicioSeta.x - (Graus90Seta.x * 0.5);
        inicioSeta2.y = inicioSeta.y - (Graus90Seta.y * 0.5);
        return [inicioSeta1,inicioSeta2];
    }
    Object.defineProperty(Force.prototype, "trueX1", {
        get: function() {return this.pedestrian.x*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX1) { 
            if(numbersNotEqual(this.trueX1,newX1)) {
                this.origem.x = (newX1 - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Force.prototype, "trueY1", {
        get: function() {return this.pedestrian.y*this.scene.__transform + this.scene.__topChange; },
        set: function(newY1) { 
            if(numbersNotEqual(this.trueY1,newY1)) {
                this.pedestrian.y = (newY1 - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Force.prototype, "trueX2", {
        get: function() {return (this.projecao.x + this.pedestrian.x)*this.scene.__transform + this.scene.__leftChange; },
        set: function(newX2) {
            var projecaoX = (newX2-this.trueX1);
            if(numbersNotEqual(this.trueX2,projecaoX)) {
                this.projecao.x = (projecaoX - this.scene.__leftChange) / this.scene.__transform;
            }
        }
    });
    
    Object.defineProperty(Force.prototype, "trueY2", {
        get: function() {return (this.projecao.y + this.pedestrian.y)*this.scene.__transform + this.scene.__topChange; },
        set: function(newY2) {
            var projecaoY = (newY2 - this.trueY1);
            if(numbersNotEqual(this.trueY2,projecaoY)) {
                this.projecao.y = (projecaoY - this.scene.__topChange) / this.scene.__transform;
            }
        }
    });
    //######################################################
    //
    //
    
    // Util functions
    function StringtoXML(text){
        if (window.ActiveXObject){
          var doc=new ActiveXObject('Microsoft.XMLDOM');
          doc.async='false';
          doc.loadXML(text);
        } else {
          var parser=new DOMParser();
          var doc=parser.parseFromString(text,'text/xml');
        }
        return doc;
    }

    // Changes XML to JSON
    function xmlToJson(xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType === 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                        for (var j = 0; j < xml.attributes.length; j++) {
                                var attribute = xml.attributes.item(j);
                                obj["@attributes"][attribute.nodeName] = attribute.value;
                        }
                }
        } else if (xml.nodeType === 3) { // text
                obj = xml.value;
        }

        // do children
        if (xml.hasChildNodes()) {
                for(var i = 0; i < xml.childNodes.length; i++) {
                        var item = xml.childNodes.item(i);
                        var nodeName = item.nodeName;
                        if (typeof(obj[nodeName]) == "undefined") {
                                obj[nodeName] = xmlToJson(item);
                        } else {
                                if (typeof(obj[nodeName].push) == "undefined") {
                                        var old = obj[nodeName];
                                        obj[nodeName] = [];
                                        obj[nodeName].push(old);
                                }
                                obj[nodeName].push(xmlToJson(item));
                        }
                }
        }
        return obj;
    }
}

Object.defineProperty(Scene.prototype, "Transform", {
    get: function() {return this.__transform; },
    set: function(newTransform) { 
        if(numbersNotEqual(this.Transform,newTransform)) {
            this.__transform = newTransform;
            this.update(); 
        }
    }
});

Object.defineProperty(Scene.prototype, "LeftChange", {
    get: function() {return this.__leftChange; },
    set: function(newLeftChange) { 
        if(numbersNotEqual(this.LeftChange,newLeftChange)) {
            this.__leftChange = newLeftChange;
            this.update(); 
        }
    }
});

Object.defineProperty(Scene.prototype, "TopChange", {
    get: function() {return this.__topChange; },
    set: function(topChange) { 
        if(numbersNotEqual(this.TopChange,topChange)) {
            this.__topChange = topChange;
            this.update();
        }
    }
});

function round4(str) {
    var valor = parseFloat(str);
    valor *= 10000;
    valor = Math.round(valor);
    valor /= 10000;
    return valor;
}
function isDefined(val) {
    return ((typeof(val) !== "undefined")&&(val !== null));
}
function numbersNotEqual(val1,val2) {
    var precision =  Math.pow(2,32);
    if ((!isDefined(val1))||(!isDefined(val2))) {
        return true;
    }
    return (Math.round(val1*precision) !== Math.round(val2*precision));
}
    //####################################################
    
    
    