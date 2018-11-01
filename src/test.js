let moment = require("moment");

let a = new moment("1/10/2018", "DD/MM/YYYY");
let b = new moment("1/11/2018", "DD/MM/YYYY");

// console.log(moment.duration(b.diff(a)).asDays());

// console.log(new moment().endOf("month").format('DD/MM/YYYY'));

let x = [{ a: "name", b: "dohuta" }, { a: "name2", b: "dohuta2" }];
console.log(x.find(e => e.b === "dohuta").b);
