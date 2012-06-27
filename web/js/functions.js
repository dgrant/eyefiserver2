function selectTab()
{
	var currentTab = $(this);
	$("#introtabs > div").not(currentTab).removeClass('selectedSettingsTab').addClass('unselectedSettingsTab');
	currentTab.removeClass('unselectedSettingsTab').addClass('selectedSettingsTab');
	var currentSection = $("#" + currentTab.attr('id') + "Section");
	$('.settingsContent > article').not(currentSection).hide();
	currentSection.show();
	if (currentTab.is("#Log")) { refreshlog() };
}

		icon.setAttribute('src','images/dimicon-networks.jpg');
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
	refreshcheckbox(geotag_enable);
	refreshfield('geotag_lag');
	refreshfield('geotag_accuracy');
	refreshfield('mac_0');
	refreshfield('upload_key_0');
	refreshfield('mac_1');
	refreshfield('upload_key_1');
	refreshfield('upload_dir');
	refreshselect('upload_uid');
	refreshselect('upload_gid');
	refreshcheckboxes('upload_file_mode');
	refreshcheckboxes('upload_dir_mode');
}
function refreshfield(field)
{
	$.get("api.cgi?act=getval&name="+field, function(data){
		$("#" + field).val(data);
	});
}
function refreshcheckbox(field)
{
	$.get("api.cgi?act=getval&name="+field.id, function(data){
		document.getElementById(field.id).checked=data>0;
	});
}
function refreshselect(field)
{
	$.get("api.cgi?act=getval&name="+field, function(data){
	$("#" + field +'_'+data.split('\n')[0]).attr('selected', true);
	});
}
function refreshcheckboxes(field)
{
	$.get("api.cgi?act=getval&name="+field, function(data){
		for(i=8; i>=0; i--){
			$("#" + field+'_'+i).attr('checked', data&1!=0);
			data>>=1;
		}
	});
}
function getcheckboxes(field)
{
	var val;
	for(i=0; i<=8; i++){
		val<<=1;
		if($("#" + field+'_'+i).attr('checked')){
			val++;
		}
	}
	return val;
}
function apply()
{
	$.get("api.cgi?act=save&mac_0="+$('#mac_0').val() + "&upload_key_0="+$('#upload_key_0').val()+"&mac_1="+$('#mac_1').val()+"&upload_key_1="+$('#upload_key_1').val()+"&host_name="+$('#host_name').val()+"&host_port="+$('#host_port').val()+"&upload_dir="+escape($('#upload_dir').val())+"&upload_uid="+$('#upload_uid').val()+"&upload_gid="+$('#upload_gid').val()+"&upload_file_mode="+getcheckboxes('upload_file_mode')+"&upload_dir_mode="+getcheckboxes('upload_dir_mode'), function(data){
	//$.get("api.cgi?act=save&mac_0="+mac_0.value+"&upload_key_0="+upload_key_0.value+"&mac_1="+mac_1.value+"&upload_key_1="+upload_key_1.value+"&upload_dir="+upload_dir.value+"&upload_uid="+upload_uid.value+"&upload_gid="+upload_gid.value+"&upload_file_mode="+getcheckboxes('upload_file_mode')+"&upload_dir_mode="+getcheckboxes('upload_dir_mode')+"&geotag_enable="+(geotag_enable.checked?"1":"0")+"&geotag_lag="+geotag_lag.value+"&geotag_accuracy="+geotag_accuracy.value, function(data){
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
	$.get("api.cgi?act=getuids&name="+field, function(data){
		a=document.getElementById(field);
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

$(document).ready(function () {
	fillselect('upload_uid');
	fillselect('upload_gid');
	refreshfields();
	$("#introtabs div").click(selectTab);
	$('#Cards').click();
});
