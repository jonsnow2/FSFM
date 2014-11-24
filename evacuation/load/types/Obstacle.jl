immutable Obstacle
    start::Vector{Float64}
    ender::Vector{Float64}
    funcCache::LinearFunc
    function Obstacle(start,ender)
        funcCache = LinearFunc(start[1],start[2],ender[1],ender[2])
        return new(start,ender,funcCache)
    end
end
