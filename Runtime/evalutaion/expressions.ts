// deno-lint-ignore-file no-unused-vars
import { Identifier, BinaryExpr, VarDeclaration, AssignmentExpr, Expr } from "../../FrontEnd/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberValue, RuntimeValue, MK_NULL } from "../values.ts";



function evaluate_numeric_binary_expr(lhs:NumberValue,rhs:NumberValue,operator:string):NumberValue
{
    let result: number;
    if (operator == "+") {
        result = lhs.value + rhs.value;
    } else if (operator == "-") {
        result = lhs.value - rhs.value;
    } else if (operator == "*") {
        result = lhs.value * rhs.value;
    } else if (operator == "/") {
        // TODO: Division by zero checks
        result = lhs.value / rhs.value;
    } else {
        result = lhs.value % rhs.value;
    }
    
    return {value:result,type:"number"};
}

export function evaluate_identifier(ident:Identifier,env:Environment):RuntimeValue{
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function evaluate_binary_exp(binop: BinaryExpr,env:Environment):RuntimeValue{
    const lhs = evaluate(binop.left,env);
    const rhs = evaluate(binop.right,env);
    
    if (lhs.type == "number" && rhs.type == "number") {
        return evaluate_numeric_binary_expr(lhs as NumberValue, rhs as NumberValue,binop.operator);
    }
    
    // One or both are NULL
    return MK_NULL();
    
}

export function evaluate_assignment(node:AssignmentExpr,env:Environment):RuntimeValue
{
    if (node.assign.kind !== "Identifier") {
        throw `Invalid assignment expr ${JSON.stringify(node.assign)}`;
      }
      const varname = (node.assign as Identifier).symbol;
    return env.assignVar(varname, evaluate(node.value, env));
}


