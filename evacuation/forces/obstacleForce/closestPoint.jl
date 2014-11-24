using types
function closestPoint(point, obstacle )
    startPoint = obstacle.start
    endPoint = obstacle.ender
    relativeEndPoint = endPoint - startPoint
    relativePoint = point - startPoint


    lambda = dot(relativePoint,relativeEndPoint) / dot(relativeEndPoint,relativeEndPoint)
    closest = [0.0,0.0]
    if lambda <= 0.0
        closest = startPoint
    elseif lambda >= 1.0
        closest = endPoint
    else
        closest = startPoint + lambda*relativeEndPoint
    end

    return closest

end
