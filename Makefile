build:
	compass compile
	webpack


watch_sass:
	compass watch

watch_js:
	webpack --watch

watch_js_dev:
	webpack --watch --devtool sourcemap

watch_sync lsyncd.conf:
	lsyncd -nodaemon lsyncd.conf