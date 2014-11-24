isdefined(:obstacleFuzzy) || include("obstacleFuzzy.jl")
using JuliaFuzzy.Engine
function obstacleForce( pedestrianPosition,pointObstacle)
#@bp typeof(pedestrianPosition) != typeof(pointObstacle)
    minDiff = pedestrianPosition - pointObstacle
    minDistance = norm(minDiff)
    agentRadius = 0.2
    obstacleForceSigma = 0.1

    distance = minDistance - agentRadius
    forceAmount = obstacleFuzzy(distance)
    
    #forceAmount = 3*exp(-distance/obstacleForceSigma);
    #return forceAmount
    force = forceAmount * (minDiff / minDistance);
    return force
end
