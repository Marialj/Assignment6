/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Maria Joy Student ID: 176251213 Date: 09-Apr-2023
*
*  Online (Cyclic) Link: 
*
********************************************************************************/ 
 

var express = require("express");
var bodyParser = require('body-parser');

const f = require('./modules/collegeData.js')
const exphbs = require("express-handlebars");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
  });


app.engine('.hbs',exphbs.engine({ extname: '.hbs',
helpers:{ navLink:  function(url, options){ return '<li' + ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                     '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
                },
  
  equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
  }
  }
  } 
));

app.set('view engine', '.hbs');

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    f.getAllStudents().then((data) => {
        if(data.length > 0){
            res.render("students",{student: data });
        }
        else{
            res.render("students",{message: "no results"})
        }
    }).catch((err) => {
        res.render("students",{message: "no results" });
    });
   
});

app.get("/courses", (req, res) => {
  f.getCourses().then((data) => {
      if (data.length > 0){
          res.render("courses",{course: data });
      }
      else{
          res.render("courses",{message: "no results" });
      }
      
  }).catch((err) => {
      res.render("courses",{message: "no results" });
  });
});

app.get("/course/:id", (req, res) => {
    if (req.params.id <= 0) {
      res.send("No results");
    } else {
      f.getCourseById(req.params.id).then((data) => {
          if (data) {
            res.render('course', { course: data });
          } else {
            res.status(400).send("Course Not Found");
          }
        }).catch(() => {
          res.render('course', { message: "No Results" });
        });
    }
  });


app.get("/students/:studentNum", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    f.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error 
    }).then(f.getCourses)
    .then((data) => {
        viewData.courses = data; // store course data in the "viewData" object as "courses"

        // loop through viewData.courses and once we have found the courseId that matches
        // the student's "course" value, add a "selected" property to the matching 
        // viewData.courses object

        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.courses = []; // set courses to empty if there was an error
    }).then(() => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    });
});


app.get("/course/:id", (req, res) => {
    if (req.params.id <= 0) {
      res.send("No results");
    } else {
      f.getCourseById(req.params.id).then((data) => {
          if (data) {
            res.render('course', { course: data });
          } else {
            res.status(400).send("Course Not Found");
          }
        }).catch(() => {
          res.render('course', { message: "No Results" });
        });
    }
  });

app.get('/student/course=:value',(req,res)=>{
    f.getStudentsByCourse(req.params.value).then((data)=>{
    res.render('students',{student: data })   
   })
   
     .catch((error)=>res.send({message:"no results"}))
 })

app.get('/courses/add', (req, res) => {
    res.render('addCourse')
})
  
app.post('/courses/add', (req, res) => {
    f.addCourse(req.body).then(res.redirect('/courses'))
})

app.post('/courses/update', (req, res) => {
    f.updateCourse(req.body).then(
        res.redirect("/courses"))
})

app.get("/course/delete/:id", (req, res) => {
    f.deleteCourseById(req.params.id).then(function () {
        res.redirect("/courses");
      })
      .catch(function () {
        res.status(500).send("Unable to Remove Course/Course Not Found");
      });
});

app.get("/student/delete/:num", (req, res) => {
    f.deleteStudentByNum(req.params.num).then(function () {
        res.redirect("/students");
      })
      .catch(function () {
        res.status(500).send("Unable to Remove Student/Student Not Found");
      });
  });

app.get("/", (req, res) => {
    res.render("home");
  });
  
app.get("/about", (req, res) => {
    res.render("about");
  });
  
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
  });
  
app.get("/studentadd", (req, res) => {
    res.render("addStudent");
  });

app.post("/studentadd", (req, res) => {
    f.addStudent(req.body).then(() => {
      res.redirect("/students");
      })
      .catch((err) => {
        res.send({ message: "no results" });
      });
  });

app.post("/students/update", (req, res) => {
    f.updatestudent(req.body).then(() => {
        res.redirect("/students");
    })
    .catch((err) => {
      res.send({ message: "no results" });
    });
});


app.use((req, res) => {
    res.status(404).send("Page Not Found:404");
  });

// setup http server to listen on HTTP_PORT

f.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on port: " + HTTP_PORT)
    });
}).catch((err) => {
    console.log(err);
});



/*
const f = require('./modules/collegeData.js')

f.initialize().then((data) => {

  f.getAllStudents().then((data) => {
    console.log("Successfully retrieved " + data.length + " students");
  }).catch((err) => {
    console.log(err);
    })
  f.getCourses().then((data) => {
      console.log("Successfully retrieved " + data.length + " courses");
  }).catch((err) => {
      console.log(err);
      })
}).catch((err) => {
  console.log(err);
});*/
