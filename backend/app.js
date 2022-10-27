var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');

var app = express();

//추가한 부분
var mysql = require('mysql');
const router = require('./routes/index');
// Connection 객체 생성 
var connection = mysql.createConnection({
    //!!!! KIST 정보에 맞게 바꾸기  
    //  host: '161.122.37.174',
    //  port: '13307',
    //  user: 'kist',
    //  password: 'kist',
    //  database: 'kist'
  
  host: 'localhost',
  port: 3306,
  user: 'root',   
  password: 'kist',
  database: 'kist'  
});  
// Connect
connection.connect(function (err) {   
  console.error("##################")
  if (err) {     
    console.error('mysql connection error');     
    console.error(err);     
    throw err;   
  } 
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/data', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
