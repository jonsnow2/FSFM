using types
function getWayPointsVisible( eye,exclude,wayPoints, obstacles )

	wayPointsTemp = WayPoint[];
	for wayPoint in wayPoints
	    if isVisible(eye,obstacles,wayPoint.position)&&!((exclude.position[1] == wayPoint.position[1])&&(exclude.position[2] == wayPoint.position[2]))
	        push!(wayPointsTemp,wayPoint);
	    end
	end
	return wayPointsTemp

end
