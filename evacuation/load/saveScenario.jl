using types
function saveScenario(file::String,scenario::Scene)
	fileScenario = open("$file.scn","w")
	print("$file.scn")
	function savePedestrian(file,pedestrians)
		for pedestrian in pedestrians
			write(fileScenario,pedestrian.id)
			write(fileScenario,pedestrian.position)
			write(fileScenario,pedestrian.velocity)
			write(fileScenario,pedestrian.maxVelocity)
		end
	end
	function saveObstacle(file,obstacles)
		for obstacle in obstacles
			write(fileScenario,obstacle.start)
			write(fileScenario,obstacle.ender)
		end
	end
	function saveWayPoint(file,waypoints)
		for waypoint in waypoints
			write(fileScenario,waypoint.position)
			write(fileScenario,waypoint.radius)
		end
	end
	function saveObjective(file,objectives)
		for objective in objectives
			write(fileScenario,objective.position)
			write(fileScenario,objective.radius)
		end
	end
	
	write(fileScenario,length(scenario.pedestrians))
	savePedestrian(fileScenario,scenario.pedestrians)
	
	write(fileScenario,length(scenario.obstacles))
	saveObstacle(fileScenario,scenario.obstacles)
	
	write(fileScenario,length(scenario.wayPoints))
	saveWayPoint(fileScenario,scenario.wayPoints)
	
	write(fileScenario,length(scenario.objectives))
	saveObjective(fileScenario,scenario.objectives)
	
	close(fileScenario)
end