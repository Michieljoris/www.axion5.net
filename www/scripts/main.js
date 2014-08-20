var log = logthis._create('main.js');
// logthis._on();
// logthis['main.js']._enable();
// logthis._enum();
// var router = require('./router.js');
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
    // disableDoubleReturn: true,
    firstHeader: 'h1',
    secondHeader: 'h2',
    secondHeader: 'h3',
    delay: 0,
    targetBlank: true
});
// this function does the hard work for us
// http://stackoverflow.com/questions/19547209/jquery-remove-span-tags-while-preserving-their-contents-and-replace-divs-an
function unwrap(root,tagname,extra) {
    var elms = root.getElementsByTagName(tagname), l = elms.length, i;
    for( i=l-1; i>=0; i--) {
        // work backwards to avoid possible complications with nested spans
        while(elms[i].firstChild)
            elms[i].parentNode.insertBefore(elms[i].firstChild,elms[i]);
        if( extra) extra(elms[i]);
        elms[i].parentNode.removeChild(elms[i]);
    }
}

// assumes "container" is a pointer to your container, such as from
// using document.getElementById('container') or similar

// console.log(editor.serialize());
// document.querySelectorAll('#article')[0].addEventListener('input', function() {
//     console.log('inputting');
//     // Do some work
// });
// });
function removeFile(fileName) {
    if (!fileName) {
        console.log('no filename, so not removing', fileName);
    }
    log('removing file ' + fileName);
    var request = new XMLHttpRequest();
    
    // $http.post('__api/save?path=' + fileName, data).
    request.open('GET', '__api/remove?path=' + fileName, true);
    // request.setRequestHeader('Content-Type',
    //                          'application/x-www-form-urlencoded; charset=UTF-8');
    function reqListener () {
        console.log('response: ', this.responseText);
    }

    request.onload = reqListener;
    request.send();
    
} 


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
        console.log('response: ', this.responseText);
    }

    request.onload = reqListener;
    request.send(data);
    
} 


// var saveEditableClick = $("#save-editable-button").asEventStream("click");
// saveEditableClick.onValue(function(e) {
//     var editables = document.querySelectorAll('.editable');
//     // console.log(editables, editables.length);
//     var posts = {};
//     for (var i = 0; i < editables.length; i++) {
//         var filename = editables[i].dataset.filename;
//         posts[filename] = editables[i].innerHTML;
//         // articles[editables[i].id] = editables[i].innerHTML;
//     }
//     console.log(posts);
//     Object.keys(posts).forEach(function(key) {
//         saveFile(key, posts[key]);
//     });
//     // view.inner
    
//     // editables.forEach(function(editable) {
        
//     // });
//     // var editables = $(".editables")
    
// });


var newClick = $("#new-button").asEventStream("click");
newClick.onValue(function(e) {
    log('new');
    var fileName = prompt('New post title ?');
    saveFile(fileName, 'new file');
});

var saveClick = $("#save-button").asEventStream("click");
saveClick.onValue(function(e) {
    var request = new XMLHttpRequest();
    log('save button clicked');
    var editables = document.querySelectorAll('.editable');
    console.log(editables, editables.length);
    var posts = {};
    
    for (var i = 0; i < editables.length; i++) {
        unwrap(editables[i],"span"); // remove all spans, preserving their content
        
        var regexp = /<!--partial:([^>]*)-->([^]*)/;
        // var data = $(".editable")[0].innerHTML;
        var innerHTML = editables[i].innerHTML;
        innerHTML = innerHTML.replace(/<br>/g,'\n');
        editables[i].innerHTML = innerHTML;
        log('data\n', innerHTML);
        var result = regexp.exec(innerHTML);
        log('result\n', result);
        var fileName = result[1];
        var text = result[2];
        log('filename:', fileName);
        log('text:', text);
        // var filename = editables[i].dataset.filename;
        // posts[fileName] = editables[i].innerHTML;
        posts[fileName] = text;
        // articles[editables[i].id] = editables[i].innerHTML;
    }
    console.log(posts);
    Object.keys(posts).forEach(function(key) {
        saveFile(key, posts[key]);
    });
    // // saveFile('nojs/test.html', "some text");
});

var deleteClick = $("#delete-button").asEventStream("click");
deleteClick.onValue(function(e) {
    log('delete');
    var fileName = prompt('Delete post with title ?');
    removeFile(fileName);
    // var request = new XMLHttpRequest();
    // log('save button clicked');
    // saveFile('nojs/test.html', "some text");
});


var toggle = 1;
var testClick = $("#test-button").asEventStream("click");
testClick.onValue(function(e) {
    console.log('test click');
    // log(editor.serialize());
    var metas = document.querySelectorAll('.editable pre:first-of-type');
    metas = Array.prototype.slice.apply(metas);
    log('metas:', metas);
    metas.forEach(function(meta) {
        if (toggle) {
            meta.setAttribute('style', 'display:none;');   
            document.querySelector('#test-button').innerHTML = 'Edit';
            editor.deactivate();
        }
        else {
            meta.removeAttribute('style');   
            document.querySelector('#test-button').innerHTML = 'Done';
            editor.activate();
        }
    });
    toggle = 1-toggle;
    // saveFile('blog/articles/test.html', "some text");
    // saveFile('post/test.html', "some text");
    
    // var regexp = /<!--partial:([^>]*)-->/;
    // var data = $(".editable")[0].innerHTML;
    // log('data\n', data);
    // var fileName = regexp.exec(data)[1];
    // log('filename:', fileName);
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



document.addEventListener('DOMContentLoaded', function(){
    log('document loaded');
    view = document.querySelectorAll('#view')[0];
    // router.init(view);
});
