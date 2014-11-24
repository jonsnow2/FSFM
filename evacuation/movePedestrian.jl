isdefined(:getPedestriansNear) || include("getPedestriansNear.jl")

isdefined(:aggregatedSocialForce) || include("forces/socialForce/aggregatedSocialForce.jl")

isdefined(:getNearestObstacle) || include("forces/obstacleForce/getNearestObstacle.jl")
isdefined(:obstacleForce) || include("forces/obstacleForce/obstacleForce.jl")
isdefined(:granularForce) || include("forces/granularForce/granularForce.jl")
isdefined(:desiredForce) || include("forces/desiredForce/desiredForce.jl")
isdefined(:lookAheadForce) || include("forces/lookAheadForce/lookAheadForce.jl")

function movePedestrian!{P <: Pedestrian}(currentPedestrian::P,scene::Scene,zeroVector)
    #print("\n movePedestrian")
    position = currentPedestrian.position
    velocity = currentPedestrian.velocity
    #maxVelocity = currentPedestrian.maxVelocity
    #wayPoint = currentPedestrian.wayPoint
    #recheck = false

    #pedestriansVisible = scene.pedestrians#getPedestriansVisible(position,obstacles,pedestrians)
    #pedestriansNear = getPedestriansNear(currentPedestrian,pedestriansVisible)
    pedestriansNear = scene.pedestrians
    #currentSocialForce = [0.0, 0.0]
    #currentGranularForce = [0.0, 0.0]
    #@bp
    (currentSocialForce,currentGranularForce,counter) = aggregatedSocialForce(currentPedestrian,pedestriansNear)
    #for another = pedestriansNear
    #    currentSocialForce = currentSocialForce + socialForce(currentPedestrian,another)
    #    currentGranularForce = currentGranularForce + granularForce(position,another.position,velocity,another.velocity)
    #end
    currentPedestrian.socialForce = currentSocialForce
    currentPedestrian.socialGranularForce = currentGranularForce

    (point,obstacle) = getNearestObstacle(position,scene.obstacles)
    currentPedestrian.obstacleForce = obstacleForce(position,point)
    currentPedestrian.obstacleGranularForce = granularForce(position,point,velocity,zeroVector,0.2)

    currentPedestrian.desiredForce = desiredForce(currentPedestrian)
    #currentPedestrian.lookAheadForce = lookAheadForce(currentPedestrian,pedestriansVisible,currentPedestrian.desiredForce)
    #currentLookAheadForce = xptr
    return length(counter)
end
