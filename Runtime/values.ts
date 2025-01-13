export type ValueType = "null" | "number" | "boolean";

export interface RuntimeValue {
    type:ValueType;
}

export interface NullValue extends RuntimeValue {
    type:"null";
    value:null;
}

export function MK_NULL()
{
    return {type:"null",value:null} as NullValue; 
}

// ------------------------------------------
 export interface BoolValue extends RuntimeValue 
 {
     type:"boolean";
     value:boolean;
 }
  
export function MK_BOOL(b= true){
    return {type:"boolean",value:b} as BoolValue;
}
// ---------------------------------------------
export interface NumberValue extends RuntimeValue {
    type:"number";
    value:number;
}

export function MK_NUMBER(n = 0){
return {type:"number",value:n} as NumberValue; 
}
