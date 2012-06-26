#!/bin/sh
QPKG_NAME="EyeFiServer"
NAME="eyefiserver"
CONF=/etc/config/qpkg.conf
QPKG_DIR=$(/sbin/getcfg $QPKG_NAME Install_Path -d "" -f $CONF)
DAEMON=$QPKG_DIR/${NAME}.py
CFGFILE=/etc/config/${NAME}.conf
LOGFILE=/var/log/${NAME}.log

case "$1" in
  start)
    ENABLED=$(/sbin/getcfg $QPKG_NAME Enable -u -d FALSE -f $CONF)
    if [ "$ENABLED" != "TRUE" ]; then
        echo "$QPKG_NAME is disabled."
        exit 1
    fi
    $DAEMON start $CFGFILE $LOGFILE
    ;;
  stop|restart|reload)
    $DAEMON $1 $CFGFILE $LOGFILE
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|reload}"
    exit 1
esac

exit 0
