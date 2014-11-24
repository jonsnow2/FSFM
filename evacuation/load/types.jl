    # types.jl

#
isdefined(:JuliaFuzzy) || include("../JuliaFuzzy/JuliaFuzzy.jl")

module types

    using JuliaFuzzy.Engine
    #using Debug
    export WayPoint, Objective, Obstacle, ObstacleCache, Pedestrian, Scene, Region
    abstract baseRegion

    isdefined(:WayPoint) || include("types/WayPoint.jl")
    isdefined(:Objective) || include("types/Objective.jl")

    isdefined(:RegionRadian) || include("types/RegionRadian.jl")
    isdefined(:isVisible) || include("../visibility/isVisible.jl")
    isdefined(:closestPoint) || include("../forces/obstacleForce/closestPoint.jl")

    isdefined(:Obstacle) || include("types/Obstacle.jl")
    isdefined(:ObstacleCache) || include("types/ObstacleCache.jl")
    isdefined(:Pedestrian) || include("types/Pedestrian.jl")

    isdefined(:Region) || include("types/Region.jl")
    isdefined(:Scene) || include("types/Scene.jl")
end


