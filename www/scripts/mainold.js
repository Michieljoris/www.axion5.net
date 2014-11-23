 // { publish: true,
 //  tags: [ 'tag1', 'tag2' ],
 //  categories: [ 'cat1', 'cat2' ],
 //  comments: true,
 //  teaser: '<h3>Some title</h3><p>safdas</p><p>asdfasd</p><p>fasdfa</p><p>\n</p><p>\n</p><p></p><p>\n</p>',
 //  existing: 
 //   { fileName: 'build/post/unpublished/sample-post2.html',
 //     publish: false,
 //     tags: [ 'tag1', 'tag2' ],
 //     categories: [ 'cat1', 'cat2' ],
 //     comments: true,
 //     created: Sun Jan 20 2013 00:00:00 GMT+1000 (EST),
 //     title: 'Some title',
 //     teaser: '<h3>Some title</h3><p>safdas</p><p>asdfasd</p><p>fasdfa</p><p>\n</p><p>\n</p><p></p><p>\n</p>',
 //     published: Mon Mar 20 2000 00:00:00 GMT+1000 (EST) },
 //  key: 'unpublished/sample-post2.html',
 //  created: Sun Jan 20 2013 00:00:00 GMT+1000 (EST),
 //  published: Mon Mar 20 2000 00:00:00 GMT+1000 (EST),
 //  title: 'Some title' } (+1ms)

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
    
    // $http.post('/__api/save?path=' + fileName, data).
    request.open('GET', '/__api/remove?path=' + fileName, true);
    // request.setRequestHeader('Content-Type',
    //                          'application/x-www-form-urlencoded; charset=UTF-8');
    function reqListener () {
        console.log('response: ', this.responseText);
    }

    request.onload = reqListener;
    request.send();
    
} 

function newFile(fileName, data, callback) {
    console.log('newFile!!!');
    if (!fileName) {
        console.log('no filename, so not saving', data);
    }
    console.log('New file ' + fileName);
    var request = new XMLHttpRequest();
    
    // $http.post('/__api/save?path=' + fileName, data).
    request.open('POST', '/__api/new?path=' + fileName, true);
    request.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded; charset=UTF-8');
    function reqListener () {
        console.log('response: ', this.responseText);
        if (callback) callback(this.responseText);
    }

    request.onload = reqListener;
    request.send(data);
    
} 

function saveFile(fileName, data, callback) {
    if (!fileName) {
        console.log('no filename, so not saving', data);
    }
    console.log('Saving file ' + fileName);
    var request = new XMLHttpRequest();
    
    // $http.post('/__api/save?path=' + fileName, data).
    request.open('POST', '/__api/save?path=' + fileName, true);
    request.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded; charset=UTF-8');
    function reqListener () {
        console.log('response: ', this.responseText);
        if (callback) callback(this.responseText);
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
    var postTitle = prompt('New post title ?');
    newFile('post/' + postTitle + '.html',
             "<pre>published: no\n" +
             "title:" + postTitle + "\n" +
             "comments: no</pre>\nWrite post here..",
             function(response) {
                 try {
                     response = JSON.parse(response);
                     if (response.success) location.reload();
                 } catch(e) { console.log(e); };
                    
             });
});

function cleanseOfTags(str) {
    log(str, str.length);
    var result = '';
    var ignore;
    for (var i = 0; i < str.length; i++) {
        var c = str[i];
        if (c === '<') ignore = true;
        if (!ignore) result += c;
        if (c === '>') ignore = false;
    }
    return result;
}


var regexp = /<!--partial:([^>]*)-->([^]*)/;
var saveClick = $("#save-button").asEventStream("click");
saveClick.onValue(function(e) {
    var request = new XMLHttpRequest();
    log('save button clicked');
    var editables = document.querySelectorAll('.editable');
    
    var posts = {};
    
    for (var i = 0; i < editables.length; i++) {
    // for (i = 2; i < 3; i++) {
        //patch/fix of chrome bug:
        unwrap(editables[i],"span"); // remove all spans, preserving their content
    }    
    
    var pres = document.querySelectorAll('.editable pre:first-of-type');
    for (var i = 0; i < pres.length; i++) {
        unwrap(pres[i],"p",function(elm) {
            elm.parentNode.insertBefore(document.createElement('br'),elm);
        });
        var innerHTML = pres[i].innerHTML;
        innerHTML = innerHTML.replace(/<br>/g,'\n');
        pres[i].innerHTML = cleanseOfTags(innerHTML);
    }
    for (var i = 0; i < editables.length; i++) {
    // for (i = 2; i < 3; i++) {
        innerHTML = editables[i].innerHTML;
        // if (innerHTML.trim().slice(innerHTML.length -6) == '</pre>')
        //     innerHTML += "<p>Enter text here</p>";
        // editables[i].innerHTML = innerHTML;
        
        //UNCOMMENT!!!!!!
        // if (editableStrings[i] === innerHTML) continue; 
        // editableStrings[i] = innerHTML;
        
        
        var result = regexp.exec(innerHTML);
        if (!result) continue;
        var fileName = result[1];
        var text = result[2];
        // posts[fileName] = editables[i].innerHTML;
        posts[fileName] = text;
    }
    // console.log(posts);
    Object.keys(posts).forEach(function(key) {
        saveFile(key, posts[key]);
    });
    // // saveFile('nojs/test.html', "some text");
});


var renderClick = $("#render-button").asEventStream("click");
renderClick.onValue(function(e) {
    log('render');
    var request = new XMLHttpRequest();
    
    // $http.post('/__api/save?path=' + fileName, data).
    request.open('GET', '/__api/render', true);
    // request.setRequestHeader('Content-Type',
    //                          'application/x-www-form-urlencoded; charset=UTF-8');
    function reqListener () {
        console.log('response: ', this.responseText);
    }

    request.onload = reqListener;
    request.send();
    
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
    log('serialize', editor.serialize());
    var metas = document.querySelectorAll('.editable pre:first-of-type');
    metas = Array.prototype.slice.apply(metas);
    var teaserBreaks = document.querySelectorAll('.editable pre');
    // log('breaks: ', teaserBreaks);
    teaserBreaks = Array.prototype.slice.apply(teaserBreaks);
    teaserBreaks = teaserBreaks.filter(function(teaserBreak) {
        // log('innerHTML', teaserBreak.innerHTML);
        return teaserBreak.innerHTML.indexOf('-----') !== -1;
    });
    log('break:', teaserBreaks);
    metas = metas.concat(teaserBreaks);
    if (toggle) {
        document.querySelector('#test-button').innerHTML = 'Edit';
        editor.deactivate();   
    }
    else {
        document.querySelector('#test-button').innerHTML = 'Done';
        editor.activate();   
    }
    metas.forEach(function(meta) {
        if (toggle) {
            meta.setAttribute('style', 'display:none;');   
        }
        else {
            meta.removeAttribute('style');   
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


var editableStrings; 
document.addEventListener('DOMContentLoaded', function(){
    log('document loaded');
    view = document.querySelectorAll('#view')[0];
    var editables = document.querySelectorAll('.editable');
    editables = Array.prototype.slice.apply(editables);
    editableStrings = editables.map(function(editable) {
        return editable.innerHTML;
    });
    log(editableStrings);
    
    
    // for (var i = 0; i < editables.length; i++) {
    //     // unwrap(editables[i],"span"); // remove all spans, preserving their content
    //     // var regexp = /<!--partial:([^>]*)-->([^]*)/;
    //     // var data = $(".editable")[0].innerHTML;
    //     var innerHTML = editables[i].innerHTML;
    //     innerHTML = innerHTML.replace(/<br>/g,'\n');
    //     editables[i].innerHTML = innerHTML;
    // } 
    log(editables);
    // router.init(view);
});
