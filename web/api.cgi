#!/bin/sh
NAME=eyefiserver
CONFIG=/etc/$NAME.conf
DAEMON=/etc/init.d/$NAME
LOG=/var/log/$NAME.log
GREP=/bin/grep
ECHO=/bin/echo
CAT=/bin/cat
SED=/bin/sed
READLINK=/usr/bin/readlink
SUDOUSR=/opt/bin/sudo
SUDOOPT=/usr/bin/sudo
function getparam {
	$ECHO "$QUERY_STRING" | $SED -r "s|^.*$1=([^&]*).*$|\1|" | $SED "s/%20/ /g" | $SED "s/%3C/</g" | $SED "s/%3E/>/g"
}
function save {
	$SED -i -r "s/^\s*$1\s*[:=].*$/$1:$(getparam $1)/" "$CONFIG"
}
echo Content-Type: text/plain
echo ""
ACT=$(getparam act)
case "$ACT" in
	getval)
		PARAM=$(getparam name)
		$GREP $PARAM: "$CONFIG" | $SED -r "s/^\s*$PARAM\s*[:=]\s*(.*)\s*$/\1/"
		;;
	save)
		while [ -L ${CONFIG} ]
		do
			CONFIG=`$READLINK "$CONFIG"`
		done
		if [ -w ${CONFIG} ]; then
			save host_name
			save host_port
			save mac_0
			save upload_key_0
			save mac_1
			save upload_key_1
			save upload_dir
			save upload_uid
			save upload_gid
			save upload_file_mode
			save upload_dir_mode
			$ECHO "Configuration saved."
			[ -x $SUDOUSR ] && SUDO=$SUDOUSR
			[ -x $SUDOOPT ] && SUDO=$SUDOOPT
			[ -z ${SUDO} ] && $ECHO "Daemon NOT restarted: sudo not found." || $SUDO -u \#0 $DAEMON reload 2>&1
		else
			$ECHO "Configuration NOT saved: not enough permissions."
		fi
		;;
	getlog)
		$CAT "$LOG"
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
