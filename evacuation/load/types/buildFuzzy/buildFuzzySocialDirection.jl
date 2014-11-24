using JuliaFuzzy.EngineSkeleton
using JuliaFuzzy.EngineSkeleton
using JuliaFuzzy.Norms.TNorm
using JuliaFuzzy.Norms.Norm
using JuliaFuzzy.Norms.SNorm
using JuliaFuzzy.Norms.TNorms.Minimum
using JuliaFuzzy.Norms.SNorms.Maximum
using JuliaFuzzy.Norms.TNorms.AlgebraicProduct
using JuliaFuzzy.Norms.TNorms.DrasticProduct
using JuliaFuzzy.Norms.SNorms.AlgebraicSum
using JuliaFuzzy.Defuzzifiers.Centroid
using JuliaFuzzy.Defuzzifiers.FastCentroid
using JuliaFuzzy.Rules.Rule
using JuliaFuzzy.Rules.RuleBlock
using JuliaFuzzy.Variables.InputVariable
using JuliaFuzzy.Variables.OutputVariable
using JuliaFuzzy.Terms.Constant
using JuliaFuzzy.Terms.Triangle
using JuliaFuzzy.Terms.Gaussian
using JuliaFuzzy.Terms.Sigmoid
using JuliaFuzzy.Terms.Term

using JuliaFuzzy.parseRule
using JuliaFuzzy.configure
using JuliaFuzzy.buildEngine
using JuliaFuzzy.firstConfiguration

function buildFuzzySocialDirection()
    #include("JuliaFuzzy\JuliaFuzzy.jl")

    const float = Float64
    const resolution = 200.0

    engineSkeleton = EngineSkeleton{float}()
    engineSkeleton.inputVariables = InputVariable{float}[]
    engineSkeleton.outputVariables = OutputVariable{float}[]
    engineSkeleton.ruleBlocks = RuleBlock[]
    engineSkeleton.conjunction = AlgebraicProduct()
    engineSkeleton.disjunction = Maximum()
    engineSkeleton.activation = Minimum()
    engineSkeleton.accumulation = Maximum()
    engineSkeleton.defuzzifier = FastCentroid{float}()

    Distance = InputVariable{float}()
    Distance.value = 0.000
    Distance.name = :Distance
    #Distance.maxValue = 4.0 + (1.5*5)
    #Distance.minValue = 0.0 - (0.2*5)
    Distance.terms = Term[]

    push!(Distance.terms,Sigmoid{float}(:NEAR,-1.8, 2.5))
    push!(Distance.terms,Sigmoid{float}(:FAR, 1.0,2.5))

    push!(engineSkeleton.inputVariables,Distance)

    Angle = InputVariable{float}()
    Angle.value = 0.000
    Angle.name = :Angle
    #Angle.maxValue = pi + (pi*0.3*5)
    #Angle.minValue = pi - (pi*0.1*5)
    Angle.terms = Term[]

    push!(Angle.terms,Gaussian{float}(:LITTLE, 0.0, pi*0.20))
    push!(Angle.terms,Gaussian{float}(:BIG, pi, pi*0.35))

    push!(engineSkeleton.inputVariables,Angle)

    VelocityRelative = InputVariable{float}()
    VelocityRelative.value = 0.000
    VelocityRelative.name = :VelocityRelative
    #VelocityRelative.maxValue = 0.5 + (1.0*6)
    #VelocityRelative.minValue = 0.1 - (0.2*5)
    VelocityRelative.terms = Term[]

    push!(VelocityRelative.terms,Sigmoid{float}(:FAST,1.0,2.4))
    push!(VelocityRelative.terms,Sigmoid{float}(:SLOW,-6.0,1.7))  
    
    push!(engineSkeleton.inputVariables,VelocityRelative)

    TurnPercentil = OutputVariable{float}()
    TurnPercentil.name = :TurnPercentil
    reducer = 1.0
    shifter = 0.0
    TurnPercentil.maxValue = 1.0*reducer+shifter
    TurnPercentil.minValue = -1.0*reducer+shifter
    TurnPercentil.terms = Term[]

    #push!(Force.terms,Triangle{float}(:LOW,-0.8*reducer+shifter, 0.8*reducer+shifter))
    #push!(Force.terms,Triangle{float}(:HIGH, 0.6*reducer+shifter, 1.0*reducer+shifter))
    push!(TurnPercentil.terms,Triangle{float}(:LOW,-0.9*reducer+shifter, 0.9*reducer+shifter))
    push!(TurnPercentil.terms,Triangle{float}(:HIGH, 0.1*reducer+shifter, 1.9*reducer+shifter))

    push!(engineSkeleton.outputVariables,TurnPercentil)

    firstConfiguration(engineSkeleton)

    TurnController = RuleBlock(:TurnController)
    push!(engineSkeleton.ruleBlocks,TurnController)

    rule1 = parseRule(engineSkeleton,"if Angle is BIG then TurnPercentil is LOW")
    push!(TurnController.rules,rule1)

    rule2 = parseRule(engineSkeleton,"if Distance is FAR then TurnPercentil is LOW")
    push!(TurnController.rules,rule2)

    rule3 = parseRule(engineSkeleton,"if VelocityRelative is SLOW then TurnPercentil is LOW")
    push!(TurnController.rules,rule3)
    # 
    rule4 = parseRule(engineSkeleton,"if Angle is LITTLE and VelocityRelative is FAST and Distance is NEAR then TurnPercentil is HIGH")
    push!(TurnController.rules,rule4)

    configure(engineSkeleton)
    
    engineFinal = buildEngine(engineSkeleton)

    return engineFinal
end
