 isdefined(:movePedestrianByRegion!) || include("movePedestrianByRegion.jl")
const factorsocialforce = 4.5
const factorobstacleforce = 1.0
const factordesiredforce = 1.0
const factorlookaheadforce = 1.0
const timeStep = 0.05

const obstacleForceSigma = 0.8

const agentRadius = 0.2

const zeroVector = [0.0, 0.0]


function moveByRegion!(scene::Scene,counter)
	(m,n) = size(scene.regions)
	lengthPedCalc = 0.0
    checkRegionPedestrians(scene)
    updateAllPositions(scene)
	for x in 1:m
		for y in 1:n
			lengthPedCalc = lengthPedCalc + moveByRegion!(scene.regions[x,y],x,y,scene,counter)
		end
	end
	return lengthPedCalc
end
function moveByRegion!(region::Region,xRegion,yRegion,scene, counter)
	n = length(scene.pedestrians)
    log = zeros(8,n)

    lengthPedCalc = 0.0
    #print("move")
    
    for currentPedestrian = region.pedestrians

        if !currentPedestrian.active
            continue
        end

        #[0.0,0.0]#
        lengthPedCalc = lengthPedCalc + movePedestrianByRegion!(currentPedestrian,scene,xRegion,yRegion,zeroVector)

        #now really move the agent

        currentPedestrian.acceleration = factorsocialforce * currentPedestrian.socialForce
        currentPedestrian.acceleration = currentPedestrian.acceleration + factorsocialforce * currentPedestrian.socialGranularForce

        currentPedestrian.acceleration = currentPedestrian.acceleration + factorobstacleforce * currentPedestrian.obstacleForce
        currentPedestrian.acceleration = currentPedestrian.acceleration + factorobstacleforce * currentPedestrian.obstacleGranularForce

        currentPedestrian.acceleration = currentPedestrian.acceleration + factordesiredforce * currentPedestrian.desiredForce

        currentPedestrian.acceleration = currentPedestrian.acceleration + factorlookaheadforce * currentPedestrian.lookAheadForce


        #calculate the new velocity
        velocity = currentPedestrian.velocity + timeStep * currentPedestrian.acceleration

        #don't exceed maximal speed
        lengthVelocity = sqrt(dot(velocity,velocity))
        if lengthVelocity > currentPedestrian.maxVelocity
            velocity = velocity * (currentPedestrian.maxVelocity / lengthVelocity)
        end

        #internal position update = actual move

        currentPedestrian.position = currentPedestrian.position + timeStep * velocity

        currentPedestrian.velocity = velocity;

        verifyTrajectory!(currentPedestrian,scene,counter)

    end
    
    return lengthPedCalc
end