var util = require('util');
var s = "asdfassadfa   asdf asdfa\
  f\n<!--partial:post/sample-post.html-->\nsome text" ;
        var regexp = /<!--partial:([^>]*)-->([^]*)/;
        var result = regexp.exec(s);
console.log(util.inspect(result, { depth: 10, colors:true}))	;
  
 console.log(result[0]);
 console.log(result[1]);
 console.log(result[2]);
