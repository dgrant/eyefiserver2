Ext.ns('QNAP.QOS.QPKG.EyeFiServerStatusWindow');
QNAP.QOS.QPKG.EyeFiServerStatusWindow = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		showEyeFiServerStatusWindow: function (text) {
			var me = this;
			var win = me.getEyeFiServerStatusWindow(text);
			win.show();
		},
		getEyeFiServerStatusWindow: function(text) {
			var me = this;
			if( Ext.isEmpty(me.eyefiserverStatusWindow) || me.eyefiserverStatusWindow.isDestroyed )
			{
				var winConfig = {
					closable: false,
					height: 168,
					width: 350,
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
									hideLabels: true,
									bodyStyle: 'padding: 17px;',
									border: false,
									items: [
										{
											layout: 'column',
											bodyStyle: 'background-color: #ffffff; border: 0px;',
											items: [
												{
													html: '<img src="/cgi-bin/images/toolbar/icon-info.png">',
													bodyStyle: 'border: 0px',
													style: {
														marginRight: '17px'
													},
													width: 50,
													height: 50
												},
												{
													xtype: 'displayfield',
													width: 249,
													value: text
												}
											]
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
								me.eyefiserverStatusWindow.close();
							}
					}]
				}
				me.eyefiserverStatusWindow = me._createModalWindow(winConfig);
			}
			return me.eyefiserverStatusWindow;
		}
	}
};
