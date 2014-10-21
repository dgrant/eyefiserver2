#!/bin/sh
TAG=$(git describe $(git rev-list --all --tags --max-count=1) | awk -F . '{ printf "%d.%d.%d", $1, $2, $3 + 1}')
git tag -a -m "Deployed $(LANG=en_GB.UTF-8; date)." "$TAG"
echo "Setting version number to: $TAG"
sed -i -r "s/^(QPKG_VER=)?.*/\1\"$TAG\"/" qpkg/qpkg.cfg
sed -i -r "s/>.*(<\/footer>)/>$TAG\1/" web/index.html
sed -i -r "s/(.*QPKGVer: ).*/\1'$TAG',/" qpkg/ui/eyefiserver_view.js
git push --tags
