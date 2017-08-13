var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://ss.ishadowx.com/"; 

function fetchPage(url) {    
    startRequest(url); 
}

function startRequest(url) {
    //采用http模块向服务器发起一次get请求      
    http.get(url, function (res) {
        var html = ''; //用来存储请求网页的整个html内容
        var ssInfo = []; //用来存储ss信息  
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {
 
            var $ = cheerio.load(html); //采用cheerio模块解析html
 			//获取相关的信息
            $('.hover-text').each(function () {
                var obj = {}
                obj.ipAddress = $(this).find('h4').eq(0).find('span').html()
                obj.port = $(this).find('h4').eq(1).html().slice(12)
                obj.password = $(this).find('h4').eq(2).find('span').html()
                obj.method = $(this).find('h4').eq(3).html().slice(7)
                ssInfo.push(obj)
            })
 
            console.log(ssInfo);
 
            savedContent(ssInfo); //存储ss信息  
        })
    }).on('error', function (err) {
        console.log(err);
    })
}

function savedContent(ssInfo) {

    var path = './ssInfo.json' 
    
    //生成ssInfo.json文件
    fs.exists(path, function(exists){
        if(exists){
            fs.unlinkSync(path) 
        }else{
            fs.appendFile(path,JSON.stringify(ssInfo, null, 4) , 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                }
            })
        }
    })  
}

fetchPage(url);      //主程序开始运行