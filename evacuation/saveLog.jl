function saveLog(pedestrians,pedestriansLog,i)
    contador = 0
    for ped in pedestrians
        indPed = contador*25
        index = 0

        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.position[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.position[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.velocity[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.velocity[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.acceleration[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.acceleration[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.socialForce[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.socialForce[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.socialGranularForce[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.socialGranularForce[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.obstacleForce[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.obstacleForce[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.obstacleGranularForce[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.obstacleGranularForce[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.desiredForce[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.desiredForce[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.lookAheadForce[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.lookAheadForce[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.maxVelocity)
        index = index + 1

        pedestriansLog[i,indPed+index] = float32(ped.active? 1.0: 0.0)
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.wayPoint.position[1])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.wayPoint.position[2])
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.wayPoint.radius)
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.wayPoint.deepness)
        index = index + 1
        pedestriansLog[i,indPed+index] = float32(ped.wayPoint.distance)

        contador = contador + 1
    end
    
end
