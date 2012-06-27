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
function getval {
	$GREP $1: "$CONFIG" | $SED -r "s/^\s*$1\s*[:=]\s*(.*)\s*$/\1/"
}
function save {
	$SED -i -r "s/^\s*$1\s*[:=].*$/$1:$(getparam $1)/" "$CONFIG"
}
echo Content-Type: text/plain
echo ""
ACT=$(getparam act)
case "$ACT" in
	getval)
		getval $(getparam name)
		;;
	save)
		while [ -L ${CONFIG} ]
		do
			CONFIG=`$READLINK "$CONFIG"`
		done
		if [ -w ${CONFIG} ]; then
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
			[ -x $SUDOUSR ] && SUDO=$SUDOUSR
			[ -x $SUDOOPT ] && SUDO=$SUDOOPT
			if [ -z ${SUDO} ]; then
				$ECHO "Service NOT restarted: sudo not found."
			else
				if $SUDO -u \#0 $DAEMON reload 2>&1 ; then
					$ECHO "Configuration applied."
				else
					$ECHO "Configuration saved."
				fi
			fi
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
