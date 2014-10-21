Ext.ns('QNAP.QOS.QPKG.EyeFiServerMainMenu');
QNAP.QOS.QPKG.EyeFiServerMainMenu = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		getEyeFiServerMainMenuItems: function (isFirst) {
			var me = this;
			me.treeMenu = {
				text: me.QPKGDisplayName,
				draggable: false,
				expanded: true,
				singleClickExpand: true,
				iconCls: 'eyefiserver-icon',
				listeners: {
					'beforeclick': function(){
						return false;
					},
					'beforecollapse': function(){
						return false;
					}
				},
				children: [
					{
						text: _S._EYEFISERVER_MAIN_MENU_ITEM_CARDS,
						qInternationalKey: '_EYEFISERVER_MAIN_MENU_ITEM_CARDS',
						qInternational: true,
						id: 'cards',
						iconCls: 'eyefiserver-main-menu-cards-icon',
						leaf: true
					},
					{
						text: _S._EYEFISERVER_MAIN_MENU_ITEM_UPLOAD,
						qInternationalKey: '_EYEFISERVER_MAIN_MENU_ITEM_UPLOAD',
						qInternational: true,
						id: 'upload',
						iconCls: 'eyefiserver-main-menu-upload-icon',
						leaf: true
					},
					{
						text: _S._EYEFISERVER_MAIN_MENU_ITEM_GEOTAGGING,
						qInternationalKey: '_EYEFISERVER_MAIN_MENU_ITEM_GEOTAGGING',
						qInternational: true,
						id: 'geotagging',
						iconCls: 'eyefiserver-main-menu-geotagging-icon',
						leaf: true
					},
					{
						text: _S._EYEFISERVER_MAIN_MENU_ITEM_LOG,
						qInternationalKey: '_EYEFISERVER_MAIN_MENU_ITEM_LOG',
						qInternational: true,
						id: 'log',
						iconCls: 'eyefiserver-main-menu-log-icon',
						leaf: true
					}
				]
			};
			return me.treeMenu;
		},
		getEyeFiServerMainMenu: function () {
			var me = this;
			var rootChildren = [];
			rootChildren.push(me.getEyeFiServerMainMenuItems(rootChildren.length == 0));
			return new Ext.tree.TreePanel({
				id: me.compIDs.MAIN_MENU,
				flex: 1,
				animCollapse: true,
				useArrows: true,
				rootVisible: false,
				animate: true,
				enableDD: false,
				containerScroll: true,
				border: false,
				cls: 'eyefiserver-main-menu',
				qInternational: true,
				root: new Ext.tree.AsyncTreeNode({
					draggable: false,
					expanded: true,
					children: rootChildren,
					listeners: {}
				}),
				listeners: {
					click: function (n) {
						me.setEyeFiServerMainPanelCurrentPanel(n.attributes.id);
					},
					afterrender: function(cmp) {
						var node = cmp.getNodeById('cards');
						me.fillSelect('upload_uid',me.compIDs.UPLOAD_UID_FIELD);
						me.fillSelect('upload_gid',me.compIDs.UPLOAD_GID_FIELD);
						me.refreshFields();
						node.select();
					}
				}
			});
		}
	}
};
