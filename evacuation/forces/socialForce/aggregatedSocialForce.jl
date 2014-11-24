using JuliaFuzzy.Engine
isdefined(:socialForce) || include("socialForce.jl")
isdefined(:isPedestrianNear) || include("isPedestrianNear.jl")

#isdefined(:granularForce) || include("granularForce.jl")
####{P <: Pedestrian, En <: Engine}
function aggregatedSocialForce(currentPedestrian,pedestriansNear)
    #print("\n aggregatedSocialForce")
    currentSocialForce = [0.0, 0.0]
    currentGranularForce = [0.0, 0.0]
    counter = 0
    #@bp
    for another in pedestriansNear
    	if another.active && another != currentPedestrian && isPedestrianNear(currentPedestrian,another)
        	currentSocialForce = currentSocialForce + socialForce(currentPedestrian,another)
       		currentGranularForce = currentGranularForce + granularForce(currentPedestrian.position,another.position,currentPedestrian.velocity,another.velocity)
            counter = counter + 1
        end   
    end
    #print("\n saiu aggregatedSocialForce")
    return (currentSocialForce,currentGranularForce, counter)
end
