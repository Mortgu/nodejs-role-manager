const express = require('express')
const app = express()

const { ROLE, users, projects } = require('./data')
const { authUser, authRole } = require('./basicAuth')
const projectRouter = require('./routes/projects')

const mysql = require('mysql')
const bodyParser = require('body-parser')
const session = require('express-session')
const { scopedProjects } = require('./permissions/project')
const project = require('./permissions/project')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zero'
})

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(express.json())
app.use(setUser)
app.use('/projects', projectRouter)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(__dirname + "/assets/css"))
app.use(express.static(__dirname + "/assets/img"))

app.get('/', (req, res) => {
  res.render('login.ejs')
})

app.get('/files', getProjects, authUser, (req, res) => {
  res.render('index.ejs', {projects:projects})

  projects.length = 0;
})

app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send('Admin Page')
})

app.post('/auth', function(request, response, next) {
  var username = request.body.username
  var password = request.body.password
  if(username && password) {
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        if(results.length > 0) {
          request.session.loggedin = true
          request.session.username = username
          results.forEach(function (row) {
            request.session.userId = row.id
            request.session.role = row.role
          });
          response.redirect('/files')
        } else {
          response.send('Incorrect Username and/or Password!')
        }
        response.end()
    });
  } else {
    response.send('Please enter Username and Password!')
    response.end()
  }
})

function getProjects(req, res, next) {
  connection.query('SELECT * FROM files' , function(error, results, fields) {
    results.forEach(function(row){
      projects.push(row)
    })
  })
  next()
}

function setUser(req, res, next) {
  const userId = session.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}

app.listen(3000)
