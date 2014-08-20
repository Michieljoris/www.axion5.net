var log = logthis._create('router.js');
var view;
  
var routes = [
  { path: '/', action: index }
  ,{ path: '/foo', action: foo }
  ,{ path: '/user/:user', action: show }
  ,{ path: '*', action: r404 }
];

function index(context) {
    view.innerHTML = "<h1>404</h1><br>This path doesn\'t exist: " + context.path + '';
    console.log('index', arguments);
    var request = new XMLHttpRequest();
    log('retrieving index');
    
    request.open('GET', 'blog/articles.json', true);
    request.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded; charset=UTF-8');
    function reqListener () {
        console.log(this.responseText);
    }

    request.onload = reqListener;
    request.send();
}

function show() {
    document.querySelectorAll('title')[0].innerHTML = 'user';
    console.log('show', arguments);
}

function foo() {
    document.querySelectorAll('title')[0].innerHTML = 'foo';
    console.log('foo', arguments);
}

function r404(context) {
    view.innerHTML = "<h1>404</h1><br>This path doesn\'t exist: " + context.path + '';
    console.log('404', arguments);
}


function initRoutes(routes, someView) {
    routes.forEach(function(route) {
        page(route.path, route.action);
    });
    view = someView;
    page.start();
  }


module.exports = {
    init: function(view) {
        initRoutes(routes, view)   ;
    }
};
