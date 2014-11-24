
#using Debug
isdefined(:types) || include("types.jl")
isdefined(:loadPedestrians) || include("loadPedestrians.jl")
isdefined(:loadObstacles) || include("loadObstacles.jl")
isdefined(:loadWayPoints) || include("loadWayPoints.jl")
isdefined(:loadObjectives) || include("loadObjectives.jl")
isdefined(:solveFast) || include("../visibility/solveFast.jl")
isdefined(:isVisible) || include("../visibility/isVisible.jl")
isdefined(:preComputeWayPoints) || include("preComputeWayPoints.jl")

using types
using LibExpat

const baseDirectory = "C:/Users/altieres/Box Sync/Copy/Mestrado/Dissertacao/materialJuliaLang"
function loadAll()
        pedestriansMatLab = readcsv("$baseDirectory/pedestrians.csv")
        obstaclesMatLab = readcsv("$baseDirectory/obstacles.csv")
        wayPointsMatLab = readcsv("$baseDirectory/wayPoints.csv")
        objectivesMatLab = readcsv("$baseDirectory/objectives.csv")

        scene = Scene(loadPedestrians(pedestriansMatLab),loadObstacles(obstaclesMatLab),loadWayPoints(wayPointsMatLab),loadObjectives(objectivesMatLab))
        retornoNovo = preComputeWayPoints(scene.wayPoints,scene.objectives,scene.obstacles)
        scene.wayPoints = retornoNovo
        return scene
end
const baseDirectoryXMLWindows = "C:/Users/altieres/Box Sync/Copy/Mestrado/Dissertacao/materialJuliaLang/scenarios"
const baseDirectoryXMLLinux = "/home/altieres/Copy/Mestrado/Dissertacao/materialJuliaLang/scenarios"
const baseFolderScenarios = @linux? baseDirectoryXMLLinux:baseDirectoryXMLWindows
function loadAll(file::String)
		
		fileReader = open("$baseFolderScenarios/$file.scn","r")
		function processPedestrian(n)
			cache = Array(Float64,6)
			retorno = zeros(6,n)
			for i in 1:n
				read!(fileReader,cache)
				retorno[1,i] = cache[2]
				retorno[2,i] = cache[3]
				retorno[3,i] = cache[4]
				retorno[4,i] = cache[5]
				retorno[5,i] = cache[6]
				retorno[6,i] = 1.0
			end
			return retorno
		end
		function processObstacle(n)
			cache = Array(Float64,4)
			retorno = zeros(4,n)
			for i in 1:n
				read!(fileReader,cache)
				retorno[1,i] = cache[1]
				retorno[2,i] = cache[2]
				retorno[3,i] = cache[3]
				retorno[4,i] = cache[4]
			end
			return retorno
		end
		function processWayPoint(n)
			cache = Array(Float64,3)
			retorno = zeros(5,n)
			for i in 1:n
				read!(fileReader,cache)
				retorno[1,i] = cache[1]
				retorno[2,i] = cache[2]
				retorno[3,i] = cache[3]
				retorno[4,i] = 0.0
				retorno[5,i] = realmax(typeof(0.0))
			end
			return retorno
		end
		function processObjective(n)
			cache = Array(Float64,3)
			retorno = zeros(3,n)
			for i in 1:n
				read!(fileReader,cache)
				retorno[1,i] = cache[1]
				retorno[2,i] = cache[2]
				retorno[3,i] = cache[3]
			end
			return retorno
		end
		n = read(fileReader,Int64)
		print("n:$n\n")
		pedestriansMatLab = processPedestrian(n)
		
		n = read(fileReader,Int64)
		print("n:$n\n")
        obstaclesMatLab = processObstacle(n)
        
        n = read(fileReader,Int64)
        print("n:$n\n")
        wayPointsMatLab = processWayPoint(n)

        n = read(fileReader,Int64)
        print("n:$n\n")
        objectivesMatLab = processObjective(n)

        close(fileReader)
        scene = Scene(loadPedestrians(pedestriansMatLab),loadObstacles(obstaclesMatLab),loadWayPoints(wayPointsMatLab),loadObjectives(objectivesMatLab))
        retornoNovo = preComputeWayPoints(scene.wayPoints,scene.objectives,scene.obstacles)
        scene.wayPoints = retornoNovo
        return scene
end

function loadAllXML(file::String)
		baseFolder = @linux? baseDirectoryXMLLinux:baseDirectoryXMLWindows
		scenarioXML = xp_parse(readall("$baseFolderScenarios/$file.xml"))

        pedestriansXML = scenarioXML["agent"]
        obstaclesXML = scenarioXML["obstacle"]
        wayPointsXML = scenarioXML["waypoint"]
        objectivesXML = scenarioXML["objective"]

        return Scene(loadPedestrians(pedestriansXML),loadObstacles(obstaclesXML),loadWayPoints(wayPointsXML),loadObjectives(objectivesXML))
end
