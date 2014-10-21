Ext.ns('QNAP.QOS.QPKG.EyFiServer');
QNAP.QOS.QPKG.EyeFiServer = Ext.extend(QNAP.QOS.BorderApp, {
	QPKGName: 'EyeFiServer',
	QPKGDisplayName: 'Eye-Fi Server',
	QPKGVer: '0.0.17',
	QPKGAuthor: 'https://github.com/dgrant/eyefiserver2',
	plugins: [
		new QNAP.QOS.QPKG.EyeFiServerIDList(),
		new QNAP.QOS.QPKG.EyeFiServerController(),
		new QNAP.QOS.QPKG.EyeFiServerMainMenu(),
		new QNAP.QOS.QPKG.EyeFiServerMainPanel(),
		new QNAP.QOS.QPKG.EyeFiServerCardsPanel(),
		new QNAP.QOS.QPKG.EyeFiServerUploadPanel(),
		new QNAP.QOS.QPKG.EyeFiServerGeotaggingPanel(),
		new QNAP.QOS.QPKG.EyeFiServerLogPanel(),
		new QNAP.QOS.QPKG.EyeFiServerInfoWindow(),
		new QNAP.QOS.QPKG.EyeFiServerStatusWindow()
	],
	winConfig:{
		minHeight: 450,
		minWidth: 960,
		height: 450,
		width: 960
	},
	initCenterRegion : function() {
		var me = this;
		return {
			region: 'center',
			labelWidth: 200,
			activeItem: 0,
			layout: 'card',
			items: me.getEyeFiServerMainPanel()
		};
	},
	initNorthRegion : function() {
		var me = this;
		return {
			region: 'north',
			items: [
				{
					xtype: 'tbfill'
				},
				{
					xtype: 'button',
					tooltip: '_EYEFISERVER_NORTH_REGION_INFO_BUTTON_TOOLTIP',
					cls: 'eyefiserver-bt-help',
					width: 24,
					height: 24,
					handler: function() {
						me.showEyeFiServerInfoWindow();
					}
					
				}
			]
		};
	},
	initWestRegion : function() {
		var me = this;
		return {
			region : 'west',
			width: 200,
			split: false,
			layout: 'hbox',
			border: false,
			layoutConfig: {
				align: 'stretch'
			},
			items: [
				me.getEyeFiServerMainMenu(),
				{
					width: 1,
					border: false
				}
			]
		};
	}
});
