Ext.ns('QNAP.QOS.QPKG.EyeFiServerMainPanel');
QNAP.QOS.QPKG.EyeFiServerMainPanel = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		getEyeFiServerMainPanel: function() {
			var me = this;
			return [
				me.getEyeFiServerCardsPanel(),
				me.getEyeFiServerUploadPanel(),
				me.getEyeFiServerGeotaggingPanel(),
				me.getEyeFiServerLogPanel()
			];
		},
		menuIdToCardPanelIndex: {
			'cards': 0,
			'upload': 1,
			'geotagging': 2,
			'log': 3
		},
		setEyeFiServerMainPanelCurrentPanel: function(menuId) {
			var me = this;
			var centerCmp = me.getCenterCmp();
			var panelIndex = me.menuIdToCardPanelIndex[menuId];
			centerCmp.layout.setActiveItem(panelIndex);
			if( menuId == 'log'){
				me.refreshLog();
			}
		}
	}
};
