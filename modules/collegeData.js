const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('jiyrgpkg', 'jiyrgpkg', '8LsNmNAgEIsdce6rqQ1RmTQV-Stce-GS', {
    host: 'salt.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query:{ raw: true }
});


var Student = sequelize.define("Student", {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
});

var Course = sequelize.define("Course", {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

Course.hasMany(Student, { foreignKey: "course" });



function initialize() {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(function () {
                resolve("Operation was a success");
            })
            .catch(function () {
                reject("Unable to sync the database");
            });
    });
}
/*
module.exports.getAllStudents = function () {
    Student.findAll().then(function(data){        
    for(var i =0; i < data.length; i++){
        console.log(data[i]);
    }
});
}


module.exports.getCourses = function () {
    Course.findAll().then(function(data){        
    for(var i =0; i < data.length; i++){
        console.log(data[i]);
    }
});
}*/

function getAllStudents() {
    return new Promise(function (resolve, reject) {
        Student.findAll()
            .then(function (students) {
                resolve(students);
            })
            .catch(function () {
                reject("no results returned");
            });
    });
}


function getCourses() {
    return new Promise(function (resolve, reject) {
        Course.findAll()
            .then(function (courses) {
                resolve(courses);
            })
            .catch(function () {
                reject("no results returned");
            });
    });

}

function getStudentsByCourse(course) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                course,
            },
        })
            .then(function (students) {
                resolve(students);
            })
            .catch(function () {
                reject("no results returned");
            });
    });
}

function getStudentByNum(num) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                studentNum:num,
            },
        })
            .then(function (students) {
                resolve(students[0]);
            })
            .catch(function () {
                reject("no results returned");
            });
    });
}

function addStudent(studentData){
    return new Promise(function (resolve, reject) {
        const payload = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA ? true : false,
            status: studentData.status,
            course: studentData.course,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Student.create(payload)
            .then(function () {
                resolve("Successfully added");
            })
            .catch(function () {
                reject("Unable to create student");
            });
    });
}

function getCourseById(id){
    return new Promise(function (resolve, reject) {
        Course.findAll({
            where: {
                courseId:id
            },
        })
            .then(function (courseList) {
                resolve(courseList[0]);
            })
            .catch(function () {
                reject("no results returned");
            });
    });
}
  
function updatestudent(studentData){
    return new Promise(function (resolve, reject) {
        const payload = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA ? true : false,
            status: studentData.status,
            course: studentData.course,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Student.update(payload, {
            where: { studentNum: studentData.studentNum },
        })
            .then(function () {
                resolve("Successfully updated");
            })
            .catch(function () {
                reject("Unable to update student");
            });
    });
};

function addCourse(course) {
    return new Promise(function (resolve, reject) {
        const payload = {
            courseCode: course.courseCode,
            courseDescription: course.courseDescription,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Course.create(payload)
            .then(function () {
                resolve("Course Successfully added");
            })
            .catch(function () {
                reject("Unable to create course");
            });
    });
}

function updateCourse(course) {
    return new Promise(function (resolve, reject) {
        const payload = {
            courseCode: course.courseCode,
            courseDescription: course.courseDescription,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Course.update(payload, {
            where: { courseId: course.courseId },
        })
            .then(function () {
                resolve("Successfully updated");
            })
            .catch(function () {
                reject("Unable to update course");
            });
    });
}


function deleteCourseById(courseId) {
    return new Promise(function (resolve, reject) {
        Course.destroy({
            where: { courseId:courseId },
        })
            .then(function () {
                resolve("Successfully deleted");
            })
            .catch(function () {
                reject("Unable to delete course");
            });
    });
}


function deleteStudentByNum(studentNum) {
    return new Promise(function (resolve, reject) {
        Student.destroy({
            where: {studentNum:studentNum },
        })
            .then(function () {
                resolve("Successfully deleted");
            })
            .catch(function () {
                reject("Unable to delete student");
            });
    });
}



module.exports = {initialize,getAllStudents,getCourses,getStudentsByCourse,getStudentByNum,addStudent,getCourseById,updatestudent,addCourse,updateCourse,deleteCourseById,deleteStudentByNum}