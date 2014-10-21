Ext.ns('QNAP.QOS.QPKG.EyeFiServerGeotaggingPanel');
QNAP.QOS.QPKG.EyeFiServerGeotaggingPanel = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		getEyeFiServerGeotaggingPanel: function(){
			var me = this;
			return {
				xtype: 'form',
				padding: '30px 60px',
				bodyStyle:'background-color: #ffffff;',
				items: [
					{
						xtype: 'container',
						items: [
							{
								id: me.compIDs.GEOTAG_ENABLE_FIELD,
								xtype: 'checkbox',
								boxLabel: _S._EYEFISERVER_LABEL_GEOTAG_ENABLE,
								handler: function(){ me.updateGeotag(); }
							},
							{
								xtype: 'label',
								style: 'padding: 11px 0; display: block;',
								text: _S._EYEFISERVER_LABEL_GEOTAG_ENABLE_HELP
							}
						]
					},
					{
						id: me.compIDs.GEOTAG_OPTIONS_CONTAINER,
						xtype: 'container',
						items: [
							{
								xtype: 'fieldset',
								padding: '0px',
								style: 'border: 0px;',
								items: [
									{
										id: me.compIDs.GEOTAG_LAG_FIELD,
										xtype: 'textfield',
										allowBlank: false,
										grow: true,
										growMin: 128,
										growMax: 500,
										maskRe: /\d/i,
										regex: /^\d+$/i,
										fieldLabel: _S._EYEFISERVER_LABEL_GEOTAG_LAG
									},
									{
										xtype: 'label',
										style: 'padding-bottom: 30px;display: block;',
										text: _S._EYEFISERVER_LABEL_GEOTAG_LAG_HELP
									},
									{
										id: me.compIDs.GEOTAG_ACCURACY_FIELD,
										xtype: 'textfield',
										allowBlank: false,
										grow: true,
										growMin: 128,
										growMax: 500,
										maskRe: /\d/i,
										regex: /^\d+$/i,
										fieldLabel: _S._EYEFISERVER_LABEL_GEOTAG_ACCURACY,
									},
									{
										xtype: 'label',
										text: _S._EYEFISERVER_LABEL_GEOTAG_ACCURACY_HELP
									}
								]
							}
						]
					},
					{
						layout: 'column',
						bodyStyle: 'background-color: #ffffff; border: 0px',
						items: [
							{
								xtype: 'button',
								text: _S._EYEFISERVER_APPLY_BUTTON_TEXT,
								style: { marginRight: '5px' },
								handler: function(){ me.apply(); }
							},
							{
								xtype: 'button',
								text: _S._EYEFISERVER_REVERT_BUTTON_TEXT,
								style: { marginRight: '5px' },
								handler: function(){ me.revert(); }
							}
						]
					}
				]
			};
		}
	}
};
