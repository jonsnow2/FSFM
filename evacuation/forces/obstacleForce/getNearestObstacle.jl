using types
isdefined(:closestPoint) || include("closestPoint.jl")
function getNearestObstacle( pedestrianPosition, obstacles )
    minDistance = realmax(Float64)
    minPoint = [0.0, 0.0]
    minObstacle = obstacles[1]
    for obstacle in obstacles
        point = closestPoint(pedestrianPosition, obstacle)
        diffee = pedestrianPosition - point

        distance = dot(diffee,diffee)
        if distance < minDistance && distance > 0
            minDistance = distance
            minPoint = point
            minObstacle = obstacle
        end
    end
    return (minPoint,minObstacle)
end
