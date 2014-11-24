using types
using LibExpat
#using Debug
isdefined(:adjustObstaclesCrossingOneAnother) || include("types/Obstacles/adjustObstaclesCrossingOneAnother.jl")
function loadObstacles(obstaclesMatLab)
    (m,n) = size(obstaclesMatLab)
    obstacles = obstaclesMatLab
    retorno = Array(Obstacle,n)
    for i = 1:n
        retorno[i] = Obstacle([obstacles[1,i],obstacles[2,i]],[obstacles[3,i],obstacles[4,i]]);
    end
    return adjustObstaclesCrossingOneAnother(retorno)
end

function loadObstacles(obstaclesXML::Array{ETree,1})
    n = length(obstaclesXML)
    retorno = Array(Obstacle,n)
    counter = 0
    for obstacleXML in obstaclesXML
        counter = counter + 1
    	start = [parsefloat(obstacleXML.attr["x1"]),parsefloat(obstacleXML.attr["y1"])]
    	ender = [parsefloat(obstacleXML.attr["x2"]),parsefloat(obstacleXML.attr["y2"])]
        retorno[counter] = Obstacle(start,ender)
    end
    return adjustObstaclesCrossingOneAnother(retorno)
end
