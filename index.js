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
  database: 'blog'
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

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/dashboard', authUser, (req, res) => {
  //getProjects()
  res.send('Dashboard Page')
})

app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send('Admin Page')
})

app.post('/auth', function(request, response, next) {
  var username = request.body.username
  var password = request.body.password
  if(username && password) {
    getProjects()
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        if(results.length > 0) {
          request.session.loggedin = true
          request.session.username = username
          results.forEach(function (row) {
            request.session.userId = row.id
            request.session.role = row.role
          });
          response.redirect('/dashboard')
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

function getProjects() {
  projects.length = 0;
  connection.query('SELECT * FROM projects', function(error, results, fields) {
      results.forEach(function (row) {
        projects.push(row)
      });
  });
}

module.exports = {getProjects}

function setUser(req, res, next) {
  const userId = session.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}

app.listen(3000)
