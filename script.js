const $ = id =>
document.getElementById(id);

const UI = {
min: $("min"),
max: $("max"),
divisor: $("divisor"),
num1: $("num1"),
num2: $("num2"),
result: $("result"),
count: $("resultCount")
};

function toBigInt(value){

const str = value.trim();

if(!str)
throw new Error("Number required");

if(!/^-?\d+$/.test(str))
throw new Error("Integers only");

return BigInt(str);

}
