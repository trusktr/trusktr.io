var initialtime;
var finaltime;
var number = 7918792357183944;
var digits = 0;




initialtime = new Date().getTime();

var interim = number;
digits = 0;
while (interim > 0) {
    interim = Math.floor(interim / 10);
    digits++;
}

finaltime = Math.abs(new Date().getTime() - initialtime);
console.log("execution time1: "+finaltime);
console.log("number of digits: "+digits);





initialtime = new Date().getTime();

digits = 0;
var string = ""+number;
digits = string.length;

finaltime = Math.abs(new Date().getTime() - initialtime);
console.log("execution time2: "+finaltime);
console.log("number of digits: "+digits);
console.log("number: "+number);
