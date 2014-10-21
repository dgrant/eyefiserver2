#!/bin/sh
NAME=eyefiserver
mkdir -p config shared/web/css shared/web/images shared/web/js shared/ui/css shared/ui/images shared/ui/langs
ln ../etc/$NAME.conf config
ln ../etc/init.d/$NAME shared
ln ../usr/local/bin/$NAME.py shared
ln ../web/* shared/web/
ln ../web/.htaccess shared/web/
ln ../web/css/* shared/web/css/
ln ../web/images/* shared/web/images/
ln ../web/js/* shared/web/js/
ln ui/* shared/ui/
cp -d ui/api.cgi shared/ui/
ln ui/css/* shared/ui/css/
ln ui/images/* shared/ui/images/
ln ui/langs/* shared/ui/langs/
