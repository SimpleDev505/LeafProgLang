// deno-Lint-ignore-file no-empty-interface

export type NodeType = 
"Program"        |
"VarDeclaration" |

"AssignmentExpr" |

"Property"       |
"ObjectLiteral"  |
"NumericLiteral" | 
"Identifier"     | 
"BinaryExpr"     ;
export interface Smt{
     kind:NodeType;
}

export interface Program extends Smt{
    kind:"Program";
    body:Smt[];
}
export interface VarDeclaration extends Smt{
    kind:"VarDeclaration";
    constant: boolean;
    identifier:string;
    value?:Expr;

}



export interface Expr extends Smt{}

export interface AssignmentExpr extends Expr
{
    kind:"AssignmentExpr";
    assign:Expr;
    value:Expr;
}


export interface BinaryExpr extends Expr{
    kind:"BinaryExpr";
    left:Expr;
    right:Expr;
    operator:string;
}
export interface Identifier extends Expr{
    kind:"Identifier";
    symbol:string;
}


export interface NumericLiteral extends Expr{
    kind:"NumericLiteral";
    value:number;
}

export interface Property extends Expr{
    kind:"Property";
    key:string;
    value?:Expr;
}

export interface ObjectLiteral extends Expr{
    kind:"ObjectLiteral";
    properties:Property[];
}


