//node module
// var opts = {
//   container: 'epiceditor',
//   textarea: null,
//   basePath: 'epiceditor',
//   clientSideStorage: true,
//   localStorageName: 'epiceditor',
//   useNativeFullscreen: true,
//   parser: marked,
//   file: {
//     name: 'epiceditor',
//     defaultContent: '',
//     autoSave: 100
//   },
//   theme: {
//     base: '/themes/base/epiceditor.css',
//     preview: '/themes/preview/preview-dark.css',
//     editor: '/themes/editor/epic-dark.css'
//   },
//   button: {
//     preview: true,
//     fullscreen: true,
//     bar: "auto"
//   },
//   focusOnLoad: false,
//   shortcut: {
//     modifier: 18,
//     fullscreen: 70,
//     preview: 80
//   },
//   string: {
//     togglePreview: 'Toggle Preview Mode',
//     toggleEdit: 'Toggle Edit Mode',
//     toggleFullscreen: 'Enter Fullscreen'
//   },
//   autogrow: true
// }
// var epicEditor = new EpicEditor(opts);

// epicEditor.load();
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
// document.addEventListener('DOMContentLoaded', function(){
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
function index() {
    console.log('index', arguments);
}

function show() {
     
    document.querySelectorAll('title')[0].innerHTML = 'user';
    console.log('show', arguments);
}

function foo() {
    document.querySelectorAll('title')[0].innerHTML = 'foo';
    console.log('foo', arguments);
}

function r404() {
    console.log('404', arguments);
}

page('/', index);
page('/foo', foo);
page('/user/:user', show);
page('*', r404);
page.start();

var view = document.querySelectorAll('#view');
var saveClick = $("#save-button").asEventStream("click");
saveClick.onValue(function(e) {
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


var testClick = $("#test-button").asEventStream("click");
testClick.onValue(function(e) {
    var request = new XMLHttpRequest();
    console.log('test button clicked');
    saveFile('blog/test', "some text");
    
    // request.open('GET', '__api/test', true);
    // request.setRequestHeader('Content-Type',
    //                          'application/x-www-form-urlencoded; charset=UTF-8');
    // function reqListener () {
    //     console.log(this.responseText);
    // }

    // request.onload = reqListener;
    // request.send();
    
});

