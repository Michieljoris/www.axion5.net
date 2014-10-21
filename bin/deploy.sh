DEPLOY=~/tmp/deploy
GITHUBIO=~/tmp/michieljoris.github.io
echo "--removing $DEPLOY and creating the dir again"
rm -rf $DEPLOY
mkdir $DEPLOY
echo "--Copying www directory of www.axion5.net to $DEPLOY"
cp -r ./www/* $DEPLOY

echo "--Trying to clone github pages to $GITHUBIO"
git clone git@github.com:Michieljoris/michieljoris.github.io.git $GITHUBIO
echo "--Pulling updates in $GITHUBIO"
(cd $GITHUBIO && git pull origin master)
echo "--Copying .git dir from github pages to $DEPLOY"
cp -r $GITHUBIO/.git $DEPLOY 
echo "--Copying scripts from bower_components to www/scripts/bower"
rm $DEPLOY/scripts/bower
rm $DEPLOY/css/bower
rm -rf $DEPLOY/unpublished

mkdir -p $DEPLOY/scripts/bower/jquery/dist
cp ./bower_components/jquery/dist/jquery.js $DEPLOY/scripts/bower/jquery/dist/jquery.js

mkdir -p $DEPLOY/scripts/bower/bootstrap/dist/js/
cp ./bower_components/bootstrap/dist/js/bootstrap.js $DEPLOY/scripts/bower/bootstrap/dist/js

mkdir -p $DEPLOY/scripts/bower/modernizr
cp ./bower_components/modernizr/modernizr.js $DEPLOY/scripts/bower/modernizr

mkdir -p $DEPLOY/scripts/bower/logthis
cp ./bower_components/logthis/logthis.js $DEPLOY/scripts/bower/logthis

mkdir -p $DEPLOY/css/bower/normalize.css
cp ./bower_components/normalize.css/normalize.css $DEPLOY/css/bower/normalize.css

mkdir -p $DEPLOY/css/bower/bootstrap/dist/css
cp ./bower_components/bootstrap/dist/css/bootstrap.css $DEPLOY/css/bower/bootstrap/dist/css

mkdir -p $DEPLOY/css/bower/bootstrap/dist/fonts
cp ./bower_components/bootstrap/dist/fonts/* $DEPLOY/css/bower/bootstrap/dist/fonts

# tree $DEPLOY
echo "--commiting and pushing to github pages"
cd $DEPLOY 
git add -A 
git commit -m "auto deploy" 
git push origin master
echo "--Done."


