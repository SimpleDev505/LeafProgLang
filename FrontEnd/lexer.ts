
export enum TokenType{
    //numerics
    Number,
    Identifier,
    String,
    
    //keywords
    Let,
    Const,
    
    //Operators
    BinaryOperator,
    Equals,
    Comma,Colon,
    SemiColon,
    OpenPar,ClosePar,
    OpenBrace,CloseBrace,
    EOF,


}

const KEYWORDS:Record<string,TokenType> = {  //keywords reserved like let, var...
    age:TokenType.Let,
    root:TokenType.Const,
}

export interface Token {
    value:string,
    type:TokenType,
}
function isAlpha(src:string){
    return src.toUpperCase() != src.toLowerCase();
}
function isInt(src:string){
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0),'9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}
function isSkippable(str:string){
    return str == ' ' || str == '\n' || str == '\t' || str=='\r';
}
function token(value ="",type:TokenType):Token{
    return {value,type};
}

export function tokenize (sourceCode:string):Token[]{
    const tokens = new Array<Token>();
    const src = sourceCode.split("");
    while (src.length > 0){
        if(src[0] =="("){
            tokens.push(token(src.shift(),TokenType.OpenPar));
        }
        else if(src[0] == ")"){
            tokens.push(token(src.shift(),TokenType.ClosePar));  
        }
        else if(src[0] == "{"){
            tokens.push(token(src.shift(),TokenType.OpenBrace));  
        }
        else if(src[0] == "}"){
            tokens.push(token(src.shift(),TokenType.CloseBrace));  
        }
        else if(src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%"){
            tokens.push(token(src.shift(),TokenType.BinaryOperator));
        } else if(src[0] == "="){
            tokens.push(token(src.shift(),TokenType.Equals));
        }else if(src[0] == ";"){
            tokens.push(token(src.shift(),TokenType.SemiColon));
        }
        else if(src[0] == ":"){
            tokens.push(token(src.shift(),TokenType.Colon));
        }
        else if(src[0] == ","){
            tokens.push(token(src.shift(),TokenType.Comma));
        }
        else{

            if(isInt(src[0]))
            {
                    let num = "";
                    while (src.length > 0 && isInt(src[0])){ //go through all numeric input given and get
                        num += src.shift();
                    }
                    tokens.push(token(num,TokenType.Number));
            }
            else if(isAlpha(src[0]))
            {
                    let ident = "";
                    while (src.length > 0 && isAlpha(src[0])){ //go through all identifier and get
                        ident += src.shift();
                    }
                    //check if identifier is user defined or reserved keywords
                    const reserved = KEYWORDS[ident];
                    if(typeof reserved != "number"){

                        tokens.push(token(ident,TokenType.Identifier)); //if reserved
                    } else{
                        tokens.push(token(ident,reserved)); //if not reserved

                    }
            }
            else if(isSkippable(src[0]))
            {
                src.shift();
            }else{
                console.log("Undefined Char(S) found: "+src[0]);
                Deno.exit(0);
            }


        }
    }
    tokens.push({type: TokenType.EOF,value:"EndOfFile"});
    return tokens;
}
// const source =  await Deno.readTextFile("./test.txt");
// for (const token of tokenize(source)){
//     console.log(token);
// }

