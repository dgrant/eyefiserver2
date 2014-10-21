Ext.ns('QNAP.QOS.QPKG.EyeFiServerInfoWindow');
QNAP.QOS.QPKG.EyeFiServerInfoWindow = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		showEyeFiServerInfoWindow: function () {
			var me = this;
			var win = me.getEyeFiServerInfoWindow();
			win.show();
		},
		getEyeFiServerInfoWindow: function() {
			var me = this;
			if( Ext.isEmpty(me.eyefiserverInfoWindow) || me.eyefiserverInfoWindow.isDestroyed )
			{
				var winConfig = {
					closable: false,
					title:  _S._EYEFISERVER_NORTH_REGION_INFO_BUTTON_TOOLTIP,
					qInternational: true,
					qInternationalKey: '_EYEFISERVER_NORTH_REGION_INFO_BUTTON_TOOLTIP',
					height: 220,
					width: 400,
					layout: 'border',
					items: [
						{
							xtype: 'container',
							region: 'center',
							border: false,
							layout: 'vbox',
							layoutConfig: {
								align: 'stretch'
							},
							style: 'font-size:12px;',
							items: [
								new QNAP.QOS.wizard.formPanel({
									labelWidth: 110,
									bodyStyle: 'padding: 30px 0px 0px 30px;',
									border: false,
									items: [
										{
											xtype: 'displayfield',
											labelStyle: 'padding: 3px 3px 3px 0;',
											fieldLabel: _S._EYEFISERVER_INFO_WINDOW_APP_NAME,
											value: me.QPKGDisplayName
										},
										{
											xtype: 'displayfield',
											labelStyle: 'padding: 3px 3px 3px 0;',
											fieldLabel: _S._EYEFISERVER_INFO_WINDOW_APP_VERSION,
											value: me.QPKGVer
										},
										{
											xtype: 'displayfield',
											hideLabel: true,
											value: me.QPKGAuthor
										}
									]
								})
							]
						}
					],
					buttons: [{
							text: _S._EYEFISERVER_OK_BUTTON_TEXT,
							qInternational: true,
							qInternationalKey: '_EYEFISERVER_OK_BUTTON_TEXT',
							handler: function () {
								me.eyefiserverInfoWindow.close();
							}
					}]
				}
				me.eyefiserverInfoWindow = me._createModalWindow(winConfig);
			}
			return me.eyefiserverInfoWindow;
		}
	}
};
