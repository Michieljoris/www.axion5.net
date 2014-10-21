var git  = require( 'gift');

function sync(repoPath, cb) {
    var repo = git(repoPath);
    console.log("Processing:", repo.path);
    repo.status(function(err, repoStatus) {
        if (err) {
            console.log('Error fetching status: '.red , err);   
            cb();
        }
        else {
            if (repoStatus.clean) {
                console.log('All up to date'.green);
                cb();
            }
            else if (Object.keys(repoStatus.files).length>0) {
                console.log('Adding files'); 
                repo.add('-A', function(err) {
                    if (err) {
                        console.log('Error staging files: '.red , err);   
                        cb();
                    }
                    else {
                        var message = 'Sync ' + new Date();
                        console.log('Commiting: ' + message);
                        
                        repo.commit(message, function(err) {
                            if (err) {
                                console.log('Error commiting:'.red , err);   
                                cb();
                            }
                            else {
                                console.log('Pushing', repo);
                                repo.remote_push('origin', function(err) {
                                    if (err) console.log('Error pushing:'.error , err);
                                    else {
                                        npmList.push(repo.path);
                                        console.log('Done! Added to update npm list'.green); 
                                    }
                                    cb();
                                });
                            
                            }
                        });
                    }
                });
            
            }
            else cb();
        
        }
    });
}
