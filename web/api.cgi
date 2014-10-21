#!/bin/sh
NAME=eyefiserver
DAEMON_NAME=EyeFiServer
CONFIG=/etc/$NAME.conf
TMPCONFIG=/tmp/$NAME.conf
DAEMON=/etc/init.d/$NAME
LOG=/var/log/$NAME.log
GREP=/bin/grep
ECHO=/bin/echo
CAT=/bin/cat
SED=/bin/sed
CP=/bin/cp
RM=/bin/rm
READLINK=/usr/bin/readlink
SUDOUSR=/opt/bin/sudo
SUDOOPT=/usr/bin/sudo
function getparam {
	$ECHO "$QUERY_STRING" | $SED -r "s|^.*$1=([^&]*).*$|\1|" | $SED "s/%20/ /g" | $SED "s/%3C/</g" | $SED "s/%3E/>/g" | $SED "s/%25/%/g" | $SED "s/%2F/\//g"
}
function getval {
	$GREP $1: "$CONFIG" | $SED -r "s/^\s*$1\s*[:=]\s*(.*)\s*$/\1/"
}
function save {
	$SED -i -r "s|^\s*$1\s*[:=].*$|$1:$(getparam $1)|" "$TMPCONFIG"
}
function passtodaemon(){
	[ -x $SUDOUSR ] && SUDO=$SUDOUSR
	[ -x $SUDOOPT ] && SUDO=$SUDOOPT
	if [ -z ${SUDO} ]; then
		$ECHO "Can not $1 $DAEMON_NAME: sudo not found"
		return 1
	else
		$SUDO -u \#0 $DAEMON $1 2>&1
	fi
}
echo Content-Type: text/plain
echo ""
ACT=$(getparam act)
case "$ACT" in
	start|stop|restart)
		passtodaemon $ACT
		;;
	status)
		$DAEMON $ACT 2>/dev/null
		;;
	getval)
		getval $(getparam name)
		;;
	save)
		while [ -L ${CONFIG} ]
		do
			CONFIG=`$READLINK "$CONFIG"`
		done
		if [ -w ${CONFIG} ]; then
			$CP -f $CONFIG $TMPCONFIG
			save mac_0
			save upload_key_0
			save mac_1
			save upload_key_1
			save geotag_enable
			save geotag_lag
			save geotag_accuracy
			save upload_dir
			save upload_uid
			save upload_gid
			save upload_file_mode
			save upload_dir_mode
			$CP -f $TMPCONFIG $CONFIG
			$RM -f $TMPCONFIG
			if passtodaemon "reload"; then
				$ECHO "Configuration applied"
			else
				$ECHO "Configuration saved"
			fi
		else
			$ECHO "Configuration NOT saved: not enough permissions"
		fi
		;;
	getlog)
		$CAT "$LOG"
		;;
	clearlog)
		$ECHO -n > "$LOG"
		$ECHO "$DAEMON_NAME log cleared"
		;;
	getuids)
		case "$(getparam name)" in
			upload_uid)
				FILE=/etc/passwd
				;;
			upload_gid)
				FILE=/etc/group
				;;
		esac
		[ -z ${FILE} ] || $SED -r 's/^([^:]*):[^:]*:([^:]*):.*$/\1:\2/' "$FILE"
		;;
	*)
		;;
esac
