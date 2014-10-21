Ext.ns('QNAP.QOS.QPKG.EyeFiServerLogPanel');
QNAP.QOS.QPKG.EyeFiServerLogPanel = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		getEyeFiServerLogPanel: function(){
			var me = this;
			return {
				xtype: 'form',
				padding: '30px 60px',
				bodyStyle:'background-color: #ffffff;',
				items: [
					{
						id: me.compIDs.STATUS_FIELD,
						xtype: 'displayfield',
						style: 'height: 20px',
						readOnly: true,
						fieldLabel: _S._EYEFISERVER_LABEL_STATUS
					},
					{
						xtype: 'container',
						padding: '30px 0px',
						hideLabels: true,
						layout: 'fit',
						anchor: '100% -76',
						items:[
							{
								id: me.compIDs.LOG_FIELD,
								xtype: 'textarea',
								fieldLabel: _S._EYEFISERVER_LABEL_LOG,
								readOnly: true,
							autoscroll: true
							}
						]
					},
					{
						layout: 'column',
						bodyStyle: 'background-color: #ffffff; border: 0px; padding-top: 30px;',
						items: [
							{
								xtype: 'button',
								text: _S._EYEFISERVER_START_BUTTON_TEXT,
								style: { marginRight: '5px' },
								handler: function(){ me.daemon('start'); }
							},
							{
								xtype: 'button',
								text: _S._EYEFISERVER_STOP_BUTTON_TEXT,
								style: { marginRight: '5px' },
								handler: function(){ me.daemon('stop'); }
							},
							{
								xtype: 'button',
								text: _S._EYEFISERVER_RESTART_BUTTON_TEXT,
								style: { marginRight: '5px' },
								handler: function(){ me.daemon('restart'); }
							},
							{
								xtype: 'button',
								text: _S._EYEFISERVER_CLEAR_LOG_BUTTON_TEXT,
								style: { marginRight: '5px' },
								handler: function(){ me.daemon('clearlog'); }
							},
							{
								xtype: 'button',
								text: _S._EYEFISERVER_REFRESH_BUTTON_TEXT,
								style: { marginRight: '5px' },
								handler: function(){ me.refreshLog(); }
							}
						]
					}
				]
			};
		}
	}
};
