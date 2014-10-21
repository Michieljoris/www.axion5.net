var log = logthis._create('main.js');
//Execute here or in web console. Settings get stored in localstorage
// logthis._enable();
// logthis['main.js']._enable();

prettyPrint();   
var active;
try {
    active = $('#menu-' + location.pathname.slice(1, location.pathname.length-5))[0];
    log(active);
} catch(e) {}

if (!active) active = $('#menu-blog')[0];

active.classList.add('active');

var teaserBreaks = document.querySelectorAll('#main-- pre');
teaserBreaks = Array.prototype.slice.apply(teaserBreaks);
teaserBreaks = teaserBreaks.filter(function(teaserBreak) {
    return teaserBreak.innerHTML.indexOf('-----') !== -1;
});
log('break:', teaserBreaks);
if (teaserBreaks.length)
    teaserBreaks[0].setAttribute('style', 'display:none');
