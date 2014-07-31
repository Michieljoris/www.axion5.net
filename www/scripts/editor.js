myAppModule.factory('editor', function() {
    var signedIn;
    var email;
    var editable = false;
    var $scope;
    var $http;
    var signingIn = false;
    
    var api =  {
        signin: function() {
            signedIn = true;
            editable = false;
            api.toggleEditable();
            
        },
        signout: function() {
            console.log('Signing out..');
            Object.keys(CKEDITOR.instances).forEach(function(id) {
                CKEDITOR.instances[id].setData(partials[id].data);
            }); 
            editable = true;
            api.toggleEditable();
            signedIn = false;
        },
        setEditable: function(value) { editable = value; },
        setEmail: function(value) { email = value; },
        signedIn: function() { return signedIn; },
        email: function(value) { return email; },
        editable: function() { return editable; },
        set: function(scope, http) {
            $scope = scope;
            $http = http;
            $scope.login = function($event) {
                $event.preventDefault();
                console.log('Logging in');
                navigator.id.request();
            };
    
            $scope.logout = function($event) {
                $event.preventDefault();
                console.log('Logging out');
                navigator.id.logout();
            };
        },
        signingIn : function(value) {
            // console.log('signing in ', value, typeof value);
            if (typeof value !== 'undefined')
                signingIn = value;
           return signingIn;
        }
    };
    
    
    function saveFile(fileName, data) {
        if (!fileName) {
            console.log('no filename, so not saving', data);
        }
        console.log('Saving file ' + fileName);
        $http.post('__api/save?path=' + fileName, data).
            success(function(data, status, headers, config) {
	        console.log(data, status, config);
	        if (!data.success) {
                    console.log('Failed to save on the server ', data.error);
                    alert('Warning: this file did not save to the server!!');
                    if (data.error === 'Not authorized.')
                        $scope.signedIn = false;
	        }
	        console.log("Success. Data saved to:", fileName);
                
            }).
            error(function(data, status, headers, config) {
	        console.log('Failed to post data!!', data, status, headers, config);
	        alert('Warning: this file did not save to the server!!\n' +
                      'Reason:' + data.error || status );
	    });
       
    } 
    
    var partials;
    
    var regexp = /<!--partial:([^>]*)-->/;
    api.toggleEditable = function() {
        editable = !editable;
        // console.log('editable?', editable);
        if (editable) {
            setTimeout(function() {
                var editables = $('div[contenteditable=true]');
                editables.each(function(e) {
                    CKEDITOR.inline(editables[e],
                                    { on:
                                      { key:
                                        function() { 
                                                     setTimeout(function() {
                                                         $scope.$apply();
                                                     },100);
                                                   }
                                      }
                                    });
                    
                });
                console.log(CKEDITOR.instances);
                partials = {};
                Object.keys(CKEDITOR.instances).forEach(function(id) {
                    var data = CKEDITOR.instances[id].getData();
                    var fileName = regexp.exec(data);
                    partials[id] = {
                        data: data,
                        fileName: fileName ? fileName[1] : null
                    };
                });
                
            },10);
        }
        else {
            Object.keys(CKEDITOR.instances).forEach(function(id) {
                CKEDITOR.instances[id].destroy();
            });
        }
    };
    
    api.printEditable = function() {
        Object.keys(CKEDITOR.instances).forEach(function(id) {
            var data = CKEDITOR.instances[id].getData();
            console.log(data);
        }); 
        console.log(partials);
    };
    
    api.isDirty = function() {
        var dirty = Object.keys(CKEDITOR.instances)
            .filter(function(id) {
                return CKEDITOR.instances[id].checkDirty();
            });
        // console.log('isDirty', dirty.length);
        // return dirty.length > 0;
       return true;
        
    };
    
    api.saveEditable = function() {
        var result = confirm('Are your sure?\n\nThis will save your changes to the server.');
        if (!result) return;
        console.log('saving editable');
        var count = 0; 
        Object.keys(CKEDITOR.instances)
            .filter(function(id) {
                return CKEDITOR.instances[id].checkDirty();
            })
            .forEach(function(id) {
                console.log('saving ', id);
                count++;
                var data = CKEDITOR.instances[id].getData();
                saveFile(partials[id].fileName, data);
            });
        if (!count) {
            alert("Nothing to save!");
            console.log('Nothing to save!!');
        }
        
    };
    
    api.undoEditable = function() {
        var result = confirm('Are your sure?\n\nThis will undo all your edits. Don\'t forget you can also undo per inline block.');
        if (!result) return;
        Object.keys(CKEDITOR.instances).forEach(function(id) {
            CKEDITOR.instances[id].setData(partials[id].data);
        }); 
            // CKEDITOR.instances['test--'].setData();
    };
    
    api.locationChanged = function(path) {
        console.log('in editor, location is', path);
        editable = false;
        if (signedIn)
            api.toggleEditable();
    };
    return api;
    
});
