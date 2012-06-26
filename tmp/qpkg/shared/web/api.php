<?php
	$QPKG_NAME="EyeFiServer";
	$NAME="eyefiserver";
	$CONFIG="/etc/config/$NAME.conf";
	$DAEMON="/etc/init.d/$NAME.sh";
	$LOG="/var/log/$NAME.log";
	function getcfg($field)
	{
		global $QPKG_NAME, $CONFIG;
		return trim(exec("/sbin/getcfg $QPKG_NAME $field -d '' -f '$CONFIG'"));
	}
	function setcfg($field, $value)
	{
		global $QPKG_NAME, $CONFIG;
		exec("/sbin/setcfg $QPKG_NAME $field '$value' -c -f '$CONFIG'");
	}
	function save($key){
		if(array_key_exists($key, $_GET)){
			setcfg($key,$_GET[$key]);
		}
	}
	if(array_key_exists(act, $_GET)){
		switch($_GET[act]){
		case 'save':
			save(host_name);
			save(host_port);
			save(mac_0);
			save(upload_key_0);
			save(mac_1);
			save(upload_key_1);
			save(upload_dir);
			save(upload_uid);
			save(upload_gid);
			save(upload_file_mode);
			save(upload_dir_mode);
			echo "Configuration saved. ".exec("/opt/bin/sudo -u admin $DAEMON reload 2>&1");
			break;
		case 'getlog':
			$handle = fopen($LOG,"r");
			echo fread($handle,10000000);
			fclose($handle);
			break;
		}
		exit;
	}
?>
