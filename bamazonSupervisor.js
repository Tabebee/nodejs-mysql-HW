var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./config.js");
var user = config.user;
var password = config.password;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: user,
    password: password,
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    supervisorInquiry();
});


function supervisorInquiry() {
    inquirer.prompt([
        {
            message: "Please select what you want to do",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "option"
        }
    ]).then(function (selection) {
        if (selection.option === "View Product Sales by Department") {
            viewSalesDepartment();
        } else {
            newDepartment();
        }
    })
}



function viewSalesDepartment() {
    connection.query("SELECT * FROM ")
}

function newDepartment() {
    
}
