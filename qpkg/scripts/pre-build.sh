#!/bin/sh
NAME=eyefiserver
mkdir config
ln ../etc/$NAME.conf config
mkdir shared
ln ../etc/init.d/$NAME shared
ln ../usr/local/bin/$NAME.py shared
mkdir shared/web
ln ../web/* shared/web/ 2>/dev/null
ln ../web/.htaccess shared/web/
mkdir shared/web/css
ln ../web/css/* shared/web/css/
mkdir shared/web/images
ln ../web/images/* shared/web/images/
mkdir shared/web/js
ln ../web/js/* shared/web/js/
