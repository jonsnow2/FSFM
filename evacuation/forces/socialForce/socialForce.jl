isdefined(:getInteractionVector) || include("getInteractionVector.jl")
isdefined(:socialFuzzy) || include("socialFuzzy.jl")
const gamma = 0.35
const n = 2.0
const n_prime = 3.0
const lambdaImportance = 2

using types
function socialForce{P <: Pedestrian}(current::P,other::P)
    result = [0.0, 0.0]
    

    #Vector from pedestrian current to pedestrian other
    diffe = other.position - current.position

    distanceBeetweenPeds = sqrt(dot(diffe,diffe))

    attractionDirection = diffe / distanceBeetweenPeds

    #how much current are moving in relation with pedestrian other
    relativeVelocity = current.velocity -other.velocity

    # If the current are moving in the direction of other interaction vector will be stronger
    #otherwise it will be weaker
    #interactionVector = getInteractionVector(relativeVelocity,attractionDirection) 
    interactionVector = lambdaImportance * relativeVelocity + attractionDirection

    #get the true distance, discounting the radius of pedestrians
    distanceBeetweenPeds = distanceBeetweenPeds - 0.4

    #get the length of the interaction, if the pedestrian is moving to the 
    # other pedestrian it will be bigger than one, if it's moving away from it
    # it will be less than one
    interactionLength = sqrt(dot(interactionVector,interactionVector))

    # get the direction where the interaction is pointing
    interactionDirection = interactionVector / interactionLength

    #the theta angle is the diference of angle between the "velocity" and the attraction direction
    #the bigger the angle the more the pedestrians are moving away one from another
    angleInteraction = atan2(interactionDirection[2],interactionDirection[1])

    angleDirection = atan2(attractionDirection[2],attractionDirection[1])

    thetaAngle = angleDirection - angleInteraction

    if thetaAngle > pi
        thetaAngle = thetaAngle - 2*pi
    elseif thetaAngle < -pi
        thetaAngle = thetaAngle + 2*pi
    end
    thetaSign = 0
    if abs(thetaAngle) > 0.0000001
        thetaSign = thetaAngle/abs(thetaAngle)
    end

    #if the pedestrian "current" is moving to the encounter of "other", interactionLength will be bigger
    # and so will be the B parameter
    B = gamma * interactionLength
     #if the pedestrian "current" is moving to the encounter of "other", the angle will be closer to 0
     # but be will be bigger, I didn't get why it's like that...
    parameter = (B*thetaAngle)
    #get rid of sign
    parameter = parameter*parameter

    #FIRST PART -distanceBeetweenPeds/B
    #the closer velocity are to the attraction force the bigger the interaction
    #the bigger the interaction the bigger the B
    #the bigger the B, the lower the "distanceBeetweenPeds/B"
    #the lower the "distanceBeetweenPeds/B" the bigger the force 
    #so the bigger the B, the stronger the force,
    #so the bigger the distance, the lower the force
    #so the closer velocity are to the attraction force the bigger the force
    #SECOND PART
    #the bigger the angle the lower the force
    #the bigger the B the lower the force
    #
    
    #forceVelocityAmount = -exp(-distanceBeetweenPeds/B - (n_prime*n_prime*parameter))
    #return forceVelocityAmount*-1

    #forceAngleAmount = -thetaSign * exp(-distanceBeetweenPeds/B - (n*n*parameter))
    #return abs(forceVelocityAmount)/abs(forceAngleAmount)

    #return socialFuzzy(distanceBeetweenPeds,abs(thetaAngle),interactionLength)
    forceAmount = -socialFuzzy(distanceBeetweenPeds,abs(thetaAngle),interactionLength)
    #forceVelocityAmount = forceAmount #* 0.01
    #forceAngleAmount = forceVelocityAmount * 0.3

    forceVelocity = forceAmount * interactionDirection

    interactionDirectionLeft = [0.0, 0.0]

    interactionDirectionLeft[1] = -interactionDirection[2]

    interactionDirectionLeft[2] = interactionDirection[1]
    forceAngle = forceAmount * interactionDirectionLeft * thetaSign

    result = forceVelocity + forceAngle

    return result
end
