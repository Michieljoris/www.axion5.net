var log = logthis._create('main.js');
var router = require('./router.js');
var view;
var editor = new MediumEditor('.editable', {
    anchorInputPlaceholder: 'Type a link',
    buttons: ['bold', 'italic', 'underline', 'anchor',
              'header1', 'header2', 'quote',
              'superscript', 'subscript', 'strikethrough',
              'unorderedlist', 'orderedlist',
              'pre',
              // 'image',
              'indent',
              'outdent'
             ],
    // diffLeft: 25,
    // diffTop: 10,
    firstHeader: 'h1',
    secondHeader: 'h2',
    secondHeader: 'h3',
    delay: 0,
    targetBlank: true
});


// console.log(editor.serialize());
// document.querySelectorAll('#article')[0].addEventListener('input', function() {
//     console.log('inputting');
//     // Do some work
// });
// });


function saveFile(fileName, data) {
    if (!fileName) {
        console.log('no filename, so not saving', data);
    }
    console.log('Saving file ' + fileName);
    var request = new XMLHttpRequest();
    
    // $http.post('__api/save?path=' + fileName, data).
    request.open('POST', '__api/save?path=' + fileName, true);
    request.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded; charset=UTF-8');
    function reqListener () {
        console.log(this.responseText);
    }

    request.onload = reqListener;
    request.send(data);
    
    } 


var saveEditableClick = $("#save-editable-button").asEventStream("click");
saveEditableClick.onValue(function(e) {
    var editables = document.querySelectorAll('.editable');
    // console.log(editables, editables.length);
    var articles = {};
    for (var i = 0; i < editables.length; i++) {
        var filename = editables[i].dataset.filename;
        articles[filename] = editables[i].innerHTML;
        // articles[editables[i].id] = editables[i].innerHTML;
    }
    console.log(articles);
    Object.keys(articles).forEach(function(key) {
        saveFile(key, articles[key]);
    });
    // view.inner
    
    // editables.forEach(function(editable) {
        
    // });
    // var editables = $(".editables")
    
});

var saveClick = $("#save-button").asEventStream("click");
saveClick.onValue(function(e) {
    var request = new XMLHttpRequest();
    log('save button clicked');
    saveFile('nojs/test.html', "some text");
});

var testClick = $("#test-button").asEventStream("click");
testClick.onValue(function(e) {
    
    var regexp = /<!--partial:([^>]*)-->/;
    var data = $(".editable")[0].innerHTML;
    log('data\n', data);
    var fileName = regexp.exec(data)[1];
    log('filename:', fileName);
    // var request = new XMLHttpRequest();
    // console.log('test button clicked');
    // // saveFile('blog/articles/test.html', "some text");
    
    // request.open('GET', 'blog/articles.json', true);
    // request.setRequestHeader('Content-Type',
    //                          'application/x-www-form-urlencoded; charset=UTF-8');
    // function reqListener () {
    //     console.log(this.responseText);
    // }

    // request.onload = reqListener;
    // request.send();
    
});


var newClick = $("#new-button").asEventStream("click");
newClick.onValue(function(e) {
    var request = new XMLHttpRequest();
    console.log('test button clicked');
    saveFile('blog/articles/test.html', "some text");
    
    // request.open('GET', '__api/test', true);
    // request.setRequestHeader('Content-Type',
    //                          'application/x-www-form-urlencoded; charset=UTF-8');
    // function reqListener () {
    //     console.log(this.responseText);
    // }

    // request.onload = reqListener;
    // request.send();
    
});


document.addEventListener('DOMContentLoaded', function(){
    log('document loaded');
    view = document.querySelectorAll('#view')[0];
    router.init(view);
});
