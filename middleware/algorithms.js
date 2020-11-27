const mongoose = require('mongoose');

const Appointment = require('../models/appointment');
const Employee = require('../models/employee');

function countEmp(empId) {
    let result = 0;
    Appointment.find({empId: empId})
        .exec()
        .then(queue => {
            result = queue.length;
            console.log("COUNT IN: " + result);
        })
        .catch(err => {
            console.log(err.message)
            return Infinity;
        });
    console.log("COUNT OUT: " + result);
    return result;
}
function checkEmp(problemId, empId) {
    let result = 0;
    Appointment.find({empId: empId, problemId: problemId})
        .exec()
        .then(appointments => {
            result = appointments.length;
        })
    return result;
}
exports.findEmp = function(problemId) {
    let result = {idEmp: null, EmpNum: null, Place: null};
    Employee.find({Dept: "Dynamic"})
        .exec()


/*    Employee.find({ Dept: "Dynamic" })
        .exec()
        .then(employees => {
            let empList = [];
            let min = Infinity;
            for(let i = 0; i < employees.length; i++) {
                let curCount = countEmp(employees[i]._id);
                if(curCount < min) {
                    empList = [employees[i]];
                    min = curCount;
                } else if(curCount == min) {
                    empList.push(employees[i]);
                }
            }
/!*            if(empList.length == 1) {
                result["idEmp"] = empList[0]._id;
                result["EmpNum"] = empList[0].EmpNum;
                result["Place"] = countEmp(empList[0]._id);
            } else if(empList.length > 1) {
                let max = 0;
                let resultList = [];
                for(let i = 0; i < empList.length; i++) {
                    let curCount = checkEmp(problemId, empList[i]._id);
                    if(curCount > max) {
                        resultList = empList[i];
                        max = curCount;
                    }
                }
                result["idEmp"] = resultList[0]._id;
                result["Place"] = countEmp(resultList[0]._id);
                result["EmpNum"] = resultList[0].EmpNum;
            }*!/
        })*/
    return result;
};

