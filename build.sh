cat hammerhead.js Thing.js util.js > hammerhead.all.js
node ~/.npm/uglify-js/1.3.3/package/bin/uglifyjs hammerhead.all.js > hammerhead.min.js 
rm hammerhead.all.js
