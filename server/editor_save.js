/*global require:false exports:false process:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var VOW = require('dougs_vow');
var htmlBuilder = require('html-builder');

function sendResponse(res, err) {
    var headers = {'Content-Type': 'text/html'};
    var returnCode = 403;
    var descr = err;
    if (!err) {
        // var expireDate = new Date(new Date().getTime() + 24*60*60).toUTCString();
        // headers['Set-Cookie'] = 'persona=' +obj.email + '; expires=' + expireDate;
        returnCode = 200; 
        descr = "OK";
    }
    res.writeHead(returnCode, descr, headers);
    res.write(JSON.stringify({ success: !err, error: err}));
    res.end();
}

function getData(req) {
    var vow = VOW.make();
    console.log('in getData');
    var data = '';
    req.on('data', function(chunk) {
        console.log("received data!! And the chunk is:", chunk);
        data+=chunk;
    });
    
    req.on('error', function(e) {
        console.log('error on req!!!', e);
        vow['break']('Error on req ' + e.toString());
    });
    
    req.on('end', function() {
        console.log('received all data');
        vow.keep(data);
    });
    return vow.promise;
}

function saveFile(data, req) {
    var vow = VOW.make();
    console.log('in saveFile');
    
    try {
        // data = JSON.parse(data);
        // console.log('data received is:', data);
        var fs = require('fs');
        // console.log('about to write file');
        var path = req.url.query && req.url.query.path;
        fs.writeFile(process.cwd() + '/build/' + path, data, function(err) {
            if(err) {
                console.log('ERROR!!!', err);
                vow['break']('Error trying to save file ' + err.toString());
            } else {
                console.log("The file was saved!");
                vow.keep();
            }
        }); 
        // res.write(JSON.stringify(data));
    } catch(e) {
        console.log('Failure to parse json');
        vow['break']('Probably failure to parse json' + e.toString());
            
    }
    return vow.promise;
} 

module.exports = function(req, res) {
    console.log("saveFile is handling post!!");
    // req.session.get()
    //     .when(
    //         function(session) {
    //             console.log('session data is: ' , session);
    //             if (!session.data || !session.data.verified) return VOW.broken('Not authorized.');
    //             return getData(req);
    //         })
    //     .when(
    //         function(data) {
    //             console.log('data received', data);
    //             return saveFile(data, req);
    //         })
    //     .when(
    //         function() {
    //             console.log('file saved');
    //             console.log('rebuilding site and sending response');
    //             htmlBuilder.build();
    //             sendResponse(res);
    //         },
    //         function(err) {
    //             console.log('error', err);
    //             sendResponse(res, err);
    //         });
    var data;
    getData(req)
        .when(
            function(someData) {
                data = someData;
                console.log('data received', data);
                return req.session.get();
            })
        .when(function(session){
            console.log('session data is: ' , session);
            if (!session.data || !session.data.verified) return VOW.broken('Not authorized.');
            return VOW.kept();
        })
        .when(
            function() {
                return saveFile(data, req);
            })
        .when(
            function() {
                console.log('file saved');
                console.log('rebuilding site and sending response');
                htmlBuilder.build();
                sendResponse(res);
            },
            function(err) {
                sendResponse(res, err);
            }
        );
}; 
