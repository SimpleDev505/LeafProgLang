import Parser from "./FrontEnd/parser.ts";
import { evaluate } from "./Runtime/interpreter.ts";
import Environment from "./Runtime/environment.ts";
repl();
function repl(){
    const parser = new Parser();
    const env = new Environment();

    

    console.log("\t*****************\n\t* Leaf Language *\n\t* version 0.0.1 *\n\t*       By      *\n\t* @HariRaghavan *\n\t*****************");
    while(true){
        const input = prompt("> ");
        if(!input || input.includes("exit")){
            Deno.exit(1);
        }

        const program  = parser.ProduceAST(input);
        const result =evaluate(program,env);
        console.log(result);

    }
}