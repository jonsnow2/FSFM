function minDistance(ways::Vector{WayPoint})
    min = realmax(Float64)
    for way in ways
        if way.distance < min
            min = way.distance
        end
    end
    retorno = WayPoint[]
    for way in ways
        if way.distance == min
            push!(retorno,way);
        end
    end
    return retorno
end
