// deno-lint-ignore-file no-explicit-any
import { Smt,BinaryExpr,Program,Expr,NumericLiteral,Identifier, VarDeclaration, AssignmentExpr, Property, ObjectLiteral } from "./ast.ts";
import { tokenize ,Token,TokenType} from "./lexer.ts";

export default class Parser{
    private tokens:Token[] = [];

    //------------------------
    private at(){ //current token
        return this.tokens[0] as Token;
    }
    private eat(){  //next token
        const prev  = this.tokens.shift() as Token;
        return prev;
    }
    private expect(type: TokenType, arg: any) {
        const prev  = this.tokens.shift() as Token;
        if(!prev || prev.type != type){
            console.error("Parse Error:\n",arg,prev,"Expected: ",type);
            Deno.exit(1);
        }
        return prev;
      }

    //------------------------
    private not_eof():boolean 
    {
        
        return this.tokens[0].type != TokenType.EOF;
    }

    //------------------------
    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch(tk){
           //reserved types
            case TokenType.Identifier:
                return {kind:"Identifier", symbol:this.eat().value} as Identifier;
            //numerics type
            case TokenType.Number:
                return {kind:"NumericLiteral", value:parseFloat(this.eat().value)} as NumericLiteral;

            case TokenType.OpenPar:
                {
                this.eat();
                const value = this.parse_expr();
                this.expect(TokenType.ClosePar,"Syntax Error:\n An opening parenthesis '(' has not been closed. Please ensure all opening parentheses have corresponding closing parentheses.",);
                return value;
                }
            default:
                console.log("\n Unknown identifier or keyword ->",this.at());
                Deno.exit(1);
                
        }

    }
   
    parse_additive_expr(): Expr 
    {
        let left = this.parse_multiplicative_expr();
        while(this.at().value == "+" || this.at().value == "-"){
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind:"BinaryExpr",
                left,
                right,
                operator,

            }  as BinaryExpr;

        }
        return left;
    }

    parse_multiplicative_expr(): Expr 
    {
        let left = this.parse_primary_expr();
        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%"){
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind:"BinaryExpr",
                left,
                right,
                operator,

            }  as BinaryExpr;

        }
        return left;
    }


    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }
    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr(); // switch this out with objectExpr

        if (this.at().type == TokenType.Equals) {
            this.eat(); // advance past equals
            const value = this.parse_assignment_expr();
            return { value, assign: left, kind:"AssignmentExpr"} as AssignmentExpr;
        }
        
        return left;
        
    }
    private parse_object_expr() {
        if (this.at().type !== TokenType.OpenBrace) {
            return this.parse_additive_expr();
          }
      
          this.eat(); // advance past open brace.
          const properties = new Array<Property>();
      
          while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            const key =
              this.expect(TokenType.Identifier, "Object literal key expected").value;
      
            // Allows shorthand key: pair -> { key, }
            if (this.at().type == TokenType.Comma) {
              this.eat(); // advance past comma
              properties.push({ key, kind: "Property" } as Property);
              continue;
            } // Allows shorthand key: pair -> { key }
            else if (this.at().type == TokenType.CloseBrace) {
              properties.push({ key, kind: "Property" });
              continue;
            }
      
            // { key: val }
            this.expect(
              TokenType.Colon,
              "Missing (:) following identifier in ObjectExpr",
            );
            const value = this.parse_expr();
      
            properties.push({ kind: "Property", value, key });
            if (this.at().type != TokenType.CloseBrace) {
              this.expect(
                TokenType.Comma,
                "Expected (,) or '}' following property",
              );
            }
          }
      
          this.expect(TokenType.CloseBrace, "Object literal missing closing brace.");
          return { kind: "ObjectLiteral", properties } as ObjectLiteral;
    }


    private parse_smt(): Smt 
    {
        switch(this.at().type){
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration();
            
            default:
                return this.parse_expr();
        }
    }
    parse_var_declaration(): Smt {

        const isConstant = this.eat().type ==  TokenType.Const;
        const identifier = this.expect(TokenType.Identifier,"Unexpected end of statement.Did you forget to assign a value?").value;

        if(this.at().type == TokenType.SemiColon){
            this.eat();
            if(isConstant){
                throw "Syntax Error:\n Missing assignment after 'const' keyword.";
            }
            return {kind:"VarDeclaration",identifier,constant:false} as VarDeclaration;
            
        }

        this.expect(TokenType.Equals,"Invalid Assignment:\n '=' must be followed by a value or expression");
        const declaration = {kind:"VarDeclaration",
                            value:this.parse_expr(),
                            identifier,
                            constant:isConstant,
        } as VarDeclaration;

        //make semicolon must end after smt
        this.expect(TokenType.SemiColon,"\n Statement must end with a semicolon (';')!");
        return declaration;

    }


     //------------------------

    public ProduceAST(sourceCode:string):Program
    {
        this.tokens= tokenize(sourceCode);
        const program: Program= {
            kind:"Program",
            body:[],
        };
    
        while(this.not_eof())
        {
            program.body.push(this.parse_smt());
        }
    
        return program;
    }
}
