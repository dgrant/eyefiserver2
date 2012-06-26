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
function init(){
	fillselect(upload_uid);
	fillselect(upload_gid);
	refreshfields();
}
function refreshlog()
{
	$.get("api.cgi?act=getlog", function(data){
		a=document.getElementById('logtext');
		a.innerHTML=data;
		a.scrollTop=a.scrollHeight;
	});
	return false;
}
function refreshfields()
{
	refreshfield(host_name);
	refreshfield(host_port);
	refreshfield(mac_0);
	refreshfield(upload_key_0);
	refreshfield(mac_1);
	refreshfield(upload_key_1);
	refreshfield(upload_dir);
	refreshselect(upload_uid);
	refreshselect(upload_gid);
	refreshcheckboxes('upload_file_mode');
	refreshcheckboxes('upload_dir_mode');
}
function refreshfield(field)
{
	$.get("api.cgi?act=getval&name="+field.id, function(data){
		field.value=data;
	});
}
function refreshselect(field)
{
	$.get("api.cgi?act=getval&name="+field.id, function(data){
	selected = field.id+'_'+data.split('\n')[0];
		a=document.getElementById(field.id+'_'+data.split('\n')[0]);
		a.selected=true;
	});
}
function refreshcheckboxes(field)
{
	$.get("api.cgi?act=getval&name="+field, function(data){
		for(i=8; i>=0; i--){
			document.getElementById(field+'_'+i).checked=data&1!=0;
			data>>=1;
		}
	});
}
function getcheckboxes(field)
{
	var val;
	for(i=0; i<=8; i++){
		val<<=1;
		if( document.getElementById(field+'_'+i).checked == true){
			val++;
		}
	}
	return val;
}
function apply()
{
	$.get("api.cgi?act=save&mac_0="+mac_0.value+"&upload_key_0="+upload_key_0.value+"&mac_1="+mac_1.value+"&upload_key_1="+upload_key_1.value+"&host_name="+host_name.value+"&host_port="+host_port.value+"&upload_dir="+escape(upload_dir.value)+"&upload_uid="+upload_uid.value+"&upload_gid="+upload_gid.value+"&upload_file_mode="+getcheckboxes('upload_file_mode')+"&upload_dir_mode="+getcheckboxes('upload_dir_mode'), function(data){
		alert(data);
	});
	return false;
}
function revert()
{
	refreshfields();
	alert("Configuration reverted.");
}
function fillselect(field){
	$.get("api.cgi?act=getuids&name="+field.id, function(data){
		a=document.getElementById(field.id);
		rows=data.split('\n');
		for(row in rows){
			cell=rows[row].split(':');
			if(cell!=""){
				a.options.add(new Option(cell[0],cell[1]));
				a.options[a.options.length-1].setAttribute('id',field.id+'_'+cell[1]);
			}
		}
	});
}
