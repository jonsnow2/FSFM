using JuliaFuzzy.Engine
function granularForce(position,anotherPosition,velocity,anotherVelocity, totalRadius = 0.4)
#granularForce Summary of this function goes here
#   Detailed explanation goes here

#print("\n granularForce")
    #return [0.0, 0.0]
    #radius = 0.2

    normalElasticRestorationConstant = 1.2 * 10^5
    TangentialElasticRestorativeConstants = 2.4 * 10^5
    kn = normalElasticRestorationConstant
    kt = TangentialElasticRestorativeConstants

    relativePosition = position - anotherPosition
    relativeVelocity = anotherVelocity - velocity

    distance = sqrt(dot(relativePosition,relativePosition))
    #print(distance)
    #print("\n")
    realDistance = totalRadius - distance
    if realDistance >= 0.0

        direction = relativePosition / distance

        

        tangentialDirection = [0.0, 0.0]

        tangentialDirection[1] = -direction[2]
        tangentialDirection[2] = direction[1]

        ## it will have the length of the actual velocity if is 90 degrees for any side
        ## and none(zero) if its is exactly in the same direction approaching or moving away
        tangentialVelocity = dot(relativeVelocity,tangentialDirection)

        #engine.inputVariables.Velocity.value = tangentialVelocity
        #engine.inputVariables.Distance.value = distance*-1;

        #JuliaFuzzy.process(engine)
        #force = JuliaFuzzy.Variables.defuzzify(engine.outputVariables.Force)
        #forceTangential = JuliaFuzzy.Variables.defuzzify(engine.outputVariables.ForceT)
        #force = direction*force + tangentialDirection*forceTangential

        vec1 = (realDistance*kn)*direction
        vec2 = ((kt*realDistance)*tangentialVelocity)*tangentialDirection
        if totalRadius == 0.4
            force = vec1 + vec2
        else
            force = vec1
        end

        #throw(force)
    else
        force = [0.0, 0.0]
    end
    #force = [0.0, 0.0]
#print("\n saiu granularForce")
    return force
end

