isdefined(:getWayPointsVisible) || include("getWayPointsVisible.jl")
isdefined(:checkWayPoint) || include("checkWayPoint.jl")
isdefined(:checkObjective) || include("checkObjective.jl")
isdefined(:getNearestWayPoint) || include("getNearestWayPoint.jl")
function verifyTrajectory!(currentPedestrian::Pedestrian,scene::Scene,counter)
    recheck = false
    wayPoint = currentPedestrian.wayPoint
    position = currentPedestrian.position
    if((counter % 20) == 0)
        wayPointsVisibles = getWayPointsVisible(position,wayPoint,scene.wayPoints,scene.obstacles)
        min = realmax(Float64)
        for way in wayPointsVisibles
            if way.deepness < min
                min = way.deepness
            end
        end
        recheck = (min < wayPoint.deepness)
    end

    modified = checkWayPoint(currentPedestrian)
    wayIsInvisible = !isVisible(position,scene.obstacles,wayPoint.position)
    if(modified)||(wayIsInvisible)||(recheck)
        if modified
            currentPedestrian.active = !checkObjective(position,scene.objectives)
        end

        if(currentPedestrian.active)
            #print("active");
            #if recheck wayPointsVisibles are already loaded.
            if !recheck
                wayPointsVisibles = getWayPointsVisible(position,wayPoint,scene.wayPoints,scene.obstacles)
            end

            #print(wayPointsVisibles)
            if(length(wayPointsVisibles) > 1)
                currentPedestrian.wayPoint = getNearestWayPoint(wayPointsVisibles,scene.objectives)
            elseif((length(wayPointsVisibles) == 1))
                currentPedestrian.wayPoint = wayPointsVisibles[1]
            end
        end
    end
end
