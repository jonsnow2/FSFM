function minDeepness(ways::Vector{WayPoint})
    min = realmax(Float64)
    for way in ways
        if way.deepness < min
            min = way.deepness
        end
    end
    retorno = WayPoint[]
    for way in ways
        if way.deepness == min
            push!(retorno,way);
        end
    end
    return retorno
end
