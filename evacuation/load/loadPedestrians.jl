using types
using LibExpat
#using Debug
function loadPedestrians(pedestriansMatLab)
    (m,n) = size(pedestriansMatLab)
    way = WayPoint([0.0, 0.0], 0.0, 0.0, 0.0)
    peds = pedestriansMatLab
    retorno = Array(Pedestrian{Region},n)
    for i = 1:n
        retorno[i] = Pedestrian{Region}(i,[peds[1,i], peds[2,i]],[peds[3,i], peds[4,i]],peds[5,i],(peds[6,i] != 0.0),way);
    end
    return retorno
end

function loadPedestrians(pedestriansXML::Array{ETree,1})
    way = WayPoint([0.0, 0.0], 0.0, 0.0, 0.0)
    meanMaxVelocity = 1.2;
    standardDeviationMaxVelocity = 0.2;
    
    counter = 0
    total = 0
    for pedestrianXML in pedestriansXML
        total = total + parseint(pedestrianXML.attr["n"])
    end
    retorno = Array(Pedestrian{Region},total)
    for pedestrianXML in pedestriansXML
    	x = parsefloat(pedestrianXML.attr["x"])
    	y = parsefloat(pedestrianXML.attr["y"])
    	dx = parsefloat(pedestrianXML.attr["dx"])
    	dy = parsefloat(pedestrianXML.attr["dy"])
    	n = parseint(pedestrianXML.attr["n"])
    	minX = x - (dx/2)
    	minY = y - (dy/2)

	    for i = 1:n
            counter = counter + 1
            x  = minX + rand()*dx
            y = minY + rand()*dy
            maxVelocity = randn()*standardDeviationMaxVelocity +meanMaxVelocity
            ped = Pedestrian{Region}(counter,[x,y],[0.0, 0.0],maxVelocity,true,way)
	        retorno[counter] = ped
	    end
	end
    return retorno
end
