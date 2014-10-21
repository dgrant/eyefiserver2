Ext.ns('QNAP.QOS.QPKG.EyeFiServerUploadPanel');
QNAP.QOS.QPKG.EyeFiServerUploadPanel = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		getEyeFiServerUploadPanel: function(){
			var me = this;
			return {
				xtype: 'form',
				padding: '30px 60px',
				bodyStyle: 'background-color: #ffffff;',
				items: [
					{
						id: me.compIDs.UPLOAD_DIR_FIELD,
						xtype: 'textfield',
						fieldLabel: _S._EYEFISERVER_LABEL_UPLOAD_DIR,
						allowBlank: false,
						grow: true,
						growMin: 400,
						growMax: 500,
					},
					{
						xtype: 'label',
						text: _S._EYEFISERVER_LABEL_UPLOAD_DIR_HELP
					},
					{
						xtype: 'fieldset',
						title: _S._EYEFISERVER_LABEL_UPLOAD_PERMISSIONS,
						style: 'border-width: 0px; margin: 30px 0px; padding: 0px;',
						items: [
							{
								xtype: 'container',
								items: [
									{
										layout: 'table',
										bodyStyle: 'background-color: #ffffff; border: 0px; margin: 0px; padding: 0px',
										layoutConfig:{
											columns:7,
											tableAttrs: {
												cellspacing: '5px'
											}
										},
										defaults:{
											bodyStyle: 'background-color: #ffffff; border: 0px; margin: 0px; padding:20px 0px 20px 0px'
										},
										items: [
											{
												rowspan: 2
											},
											{
												colspan: 3,
												xtype: 'label',
												style: 'text-align: center; display: block;',
												text: _S._EYEFISERVER_LABEL_UPLOAD_FILES
											},
											{
												colspan: 3,
												xtype: 'label',
												style: 'text-align: center; display: block;',
												text: _S._EYEFISERVER_LABEL_UPLOAD_DIRECTORIES
											},
											{
												xtype: 'label',
												style: 'text-align: center; display: block;',
												width: 70,
												text: _S._EYEFISERVER_LABEL_UPLOAD_READ
											},
											{
												xtype: 'label',
												style: 'text-align: center; display: block;',
												width: 70,
												text: _S._EYEFISERVER_LABEL_UPLOAD_WRITE
											},
											{
												xtype: 'label',
												style: 'text-align: center; display: block;',
												width: 70,
												text: _S._EYEFISERVER_LABEL_UPLOAD_EXECUTE
											},
											{
												xtype: 'label',
												style: 'text-align: center; display: block;',
												width: 70,
												text: _S._EYEFISERVER_LABEL_UPLOAD_READ
											},
											{
												xtype: 'label',
												style: 'text-align: center; display: block;',
												width: 70,
												text: _S._EYEFISERVER_LABEL_UPLOAD_WRITE
											},
											{
												xtype: 'label',
												style: 'text-align: center; display: block;',
												width: 70,
												text: _S._EYEFISERVER_LABEL_UPLOAD_EXECUTE
											},
											{
												id: me.compIDs.UPLOAD_UID_FIELD,
												xtype: 'combo',
												displayField: 'name',
												valueField: 'uid',
												allowBlank: false,
												editable: false,
												width: 128,
												triggerAction: 'all',
												mode: 'local'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_8",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_7",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_6",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_8",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_7",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_6",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_GID_FIELD,
												xtype: 'combo',
												displayField: 'name',
												valueField: 'uid',
												allowBlank: false,
												editable: false,
												width: 128,
												triggerAction: 'all',
												mode: 'local'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_5",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_4",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_3",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_5",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_4",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_3",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												xtype: 'label',
												text: _S._EYEFISERVER_LABEL_UPLOAD_OTHERS
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_2",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_1",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_FILE_MODE_FIELD + "_0",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_2",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_1",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											},
											{
												id: me.compIDs.UPLOAD_DIR_MODE_FIELD + "_0",
												style: 'margin-left: 30px;',
												xtype: 'checkbox'
											}
										]
									}
								]
							}
						]
					},
					{
						layout: 'column',
						bodyStyle: 'background-color: #ffffff; border: 0px;',
						items: [
							{
								xtype: 'button',
								text: _S._EYEFISERVER_APPLY_BUTTON_TEXT,
								style: { marginRight: '5px'},
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
