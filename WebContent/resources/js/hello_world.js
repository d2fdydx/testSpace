(function() {

	(function() {
		var cur = /^[A-Z]{3}$/;
		Ext.apply(Ext.form.field.VTypes, {
			currency : function(val, field) {
				return cur.test(val);
			},
			currencyText : 'Invalid'
		});

	})();
	var remoteJsonStore = Ext.create(Ext.data.JsonStore, {

		fields : [ 'name', 'id'

		],
		proxy : {
			type : 'ajax',
			url : '/Spring/spring/getJson',

			reader : {
				type : 'json',
				root : 'objects',
				totalProperty : 'totalCount'
			}
		}
	});

	var onSuccessOrFail = function(form, action) {
		var formPanel = Ext.getCmp('myFormPanel');
		formPanel.el.unmask();
		var result = action.result;
		if (result.success) {
			Ext.MessageBox.alert('Success', action.result.msg);
		} else {
			Ext.MessageBox.alert('Failure', action.result.msg);
		}
	};

	var columns = [ {
		xtype : 'templatecolumn',
		header : 'ID',
		dataIndex : 'id',
		sortable : true,
		width : 50,
		resizable : false,
		hidden : true,
		tpl : '<span style="color: #0000FF;">{id}</span>',
		editor : {
			xtype : 'numberfield',
			allowBlank : false
		}
	}, {
		header : 'Name',
		dataIndex : 'name',
		flex : 1,
		sortable : true,
		hideable : false,
		editor : {
			xtype : 'textfield',
			vtype : 'currency',
			allowBlank : false,
			msgTarget : 'side'

		}
	} ];

	Ext.define('CityModel', {
		extend : 'Ext.data.Model',
		idProperty : 'id',
		fields : [ {
			name : 'id',
			type : 'int'
		}, {
			name : 'name',
			type : 'string'
		} ]

	});

	var cityStore = Ext.create('Ext.data.Store', {
		model : 'CityModel',

		proxy : {
			type : 'ajax',
			paramsAsJson : true,

			jsonData : true,
			api : {

				read : '/Spring/spring/submit',
				update : '/Spring/spring/submit'

			},
			actionMethods : {

				read : 'POST',
				update : 'POST'

			},
			reader : {
				type : 'json',
				root : 'objects',

				idProperty : 'id',
				successProperty : 'success'
			},
			writer : {
				type : 'json',
				encode : true,
				writeAllFields : false,
				root : 'data',
				allowSingle : true,
				batch : false,
				writeRecords : function(request, data) {
					var wrapper = {
						formData : data
					};
					request.jsonData = wrapper;
					return request;
				}
			}
		}
	});

	var tempStore = Ext.create('Ext.data.Store', {

		fields : [ {
			name : 'firstName',
			type : 'string'
		}, {
			name : 'lastName',
			type : 'string'
		},

		],
		data : [ {
			firstName : 'Peter',
			lastName : 'Chan'
		} ]

	});

	var gridPanel = {
		xtype : 'grid',
		loadMask : true,
		itemId : 'gridItem',
		selType : 'rowmodel',
		store : cityStore,
		columns : columns,
		singleSelect : true,
		stripeRows : true,
		plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		}) ],

		dockedItems : [ {
			xtype : 'toolbar',
			items : [ {
				xtype : 'button',
				text : 'submit',
				handler : function() {
					alert("sync");
					cityStore.sync();

				}

			} ]
		}

		]
	};

	Ext
			.application({

				launch : function() {

					var fp = Ext
							.create(
									'Ext.form.Panel',
									{
										renderTo : Ext.getBody(),
										width : 900,
										id : 'myFormPanel',
										title : 'Exercising textfields',
										frame : true,
										bodyStyle : 'padding: 6px',
										labelWidth : 126,
										defaultType : 'textfield',
										defaults : {
											msgTarget : 'side',
											anchor : '-20'
										},
										items : [
												{
													xtype : 'form',
													itemId : 'formItem',
													items : [
															{
																xtype : 'textfield',
																allowBlank : false,
																vtype : 'currency',
																msgTarget : 'side',
																name : 'name'

															},
															{
																xtype : 'combo',
																store : remoteJsonStore,
																query : 'remote',
																itemId : 'comboItem',
																valueField : 'name',
																displayField : 'name',
																minChars : 1,
																triggerAction : 'all',
															} ],
													dockedItems : [ {
														xtype : 'toolbar',
														dock : 'bottom',
														items : [ {
															xtype : 'button',
															text : 'submit',
															handler : function() {
																var oForm = fp
																		.down(
																				"#formItem")
																		.getForm();
																if (!oForm
																		.isValid()) {
																	alert("not valid");
																	return;
																}
																/*
																 * cityStore.load({
																 * params : {
																 * formData :
																 * Ext.encode(oForm
																 * .getValues()) },
																 * callback :
																 * function(records,
																 * operation,
																 * success) { //
																 * the operation
																 * object //
																 * contains all
																 * of the //
																 * details of
																 * the load //
																 * operation
																 * alert("back");
																 * alert(records);
																 * console.log(records);
																 * Ext.ComponentQuery
																 * .query('#gridItem')[0]
																 * .getView().refresh();
																 * console.log("refrest");
																 * console.log(cityStore
																 * .getCount()); }
																 * 
																 * });
																 */

																Ext.Ajax
																		.request({
																			url : '/Spring/spring/submit',
																			method : 'POST',
																			params : {
																				requestParam : 'notInRequestBody'
																			},
																			jsonData : Ext
																					.encode(oForm
																							.getValues()),
																			callback : function(
																					opt,
																					suc,
																					response) {
																				alert(response);
																				cityStore
																						.loadRawData(response);
																				Ext.ComponentQuery
																						.query('#gridItem')[0]
																						.getView()
																						.refresh();
																			}
																		});
															}

														} ]
													}

													]

												}, gridPanel ]
									});
					var oGrid = Ext.ComponentQuery.query('#gridItem');
					console.log(oGrid);
					var combo = Ext.ComponentQuery.query('#comboItem')[0];
					console.log(combo);
					combo.on('focus', function() {
						console.log("hi");
						// combo.inputEl.dom.value="pet";
						combo.doQuery("a");

					});
					combo.on ('change', function( comb, newValue, oldValue, eOpts ){
						console.log(newValue);
						var record = combo.findRecordByValue(newValue);
						console.log(record.getData());


						
					});
					var dt = Ext.Date.parse("20141101000000.000000","YmdHis.000000");
					console.log(dt);
					//Ext.Date.format(myDate, 'm/d/Y');
					//http://dev.sencha.com/playpen/docs/output/Date.html
					/*
					 * {    fieldLabel: 'Date start&nbsp;',
    name: 'date_debut',
    xtype: 'datefield',
    format: 'd/m/Y',
    submitFormat: 'Y-m-d H:i:s',
    allowBlank: false
}
					 */
				}
			});

})();