Ext.ns('QNAP.QOS.QPKG.EyeFiServerIDList');
QNAP.QOS.QPKG.EyeFiServerIDList = function () {
	return {
		init: function (cmp) {
			Ext.apply(cmp, this);
		},
		compIDs: {
			MAIN_MENU: Ext.id(),
			MAC_0_FIELD: Ext.id(),
			UPLOAD_KEY_0_FIELD: Ext.id(),
			MAC_1_FIELD: Ext.id(),
			UPLOAD_KEY_1_FIELD: Ext.id(),
			UPLOAD_DIR_FIELD: Ext.id(),
			UPLOAD_UID_FIELD: Ext.id(),
			UPLOAD_GID_FIELD: Ext.id(),
			UPLOAD_FILE_MODE_FIELD: Ext.id(),
			UPLOAD_DIR_MODE_FIELD: Ext.id(),
			GEOTAG_ENABLE_FIELD: Ext.id(),
			GEOTAG_OPTIONS_CONTAINER: Ext.id(),
			GEOTAG_LAG_FIELD: Ext.id(),
			GEOTAG_ACCURACY_FIELD: Ext.id(),
			STATUS_FIELD: Ext.id(),
			LOG_FIELD: Ext.id()
		}
	}
};
