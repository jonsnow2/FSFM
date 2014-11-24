using types
function checkWayPoint(currentPedestrian)
    r = currentPedestrian.wayPoint.radius;
    rSquared = r*r;

    distanceVec = currentPedestrian.position - currentPedestrian.wayPoint.position;
    distance = dot(distanceVec,distanceVec);

    modified = 0;
    if rSquared > distance || rSquared == 0
        return true
    end
    return false

end
