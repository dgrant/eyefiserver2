function show(b){
	var a=document.getElementById(b);
	if(a){
		a.style.display=''
	}
}
function hide(b){
	var a=document.getElementById(b);
	if(a){
		a.style.display='none';
	}
}
function selecttab(b){
	var a=document.getElementById(b);
	if(a){
		a.setAttribute('class','selectedSettingsTab');
		document.getElementById('settingsTitle').innerHTML=b;
		
	}
}
function unselecttab(b){
	var a=document.getElementById(b);
	if(a){
		a.setAttribute('class','unselectedSettingsTab');
	}
}
function activate(a){
	switch(a){
	case 'Cards':
		selecttab('Cards');
		unselecttab('Host');
		unselecttab('Upload');
		unselecttab('Log');
		show('cards');
		hide('host');
		hide('upload');
		hide('log');
		show('apply');
		show('revert');
	break;
	case 'Host':
		unselecttab('Cards');
		selecttab('Host');
		unselecttab('Upload');
		unselecttab('Log');
		hide('cards');
		show('host');
		hide('upload');
		hide('log');
		show('apply');
		show('revert');
	break;
	case 'Upload':
		unselecttab('Cards');
		unselecttab('Host');
		selecttab('Upload');
		unselecttab('Log');
		hide('cards');
		hide('host');
		show('upload');
		hide('log');
		show('apply');
		show('revert');
	break;
	case 'Log':
		unselecttab('Cards');
		unselecttab('Host');
		unselecttab('Upload');
		selecttab('Log');
		hide('cards');
		hide('host');
		hide('upload');
		hide('apply');
		hide('revert');
		refreshlog();
		show('log');
	break;
	}
}
function refreshlog()
{
	$.get("?act=getlog", function(data){
		a=document.getElementById('logtext');
		a.innerHTML=data;
		a.scrollTop=a.scrollHeight;
	});
	return false;
}
function apply()
{
	$.get("?act=save&mac_0="+mac_0.value+"&upload_key_0="+upload_key_0.value+"&mac_1="+mac_1.value+"&upload_key_1="+upload_key_1.value+"&host_name="+host_name.value+"&host_port="+host_port.value+"&upload_dir="+upload_dir.value+"&upload_uid="+upload_uid.value+"&upload_gid="+upload_gid.value+"&upload_file_mode="+upload_file_mode.value+"&upload_dir_mode="+upload_dir_mode.value, function(data){
		alert(data);
	});
	return false;
}
function revert()
{
	location.reload(true);
	alert("Configuration reverted.");
}
