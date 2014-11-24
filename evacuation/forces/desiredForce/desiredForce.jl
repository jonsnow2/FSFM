using types
function desiredForce( pedestrian )
    ped = pedestrian.position
    way = pedestrian.wayPoint.position
    vMax = pedestrian.maxVelocity
    relaxationTime = 0.01


    diffee = way - ped

    lengthVec = sqrt(dot(diffee,diffee))
    if lengthVec > 0.0
        force = ((diffee / lengthVec)*vMax) - pedestrian.velocity
        return force / (relaxationTime*75)
    else
        return [0.0, 0.0]
    end

end
