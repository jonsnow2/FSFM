using types
using JuliaFuzzy.LinearAlgebra
#isdefined(:solve) || include("solve.jl")
function isVisible(eyes, obstacles, point)

    first = LinearFunc(eyes[1],eyes[2],point[1],point[2])

    for obstacle in obstacles
        ##if first.xMin < obstacle.funcCache.xMax || first.yMin < obstacle.funcCache.yMin || first.xMax > obstacle.funcCache.xMin || first.yMax > obstacle.funcCache.yMin
            if !solve(first,obstacle.funcCache)
                return false
            end
        ##end
    end
    return true
end
