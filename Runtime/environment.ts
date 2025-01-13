import {MK_BOOL, MK_NULL, RuntimeValue } from "./values.ts";

export function setUpScope(env:Environment){
    env.declareVar("true",MK_BOOL(true),true);
    env.declareVar("false",MK_BOOL(false),true);
    env.declareVar("null",MK_NULL(),true);
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string,RuntimeValue>;
  private constants:Set<string>;

  constructor(parentENV?: Environment) {
    const global = parentENV ? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();

    if(global){
      setUpScope(this);
    }
  }

  public declareVar(varname: string, value:RuntimeValue,constant:boolean):RuntimeValue {
    if (this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}. As it already is defined.`;
    }

    this.variables.set(varname, value);
    if(constant)
    {
        this.constants.add(varname);

    }
    return value;
  }

  public assignVar(varname: string, value:RuntimeValue):RuntimeValue {
    const env = this.resolve(varname);
    if(env.constants.has(varname)){
        throw "Runtime Error:\n Cannot change the value of "+varname+".'root' enforces immutability for this variable."
    }
    env.variables.set(varname, value);
    return value;
  }

  public lookupVar(varname: string):RuntimeValue {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeValue;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }

    if (this.parent == undefined) {
      throw `Cannot resolve '${varname}' as it does not exist.`;
    }

    return this.parent.resolve(varname);
  }
}