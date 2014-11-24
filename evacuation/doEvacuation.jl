isdefined(:types) || include("load/types.jl")
isdefined(:move!) || include("move.jl")
#isdefined(:moveByRegion!) || include("moveByRegion.jl")
isdefined(:saveLog) || include("saveLog.jl")


using types
#using Zlib
#using Debug

#scenprint(current_module())
function doEvacuation(scene::Scene,iterations )
    n = length(scene.pedestrians)
    lengthPedestrian = 25
    pedestriansLog = float32(zeros(iterations+1,n*lengthPedestrian))

    saveLog(scene.pedestrians,pedestriansLog,1)
    #print("dsfds");
    #print(iterations);
    
    tic()
    counterPedCal = 0.0
    lengthPedCal = 0.0
    counterFinal = 0
    totalLengthFile = 0
    totalLengthNormal = 0
    for i = 2:(iterations)
        #print("dsfds");
        lengthPedCal = lengthPedCal + move!(scene,i)
        #lengthPedCal = lengthPedCal + moveByRegion!(scene,i)
        counterPedCal = counterPedCal + n
        saveLog(scene.pedestrians,pedestriansLog,i)
        counterFinal = i
        #print("terminou");
    end
    toc()
    #print("vai retornar, haah")
    print("Total cálculos:")
    print(lengthPedCal)
    print("\n")
    print("Total pedestres:")
    print(counterPedCal)
    print("\n")
    print("Media cálculo por pedestre:")
    print(lengthPedCal /counterPedCal)
    print("\n")
    return pedestriansLog
end
