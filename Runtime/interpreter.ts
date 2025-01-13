// deno-lint-ignore-file no-unused-vars
import {RuntimeValue, NumberValue, MK_NULL} from "./values.ts"
import {AssignmentExpr, BinaryExpr, Identifier, NumericLiteral,Program,Smt, VarDeclaration} from "../FrontEnd/ast.ts"
import Environment from "./environment.ts";
import { evaluate_program, evaluate_var_declaration } from "./evalutaion/statements.ts";
import { evaluate_assignment, evaluate_binary_exp, evaluate_identifier} from "./evalutaion/expressions.ts";



export function evaluate (astNode:Smt,env:Environment):RuntimeValue {
    switch (astNode.kind)
    {
    case "NumericLiteral":
        return {value:((astNode as NumericLiteral).value),type:"number"} as NumberValue;
    case "Identifier":
        return evaluate_identifier(astNode as Identifier,env);
    case "AssignmentExpr":
        return evaluate_assignment(astNode as AssignmentExpr,env);
    case "BinaryExpr":
        return evaluate_binary_exp(astNode as BinaryExpr,env);
    case "Program":
        return evaluate_program(astNode as Program,env);
    case "VarDeclaration":
        return evaluate_var_declaration(astNode as VarDeclaration,env); 
    default:
        console.error("Undefined Node Interpretation! ",astNode);
        Deno.exit(0);
    }

}

