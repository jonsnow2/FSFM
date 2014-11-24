type Pedestrian{t <: baseRegion}
    id::Int64
    position::Vector{Float64}
    velocity::Vector{Float64}
    maxVelocity::Float64
    active::Bool
    wayPoint::WayPoint
    region::t
    acceleration::Vector{Float64}
    socialForce::Vector{Float64}
    socialGranularForce::Vector{Float64}
    obstacleForce::Vector{Float64}
    obstacleGranularForce::Vector{Float64}
    desiredForce::Vector{Float64}
    lookAheadForce::Vector{Float64}
    function Pedestrian(id,position,velocity,maxVelocity,active,wayPoint)
        ttt = new(id,position,velocity,maxVelocity,active,wayPoint)
        
        ttt.acceleration = [0.0,0.0]
        ttt.socialForce = [0.0,0.0]
        ttt.socialGranularForce = [0.0,0.0]
        ttt.obstacleForce = [0.0,0.0]
        ttt.obstacleGranularForce = [0.0,0.0]
        ttt.desiredForce = [0.0,0.0]
        ttt.lookAheadForce = [0.0,0.0]
        return ttt
    end
end
