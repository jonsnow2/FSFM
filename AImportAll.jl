windowsBaseFolder = "C:/Users/altieres/Box Sync/Copy/Mestrado/Dissertacao/materialJuliaLang"
linuxBaseFolder = "/home/altieres/Copy/Mestrado/Dissertacao/materialJuliaLang"
cd(@linux?linuxBaseFolder:windowsBaseFolder)

include("evacuation/doEvacuation.jl")

include("saveAll.jl")

include("evacuation/load/loadAll.jl")

include("statistics/prepareScenarios.jl")

include("statistics/runScenarios.jl")

number = 1
prepareScenarios("corredor",number, "corredorT")

runScenarios("corredorT",number)
#scene = loadAll()
#log = doEvacuation(scene,4000)
#saveAll(log)