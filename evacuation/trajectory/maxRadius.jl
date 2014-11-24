function maxRadius(ways::Vector{WayPoint})
    max = realmin(Float64)
    for way in ways
        if way.radius > max
            max = way.radius
        end
    end
    retorno = WayPoint[]
    max = max * 0.8;
    for way in ways
        if way.radius >= max
            push!(retorno,way);
        end
    end
    return retorno
end
