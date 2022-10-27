var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

//추가한 부분
var mysql = require('mysql');
// Connection 객체 생성 
var connection = mysql.createConnection({
 // !!!!KIST 정보에 맞게 바꾸기  
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
  if (err) {     
    console.error('mysql connection error');     
    console.error(err);     
    throw err;   
  } 
});

// ============= api =================

// api/data/processList (프로세스 리스트 가져오기)
router.get('/processList', function (req, res) {
  connection.query('SELECT * FROM process_name', function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
})

// api/data/searchList (조회결과 리스트 가져오기)
router.get('/searchList', function (req, res) {
  console.log("searchList");
  console.log(req.query)
  
  if (req.query.selectedProcess == '') {
    console.log("전체 조회!");

    connection.query("SELECT a.PROCESS_NM, b.* " +
    "FROM process_name a LEFT JOIN process_result b ON a.PROCESS_ID = b.PROCESS_ID " +
    "where DATE_FORMAT(b.rundate,'%Y-%m-%d') BETWEEN '" + req.query.startDt + "' " +
    "and '" + req.query.endDt + "' ", 
    function (err, rows) {
      if (err) throw err;
      res.send(rows);
    });


  } else if (req.query.selectedProcess != '') {
    console.log("selectedProcess 값이 있는 조회!");

    var sql = "SELECT a.PROCESS_NM, b.* " +
    "FROM process_name a LEFT JOIN process_result b ON a.PROCESS_ID = b.PROCESS_ID " +
		"where DATE_FORMAT(b.rundate,'%Y-%m-%d') BETWEEN '" + req.query.startDt + "' " +
		"and '" + req.query.endDt + "' "+
		"and b.PROCESS_ID = '"+req.query.selectedProcess+"' " +
		"and a.PROCESS_ID = '"+req.query.selectedProcess+"'"
    connection.query(sql, function (err, rows) {
      if (err) throw err;
      res.send(rows);
    });
  }
  
})

// ===================================



module.exports = router;
