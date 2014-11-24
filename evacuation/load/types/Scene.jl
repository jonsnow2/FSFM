using JuliaFuzzy.Engine
type Scene
    pedestrians::Vector{Pedestrian}
    obstacles::Vector{Obstacle}
    wayPoints::Vector{WayPoint}
    objectives::Vector{Objective}
    positions::Matrix{Float64}

    engineObstacle::Engine
    engineGranular::Engine
    engineSocial::Engine
    engineSocialDirection::Engine
    engineDesired::Engine

    regions::Matrix{Region}
    function Scene(pedestrians,obstacles,wayPoints,objectives)

        engineObstacle = buildFuzzyObstacle()
        engineGranular = buildFuzzyGranular()
        engineSocial = buildFuzzySocial()
        engineSocialDirection  = buildFuzzySocialDirection()
        engineDesired = buildFuzzyDesired()

        here = new(pedestrians,obstacles,wayPoints,objectives,zeros(length(pedestrians),2),engineObstacle,engineGranular,engineSocial,engineSocialDirection,engineDesired)

        here.regions = getRegionCoordinate(here)
        return here
    end
end

isdefined(:getRegionCoordinate) || include("Region/getRegionCoordinate.jl")
isdefined(:buildFuzzyObstacle) || include("buildFuzzy/buildFuzzyObstacle.jl")
isdefined(:buildFuzzyGranular) || include("buildFuzzy/buildFuzzyGranular.jl")
isdefined(:buildFuzzySocial) || include("buildFuzzy/buildFuzzySocial.jl")
isdefined(:buildFuzzySocialDirection) || include("buildFuzzy/buildFuzzySocialDirection.jl")
isdefined(:buildFuzzyDesired) || include("buildFuzzy/buildFuzzyDesired.jl")
