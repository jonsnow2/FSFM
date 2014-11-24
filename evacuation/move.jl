

isdefined(:isVisible) || include("visibility/isVisible.jl")
isdefined(:JuliaFuzzy) || include("JuliaFuzzy/JuliaFuzzy.jl")


isdefined(:checkRegionPedestrians) || include("region/checkRegionPedestrians.jl")
isdefined(:updateAllPositions) || include("region/updateAllPositions.jl")

isdefined(:verifyTrajectory!) || include("trajectory/verifyTrajectory.jl")
isdefined(:movePedestrian!) || include("movePedestrian.jl")
using types
using JuliaFuzzy.Engine
const factorsocialforce = 4.5
const factorobstacleforce = 1.0
const factordesiredforce = 1.0
const factorlookaheadforce = 1.0
const timeStep = 0.005

const obstacleForceSigma = 0.8

const agentRadius = 0.2

#const relaxationTime = 0.5
const zeroVector = [0.0, 0.0]

function move!(scene::Scene,counter)

    n = length(scene.pedestrians)
    log = zeros(8,n)
    
    lengthPedCalc = 0.0
    #print("move")
    #@bp
    #checkRegionPedestrians(scene)
    #updateAllPositions(scene)
    i = 0
    for currentPedestrian in scene.pedestrians
        #currentPedestrian = scene.pedestrians[i]
        i = i + 1
        if !currentPedestrian.active
            continue
        end
        
        #[0.0,0.0]#
        lengthPedCalc = lengthPedCalc + movePedestrian!(currentPedestrian,scene,zeroVector)

        #now really move the agent

        currentPedestrian.acceleration = factorsocialforce * currentPedestrian.socialForce
        #currentPedestrian.acceleration = currentPedestrian.acceleration + factorsocialforce * currentPedestrian.socialGranularForce

        currentPedestrian.acceleration = currentPedestrian.acceleration + factorobstacleforce * currentPedestrian.obstacleForce
        #currentPedestrian.acceleration = currentPedestrian.acceleration + factorobstacleforce * currentPedestrian.obstacleGranularForce

        currentPedestrian.acceleration = currentPedestrian.acceleration + factordesiredforce * currentPedestrian.desiredForce

        currentPedestrian.acceleration = currentPedestrian.acceleration + factorlookaheadforce * currentPedestrian.lookAheadForce


        #calculate the new velocity
        velocity = currentPedestrian.velocity + timeStep * currentPedestrian.acceleration
        

        #don't exceed maximal speed
        #lengthColission = 
        lengthVelocity = sqrt(dot(velocity,velocity))
        if lengthVelocity > currentPedestrian.maxVelocity
            velocity = velocity * (currentPedestrian.maxVelocity / lengthVelocity)
            velocity[1] = velocity[1] + (rand() * 1e-3 * currentPedestrian.maxVelocity)
            velocity[2] = velocity[2] + (rand() * 1e-3 * currentPedestrian.maxVelocity)
        else
            velocity[1] = velocity[1] + (rand() * 1e-3 * lengthVelocity)
            velocity[2] = velocity[2] + (rand() * 1e-3 * lengthVelocity)
        end

        #internal position update = actual move
        #colissionMovement = [1.0, 1.0]
        colissionMovementVelocity = (currentPedestrian.socialGranularForce + currentPedestrian.obstacleGranularForce) * timeStep
        lengthColission = sqrt(dot(colissionMovementVelocity,colissionMovementVelocity))
        if lengthColission > 0.0
            if lengthColission > currentPedestrian.maxVelocity
               colissionMovementVelocity = colissionMovementVelocity *  (currentPedestrian.maxVelocity / lengthColission)
            end
            scene.positions[i,1] = currentPedestrian.position[1] + (colissionMovementVelocity[1] * timeStep)
            scene.positions[i,2] = currentPedestrian.position[2] + (colissionMovementVelocity[2] * timeStep)
        else
            scene.positions[i,1] = currentPedestrian.position[1] + (timeStep * velocity[1])
            scene.positions[i,2] = currentPedestrian.position[2] + (timeStep * velocity[2])
        end
        

        currentPedestrian.velocity = velocity

        verifyTrajectory!(currentPedestrian,scene,counter)

    end
    move!(scene)
    return lengthPedCalc
    #print("saiu move")
end
function move!(scene::Scene)
    counter = 0
    for currentPedestrian in scene.pedestrians
        counter = counter + 1
        if !currentPedestrian.active
            continue
        end
        currentPedestrian.position[1] = scene.positions[counter,1]
        currentPedestrian.position[2] = scene.positions[counter,2] 
    end
end
