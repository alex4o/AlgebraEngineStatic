build:
	compass compile
	node_modules/webpack/bin/webpack.js

watch_sass:
	compass watch

watch_js:
	node_modules/webpack/bin/webpack.js --watch

watch_js_dev:
	node_modules/webpack/bin/webpack.js --watch --devtool sourcemap

watch_sync ./config/lsyncd.conf:
	lsyncd -nodaemon ./config/lsyncd.conf
