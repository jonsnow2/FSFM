using types
isdefined(:minDeepness) || include("minDeepness.jl")
isdefined(:minDistance) || include("minDistance.jl")
isdefined(:maxRadius) || include("maxRadius.jl")
function getNearestWayPoint(wayPoints,objectives )

    wayMinObjective = wayPoints[1]
    cols = length(wayPoints)
    newWayPoint = false;
    if((cols) > 0)
        wayPointsMinDeepness = minDeepness(wayPoints)
        if(length(wayPointsMinDeepness) > 1)
            wayPointsMaxRadius = maxRadius(wayPointsMinDeepness)
            if(length(wayPointsMaxRadius) > 1)
               wayPointsMinDistance = minDistance(wayPointsMaxRadius)
                if(length(wayPointsMinDistance) > 1)
                    n = length(objectives)
                    if ((n) > 0)
                        minDist = realmax(Float64)
                        wayMin = wayPointsMinDistance[1]
                        for i  = 1:n
                            objective = objectives(:,i)
                            for way = wayPointsMinDistance
                                diffee = way.position - objective.position
                                distanceSquared = dot(diffe,diffe)

                                if(distanceSquared > minDist)
                                    distanceSquared = minDist
                                    wayMin = way
                                    newWayPoint = true
                                end
                            end
                        end
                        wayMinObjective = wayMin
                    else
                        print("No objectives, impossible to continue")
                    end
                elseif(length(wayPointsMinDistance) == 1)
                    wayMinObjective = wayPointsMinDistance[1]
                    newWayPoint = true
                end
            elseif(length(wayPointsMaxRadius) == 1)
                wayMinObjective = wayPointsMaxRadius[1]
                newWayPoint = true
            end
        elseif(length(wayPointsMinDeepness) == 1)
            wayMinObjective = wayPointsMinDeepness[1]
            newWayPoint = true
        end

        if(newWayPoint)
            return wayMinObjective
        else
            print("Fail to get new waypoint, impossible to continue.")
        end
    else
        print("No visible waypoint, impossible to continue")
    end
end

