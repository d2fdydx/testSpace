(function() {
	Ext.QuickTips.init();
	Ext.Loader.setConfig({
		enabled : true
	});
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
		storeId : 'people',
		fields : [ 'name'

		],
		proxy : {
			type : 'ajax',
			url : 'http://localhost:8080/Spring/spring/getJson',

			reader : {
				type : 'json',
				root : 'objects',
				totalProperty : 'totalCount'
			}
		}
	});
	var combo = {
		xtype : 'combo',
		queryMode : 'remote',
		fieldLabel : 'Search by name',
		width : 320,
		forceSelection : true,
		displayField : 'name',
		valueField : 'id',
		minChars : 1,
		triggerAction : 'all',
		store : remoteJsonStore,
		listConfig : {
			getInnerTpl : function() {
				return '<div>{id} </div> <div> {name} </div>';
			}

		}
	};
	// checkboxes ===================
	var checkboxes = {
		xtype : 'checkboxgroup',
		fieldLabel : 'Which do you own',
		anchor : '100%',
		items : [ {
			boxLabel : 'Cat',
			inputValue : 'cat'
		}, {
			boxLabel : 'Dog',
			inputValue : 'dog'
		}, {
			boxLabel : 'Fish',
			inputValue : 'fish'
		}, {
			boxLabel : 'Bird',
			inputValue : 'bird'
		} ]

	};
	var fieldset1 = {
		xtype : 'fieldset',
		title : 'Name',
		flex : 1,

		labelWidth : 60,
		defaultType : 'field',
		defaults : {
			anchor : '-10',
			msgTarget : 'side',
			allowBlank : false
		},
		items : [ {
			xtype : 'textfield',
			fieldLabel : 'First',
			maskRe : /[a-z]/i,
			name : 'firstName'
		}, {
			fieldLabel : 'Middle',
			name : 'middle'
		}, {
			fieldLabel : 'Last',
			name : 'lastName'
		} ]
	};
	var fieldset2 = Ext.apply({}, {
		flex : 1,
		labelWidth : 30,
		title : 'Address Information',
		defaults : {
			layout : 'column',
			anchor : '100%'
		},
		items : [ {
			fieldLabel : 'Address',
			name : 'address'
		}, {
			fieldLabel : 'Street',
			name : 'street'
		}, {
			xtype : 'container',
			items : [ {
				xtype : 'fieldcontainer',
				columnWidth : .5,
				items : [ {
					xtype : 'textfield',
					fieldLabel : 'State',
					name : 'state',
					labelWidth : 100,
					width : 150
				} ]
			}, {
				xtype : 'fieldcontainer',
				columnWidth : .5,
				items : [ {
					xtype : 'textfield',
					fieldLabel : 'Zip',
					name : 'zip',
					labelWidth : 30,
					width : 162
				} ]
			} ]
		} ]
	}, fieldset1);

	// tabPanel ==============

	var tabs = [ {
		xtype : 'fieldcontainer',
		title : 'Phone Numbers',
		layout : 'form',
		bodyStyle : 'padding:6px 6px 0',
		defaults : {
			xtype : 'textfield',
			width : 230
		},
		items : [ {
			fieldLabel : 'Home',
			name : 'home'
		}, {
			fieldLabel : 'Business',
			name : 'business'
		}, {
			fieldLabel : 'Mobile',
			name : 'mobile'
		}, {
			fieldLabel : 'Fax',
			name : 'fax'
		} ]
	}, {
		title : 'Resume',
		xtype : 'htmleditor',
		name : 'resume'
	}, {
		title : 'Bio',
		xtype : 'htmleditor',
		name : 'bio'
	} ];

	var tabPanel = {
		xtype : 'tabpanel',
		flex : 1,
		activeTab : 0,
		items : tabs

	}

	var fieldsetContainer = {
		xtype : 'container',
		layout : 'hbox',
		layoutConfig : {
			align : 'stretch'
		},
		items : [ fieldset1, fieldset2 ]
	};

	var fpItems = [ {
		fieldLabel : 'Alpha only',
		allowBlank : false,
		emptyText : 'This field is empty!',
		maskRe : /[a-z]/i,
		msgTarget : 'side'
	}, {
		fieldLabel : 'Simple 3 to 7 Chars',
		allowBlank : false,
		msgTarget : 'under',
		minLength : 3,
		maxLength : 7
	}, {
		fieldLabel : 'Special Chars Only',
		msgTarget : 'qtip',
		stripCharsRe : /[a-zA-Z0-9]/ig
	}, {
		fieldLabel : 'Web Only with VType',
		vtype : 'url',
		msgTarget : 'side'
	}, combo, checkboxes, fieldsetContainer, tabPanel

	];

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
	var submitHandler = function() {
		var formPanel = Ext.getCmp('myFormPanel');
		formPanel.el.mask('Please wait', 'x-mask-loading');
		formPanel.getForm().submit({
			url : 'http://localhost:8080/Spring/spring/submit',
			success : onSuccessOrFail,
			failure : onSuccessOrFail
		});
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
			vtype: 'currency',
			allowBlank : false,
			msgTarget: 'side'

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

	var employeeStore = Ext.create('Ext.data.Store', {
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
					var wrapper = { formData: data};
					request.jsonData = wrapper;
					return request;
				}
			}
		}
	});

	var gridPanel = {
		xtype : 'grid',
		loadMask : true,
		itemId : 'gridItem',
		selType : 'rowmodel',
		store : employeeStore,
		columns : columns,
		singleSelect : true,
		stripeRows : true,
		plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		}) ],
	
		dockedItems : [
		               {
		            	   xtype :'toolbar',
		            	   items :[{
		            		   xtype : 'button',
		            		   text : 'submit',
		            		   handler : function(){
		            			   alert("sync");
		            			   employeeStore.sync();
		            			   
		            		   }
		            	   
		            		   
		            	   }]
		               }
		               
		               ]
	};

	Ext.application({

		launch : function() {

			var fp = Ext.create('Ext.form.Panel', {
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
							items : [ {
								xtype : 'textfield',
								allowBlank : false,
								vtype : 'currency',
								msgTarget: 'side',
								name : 'name'

							}, {
								xtype : 'numberfield',
								allowBlank : false,
								name : 'id'
							} ],
							dockedItems : [ {
								xtype : 'toolbar',
								dock : 'bottom',
								items : [ {
									xtype : 'button',
									text : 'submit',
									handler : function() {
										var oForm = fp.down("#formItem")
												.getForm();
										if (!oForm.isValid()) {
											alert("not valid");
											return;
										}
										/*employeeStore.load({
											params : {
												formData : Ext.encode(oForm
														.getValues())

											},
											callback : function(records,
													operation, success) {
												// the operation object
												// contains all of the
												// details of the load
												// operation
												alert("back");
												alert(records);
												console.log(records);
												Ext.ComponentQuery
														.query('#gridItem')[0]
														.getView().refresh();
												console.log("refrest");
												console.log(employeeStore
														.getCount());
											}

										});
										*/
										
										Ext.Ajax.request({
										    url: '/Spring/spring/submit',
										    method: 'POST',
										    params: {
										        requestParam: 'notInRequestBody'
										    },
										    jsonData: Ext.encode(oForm
													.getValues()),
										    callback: function (opt,suc,response){
										    	alert(response);
										    	employeeStore.loadRawData(response);
										    	Ext.ComponentQuery
												.query('#gridItem')[0]
												.getView().refresh();
										    }
										});
									}

								} ]
							}

							]

						}, gridPanel ]
			});

		}
	});

})();