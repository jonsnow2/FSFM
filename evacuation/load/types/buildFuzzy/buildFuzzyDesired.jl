using JuliaFuzzy.EngineSkeleton
using JuliaFuzzy.Norms.TNorm
using JuliaFuzzy.Norms.Norm
using JuliaFuzzy.Norms.SNorm
using JuliaFuzzy.Norms.TNorms.Minimum
using JuliaFuzzy.Norms.SNorms.Maximum
using JuliaFuzzy.Norms.TNorms.AlgebraicProduct
using JuliaFuzzy.Norms.SNorms.AlgebraicSum
using JuliaFuzzy.Defuzzifiers.Centroid
using JuliaFuzzy.Rules.Rule
using JuliaFuzzy.Rules.RuleBlock
using JuliaFuzzy.Variables.InputVariable
using JuliaFuzzy.Variables.OutputVariable
using JuliaFuzzy.Terms.Constant
using JuliaFuzzy.Terms.Triangle
using JuliaFuzzy.Terms.Gaussian
using JuliaFuzzy.Terms.Term


using JuliaFuzzy.parseRule
using JuliaFuzzy.configure
using JuliaFuzzy.buildEngine

function buildFuzzyDesired()
    #include("JuliaFuzzy\JuliaFuzzy.jl")

    const float = Float64
    const resolution = 200.0

    engineSkeleton = EngineSkeleton{float}()
    engineSkeleton.inputVariables = InputVariable{float}[]
    engineSkeleton.outputVariables = OutputVariable{float}[]
    engineSkeleton.ruleBlocks = RuleBlock[]
    engineSkeleton.conjunction = Minimum()
    engineSkeleton.disjunction = Maximum()
    engineSkeleton.activation = AlgebraicProduct()
    engineSkeleton.accumulation = AlgebraicSum()
    engineSkeleton.defuzzifier = Centroid{float}(resolution)

    Distance = InputVariable{float}()
    Distance.value = 0.000
    Distance.name = :Distance
    Distance.maxValue = 10.0
    Distance.minValue = -0.1
    Distance.terms = Term[]

    #push!(Distance.terms,Triangle{float}(:VERYNEAR,-0.3, 0.3));
    #push!(Distance.terms,Triangle{float}(:NEAR, 0.2, 0.8));
    #push!(Distance.terms,Triangle{float}(:MEDIUM, 0.6, 1.4));
    #push!(Distance.terms,Triangle{float}(:FAR, 1, 3));
    #push!(Distance.terms,Triangle{float}(:VERYFAR, 2, 10));

    push!(Distance.terms,Gaussian{float}(:VERYNEAR,0, 0.1));
    push!(Distance.terms,Gaussian{float}(:NEAR, 0.6, 0.2));
    push!(Distance.terms,Gaussian{float}(:MEDIUM, 1.2, 0.4));
    push!(Distance.terms,Gaussian{float}(:FAR, 2.4, 0.8));
    push!(Distance.terms,Gaussian{float}(:VERYFAR, 5, 1.6));

    push!(engineSkeleton.inputVariables,Distance)

    Force = OutputVariable{float}()
    Force.name = :Force
    Force.maxValue = 10.0
    Force.minValue = -0.01
    Force.terms = Term[]

    push!(Force.terms,Triangle{float}(:VERYLOW,-0.01, 0.01));
    push!(Force.terms,Triangle{float}(:LOW, 0, 0.1));
    push!(Force.terms,Triangle{float}(:MEDIUM, 0.05, 0.3));
    push!(Force.terms,Triangle{float}(:HIGH, 0.15, 1));
    push!(Force.terms,Triangle{float}(:VERYHIGH, 0.5, 10));

    push!(engineSkeleton.outputVariables,Force)

    PowerController = RuleBlock(:PowerController)
    push!(engineSkeleton.ruleBlocks,PowerController)

    rule1 = parseRule(engineSkeleton,"if Distance is VERYNEAR then Force is VERYHIGH")
    push!(PowerController.rules,rule1)

    rule2 = parseRule(engineSkeleton,"if Distance is NEAR then Force is HIGH")
    push!(PowerController.rules,rule2)

    rule3 = parseRule(engineSkeleton,"if Distance is MEDIUM then Force is MEDIUM")
    push!(PowerController.rules,rule3)

    rule4 = parseRule(engineSkeleton,"if Distance is FAR then Force is LOW")
    push!(PowerController.rules,rule4)

    rule5 = parseRule(engineSkeleton,"if Distance is VERYFAR then Force is VERYLOW")
    push!(PowerController.rules,rule5)

    configure(engineSkeleton)
    return buildEngine(engineSkeleton)
end
