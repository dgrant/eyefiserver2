<?php require_once('api.php'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Eye-Fi Server</title>
	<link rel='icon' type='image/icon' href='favicon.ico' />
	<link rel="stylesheet" type="text/css" href="css/share.css" />
	<link rel="stylesheet" type="text/css" href="css/center.css" />
	<link rel="stylesheet" type="text/css" href="css/desktop.css"/>
	<script src="js/jquery.min.js" type="text/javascript"></script>
	<script src="js/functions.js" type="text/javascript"></script>
</head>
<body>
<div id="wrapper">
<div id="header">
	<img id="logo" src="images/eyefi-logo-v2.png" width="99" height="43" alt="Eye-Fi" />
	<div id="hdrrt"></div>
	<div id="pagetitle"></div>
	<div id="login">
		<span id="login_extras">
			<a href="http://support.eye.fi" target="_blank">Help</a>
		</span>
	</div>
</div>
	<div id="intro"> 
		<div id="introleft">
			
<div id="devicesopts">
	<img id="devgear" src="images/gear-v2.png" width="14" height="14" alt="Devices">
	Eye-Fi Server
</div>

</div> 
	<div id="introtabs">
		<div id='Cards' class="selectedSettingsTab" onclick="activate('Cards');">Cards</div>
		<div id='Host' class="unselectedSettingsTab" onclick="activate('Host');">Host</a></div>
		<div id='Upload' class="unselectedSettingsTab" onclick="activate('Upload');">Upload</div>
		<div id='Log' class="unselectedSettingsTab" onclick="activate('Log');">Log</a></div>
		</div>
	</div>

<div class="settingsContainer">
	<div id="back">
	</div>
	<div class="dialogBlurb"><img src="images/dimicon-networks.jpg" /></div>
	<div class="settingsContent">

		<h1 id="settingsTitle" class="settingsTitle">Cards</h1>
		<div id="cards">
		<fieldset class="bordered">
			<legend class="bordered">Eye-Fi Card 1</legend>
			<h3 class="boldGreyContent">
				MAC address <input id="mac_0" style="width: 100px;" value="<?= getcfg(mac_0); ?>" />
				Upload key <input id="upload_key_0" style="width:250px; margin-top: 10px;" value="<?= getcfg(upload_key_0); ?>" />
			</h3>
			<h3 class="greyContent">
				You can find these values after configuring the card. It is inside C:\Documents and Settings\&lt;User&gt;\Application Data\Eye-Fi\Settings.xml on Windows or ~/Applications Data/Eye-Fi/Settings.xml on Mac search for it and paste it here.
			</h3>
		</fieldset>
		<fieldset id="card2" class="bordered">
			<legend class="bordered">Eye-Fi Card 2</legend>
			<h3 class="boldGreyContent">
				MAC address <input id="mac_1" style="width:100px;" value="<?= getcfg(mac_1); ?>" />
				Upload key <input id="upload_key_1" style="width:250px;" value="<?= getcfg(upload_key_1); ?>" />
			</h3>
			<h3 class="greyContent">
				Additional Eye-Fi card configuration, same as above.
			</h3>
		</fieldset>
		</div>
		
		<div id="host" style='display:none;'>
		<fieldset class="bordered">
			<legend class="bordered">Name</legend>
			<h3 class="boldGreyContent">
				<input id="host_name" style="width: 150px;" value="<?= getcfg(host_name); ?>" /><br>
			</h3>
			<h3 class="greyContent">
				You can leave hostname empty for localhost
			</h3>
		</fieldset>

		<fieldset class="bordered">
			<legend class="bordered">Port</legend>
			<h3 class="boldGreyContent">
				<input id="host_port" style="width:50px;" value="<?= getcfg(host_port); ?>" /><br>
			</h3>
			<h3 class="greyContent">
				Port to listen on
			</h3>
		</fieldset>
		</div>

		<div id="upload" style='display:none;'>
		<fieldset class="bordered">
			<legend class="bordered">Directory</legend>
			<h3 class="boldGreyContent">
				<input id="upload_dir" style="width:100%;" value="<?= getcfg(upload_dir); ?>" />
			</h3>
			<h3 class="greyContent">
				The name of the directory can be a strftime formatted string like
			/share/Multimedia/Eye-Fi/%%Y-%%m-%%d
			</h3>
		</fieldset>

		<fieldset class="bordered">
			<legend class="bordered">Owner</legend>
			<h3 class="boldGreyContent">
				UID <input id="upload_uid" style="width: 25px;" value="<?= getcfg(upload_uid); ?>" />
				GID <input id="upload_gid" style="width: 25px;" value="<?= getcfg(upload_gid); ?>" />
			</h3>
			<h3 class="greyContent">
				The UID of the user and the GID of the group that you want to own the uploaded images
			</h3>
		</fieldset>

		<fieldset class="bordered">
			<legend class="bordered">Permissions</legend>
			<h3 class="boldGreyContent">
				Files <input id="upload_file_mode" style="width: 25px;" value="<?= getcfg(upload_file_mode); ?>" />
				Directories <input id="upload_dir_mode" style="width: 25px;" value="<?= getcfg(upload_dir_mode); ?>" />
			</h3>
			<h3 class="greyContent">
				The permissions to use for the uploaded images and for the directories that are created
			</h3>
		</fieldset>
		</div>

		<div id="log" style='display:none;'>
		<fieldset class="bordered">
			<legend class="bordered">Log</legend>
			<h3 class="boldGreyContent">
				<textarea id="logtext" style="width: 100%; height: 300px;"></textarea>
			</h3>
			<h3 class="greyContent">
			</h3>
			<input type="button" value="Refresh" onclick="refreshlog()" />
		</fieldset>
		</div>

		<input id="apply" type="button" style="margin-top: 10px;" value="Apply" onclick="apply();" />
		<input id="revert" type="button" style="margin-top: 10px;" value="Revert" onclick="revert();" />

	</div>
</div>

<div id="footer"></div>

</div>

</body>
</html>