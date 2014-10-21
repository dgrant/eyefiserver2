Ext.ns('QNAP.QOS.QPKG.EyeFiServerCardsPanel');
QNAP.QOS.QPKG.EyeFiServerCardsPanel = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		getEyeFiServerCardsPanel: function(){
			var me = this;
			return {
				xtype: 'form',
				padding: '30px 60px',
				bodyStyle:'background-color: #ffffff;',
				items: [
					{
						xtype: 'fieldset',
						title: _S._EYEFISERVER_LABEL_CARD_1,
						style: 'border-width: 0px',
						items:[
						{
								id: me.compIDs.MAC_0_FIELD,
								xtype: 'textfield',
								grow: true,
								growMin: 128,
								growMax: 500,
								allowBlank: false,
								minLength: 12,
								maxLength: 17,
								maskRe: /[\dA-F:-]/i,
								regex: /^(([\dA-F]{2}:){5}|([\dA-F]{2}-){5}|([\dA-F]{10}))[\dA-F]{2}$/i,
								fieldLabel: _S._EYEFISERVER_LABEL_MAC_ADDRESS
						},
						{
							id: me.compIDs.UPLOAD_KEY_0_FIELD,
							xtype: 'textfield',
							grow: true,
							growMin: 256,
							growMax: 500,
							allowBlank: false,
							minLength: 32,
							maxLength: 32,
							maskRe: /[\dA-F]/i,
							regex: /^[\dA-F]{32}$/i,
							fieldLabel: _S._EYEFISERVER_LABEL_UPLOAD_KEY
						},
						{
							xtype: 'label',
							text: _S._EYEFISERVER_LABEL_CARD_1_HELP
						}
						]
					},
					{
						xtype: 'fieldset',
						title: _S._EYEFISERVER_LABEL_CARD_2,
						style: 'border-width: 0px',
						items:[
							{
								id: me.compIDs.MAC_1_FIELD,
								xtype: 'textfield',
								grow: true,
								growMin: 128,
								growMax: 500,
								allowBlank: false,
								minLength: 12,
								maxLength: 17,
								maskRe: /[\dA-F:-]/i,
								regex: /^(([\dA-F]{2}:){5}|([\dA-F]{2}-){5}|([\dA-F]{10}))[\dA-F]{2}$/i,
								fieldLabel: _S._EYEFISERVER_LABEL_MAC_ADDRESS
							},
							{
								id: me.compIDs.UPLOAD_KEY_1_FIELD,
								xtype: 'textfield',
								grow: true,
								growMin: 256,
								growMax: 500,
								allowBlank: false,
								minLength: 32,
								maxLength: 32,
								maskRe: /[\dA-F]/i,
								regex: /^[\dA-F]{32}$/i,
								fieldLabel: _S._EYEFISERVER_LABEL_UPLOAD_KEY
							},
							{
								xtype: 'label',
								text: _S._EYEFISERVER_LABEL_CARD_2_HELP
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
