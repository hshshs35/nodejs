var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

app.get('/about', (req, res) =>{
  res.render('about.hbs', {
      title: 'this is the about page',
      currentYear: new Date().getFullYear()
  });
});

app.get('/', (req, res) =>{
  res.render('index.hbs', {
      title: 'HomePage coming',
      currentYear: new Date().getFullYear(),
      welcomeMessage: 'Welcome to Shawn Huang \'s HomePage'
  });
});

app.listen(port);




hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () =>{
  return new Date().getFullYear();
});
hbs.registerHelper('ScreamOut', (text) =>{
  return text.toUpperCase() + "!!";
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use((req, res, next) =>{
    var log = new Date().toString() + ' method:' + req.method + ' request info:' + req.url;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (error)=>{
        if(error)
            console.log('unable to append to file');
    });
    next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
