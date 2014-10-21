Ext.ns('QNAP.QOS.QPKG.EyeFiServerController');
QNAP.QOS.QPKG.EyeFiServerController = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		ajaxFunction: function (paramsData, callbackFunction) {
			var me = this;
			QNAP.QOS.ajax({
				url: QNAP.QOS.lib.getCgiUrl('/cgi-bin/qpkg/EyeFiServer/' + 'api.cgi'),
				params: paramsData,
				method: 'GET',
				success: function (response, opts) {
					if( callbackFunction ) callbackFunction(response.responseText.trim());
				}
			});
		},
		daemon: function(name)
		{
			var me = this;
			me.ajaxFunction({'act':name}, function(data){ me.showEyeFiServerStatusWindow(data); me.refreshLog(); });
		},
		apply: function(name)
		{
			var me = this;
			me.ajaxFunction(
				{
					'act':'save',
					'mac_0':Ext.getCmp(me.compIDs.MAC_0_FIELD).getValue().replace(new RegExp("[^0-9A-F]",'gi'),""),
					'upload_key_0':Ext.getCmp(me.compIDs.UPLOAD_KEY_0_FIELD).getValue(),
					'mac_1':Ext.getCmp(me.compIDs.MAC_1_FIELD).getValue().replace(new RegExp("[^0-9A-F]",'gi'),""),
					'upload_key_1':Ext.getCmp(me.compIDs.UPLOAD_KEY_1_FIELD).getValue(),
					'upload_dir':Ext.getCmp(me.compIDs.UPLOAD_DIR_FIELD).getValue(),
					'upload_uid':Ext.getCmp(me.compIDs.UPLOAD_UID_FIELD).getValue(),
					'upload_gid':Ext.getCmp(me.compIDs.UPLOAD_GID_FIELD).getValue(),
					'upload_file_mode':me.getCheckBoxes(me.compIDs.UPLOAD_FILE_MODE_FIELD),
					'upload_dir_mode':me.getCheckBoxes(me.compIDs.UPLOAD_DIR_MODE_FIELD),
					'geotag_enable':Ext.getCmp(me.compIDs.GEOTAG_ENABLE_FIELD).getValue()?'1':'0',
					'geotag_lag':Ext.getCmp(me.compIDs.GEOTAG_LAG_FIELD).getValue(),
					'geotag_accuracy':Ext.getCmp(me.compIDs.GEOTAG_ACCURACY_FIELD).getValue()
				},
				function(data){
					me.showEyeFiServerStatusWindow(data); me.refreshLog();
				}
			);
		},
		revert: function()
		{
			var me = this;
			me.refreshFields();
			me.showEyeFiServerStatusWindow('configuration reverted');
		},
		refreshField: function(name, id){
			var me = this;
			me.ajaxFunction({'act':'getval','name':name}, function(data){ Ext.getCmp(id).setValue(data); });
		},
		refreshMacField: function(name, id){
			var me = this;
			me.ajaxFunction({'act':'getval','name':name}, function(data){
				Ext.getCmp(id).setValue(data.replace(new RegExp("[0-9A-F]{2}",'gi'),"$&:").substring(0,17));
			});
		},
		fillSelect: function(name, id){
			var me = this;
			me.ajaxFunction({'act':'getuids','name':name}, function(data){
				var store = new Ext.data.ArrayStore({
					fields: ['uid', 'name']
				});
				var rows = data.split('\n');
				for(var i=0; i<rows.length; i++){
					var cell = rows[i].split(':');
					store.add(new store.recordType({ uid: cell[1], name: cell[0]}));
				}
				Ext.getCmp(id).bindStore(store);
			});
		},
		refreshSelect: function(name, id){
			var me = this;
			me.ajaxFunction({'act':'getval','name':name}, function(data){
				Ext.getCmp(id).setValue(data);
			});
		},
		refreshCheckBoxes: function(name, id){
			var me = this;
			me.ajaxFunction({'act':'getval','name':name}, function(data){
				for(i=0; i<=8; i++){
					Ext.getCmp(id + '_' + i).setValue(data&1);
					data>>=1;
				}
			});
		},
		getCheckBoxes: function(id){
			var val;
			for(i=8; i>=0; i--){
				val<<=1;
				if(Ext.getCmp(id + '_' + i).getValue()){
					val++;
				}
			}
			return val;
		},
		updateGeotag: function(){
			var me = this;
			Ext.getCmp((me.compIDs.GEOTAG_OPTIONS_CONTAINER)).setDisabled(! Ext.getCmp(me.compIDs.GEOTAG_ENABLE_FIELD).getValue());
		},
		refreshLog: function() {
			var me = this;
			me.ajaxFunction({'act':'status'}, function(data){Ext.getCmp(me.compIDs.STATUS_FIELD).setValue(data);});
			me.ajaxFunction({'act':'getlog'}, function(data){Ext.getCmp(me.compIDs.LOG_FIELD).setValue(data); Ext.getCmp(me.compIDs.LOG_FIELD).getEl().dom.scrollTop = 99999;});
//			Ext.getCmp(me.compIDs.LOG_FIELD).getElement().getFirtChildElement().setScrollTop( Ext.getCmp(me.compIDs.LOG_FIELD).getElement().getFirtChildElement().getScrollHeight() );
//			log.scrollTop(log[0].scrollHeight - log.height());
		},
		refreshFields: function() {
			var me = this;
			me.refreshMacField('mac_0',me.compIDs.MAC_0_FIELD);
			me.refreshField('upload_key_0',me.compIDs.UPLOAD_KEY_0_FIELD);
			me.refreshMacField('mac_1',me.compIDs.MAC_1_FIELD);
			me.refreshField('upload_key_1',me.compIDs.UPLOAD_KEY_1_FIELD);
			me.refreshField('upload_dir',me.compIDs.UPLOAD_DIR_FIELD);
			me.refreshSelect('upload_uid',me.compIDs.UPLOAD_UID_FIELD);
			me.refreshSelect('upload_gid',me.compIDs.UPLOAD_GID_FIELD);
			me.refreshCheckBoxes('upload_file_mode',me.compIDs.UPLOAD_FILE_MODE_FIELD);
			me.refreshCheckBoxes('upload_dir_mode',me.compIDs.UPLOAD_DIR_MODE_FIELD);
			me.refreshField('geotag_enable',me.compIDs.GEOTAG_ENABLE_FIELD);
			me.refreshField('geotag_lag',me.compIDs.GEOTAG_LAG_FIELD);
			me.refreshField('geotag_accuracy',me.compIDs.GEOTAG_ACCURACY_FIELD);
			me.updateGeotag();
		}
	}
};
