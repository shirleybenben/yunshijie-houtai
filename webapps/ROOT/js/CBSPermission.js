var CBSPermission = function(options){
	this.opt = $.extend({}, options);
	this.columns = $('.column');
	//this.needColumns=$('.require');
	this.inModify = false;
	
    var _this = this;
    
    this.init = function (options) {
    	var _this = this;  
        
/*        _this.needColumns.click(function(){
        	$(this).siblings('.tips').hide();
        });
        
        _this.needColumns.change(function(){
        	$(this).siblings('.tips').hide();
        });
        
        _this.currentStep = _this.opt.step;*/
    	$('#depart').multiselect({
    		minWidth:357,
			header : true,
			multiple : true,
			noneSelectedText: '请选择',
			selectedText: '已选择 # 个部门',
		});
        
        if (options && options.staffId) {
            console.log('init permission data with id: ' + options.staffId);
            var url = "/admin/staff/getPermissionInfo?staffId=" + options.staffId;
            var _this = this;
            $.get(global.server + url, function (msg) {
                if (msg && msg.status && msg.status.statusCode == global.status.success) {
                    var data = msg.data;
                    _this.fillContentFromJsonData(data);
                    _this.modify();
                    _this.menu = new CBSMenuTree({
                		target : $("#menu_tree"),
                		initValue : data.menuIds,
                		display : $("#menu_tree")
                	});
                }
            }).done(function (msg) {
            	var data = msg.data;
            });
        } else {
            console.log('new permission');
            _this.menu = new CBSMenuTree({
        		target : $("#menu_tree"),
        		display : $("#menu_tree")
        	});
            _this.fillDepartSelect();
        }
    }
    
	this.init(options);
};

CBSPermission.prototype.doSave = function () {
    var _this = this;
    var menuIds = _this.menu.getData().join(',');
    //var valid = _this.validToPost();
    //if(valid) {
    	var result = _this.getJsonDataFromContent();
    	result.menuIds=menuIds;
    	var selectedArr = $('#depart').multiselect("getChecked").map(function() {
            return this.value;
        }).get();
    	selectedArr.push($('#departId').val());
    	var tmp=unique(selectedArr);
        var selectedVal = tmp.join(',');
    	result.departIds=selectedVal;
        var url = null;
        if(_this.inModify){
        	url = "/admin/staff/bindStaffMenu";
        	result.staffId = _this.opt.staffId;
        } else {
        	url = "/admin/staff/bindStaffMenu";
        }
        $.ajax({
            url: global.server + url,
            type: "POST",
            data: result,
            success: function (msg) {
                if (msg && msg.status && msg.status.statusCode == global.status.success) {
                	var staffId = null;
                	if(_this.inModify){
                		staffId = _this.opt.staffId;
                	} else {
                		staffId = msg.data.staffId;
                		
                	}
                	alert("保存成功。");
        			//window.onbeforeunload = _this.onBeforeClose;
        		    //window.onunload = _this.onClose;
            		window.close();
                	
                } else {
                	console.log(msg.status.errorMsg);
                	//window.onbeforeunload = null;
                    //window.onunload = null;
                	alert('保存失败，录入信息有误。');
                }
            }
        });
    //} else {
    //	
    //}
    
};

CBSPermission.prototype.getJsonDataFromContent = function(){
	var data = {};
	this.columns.each(function(i, j){
		var _this = $(this);
		var pName = _this.data("column");
		var pValue = _this.val();
		data[pName] = pValue;
	});
	return data;
};

CBSPermission.prototype.fillContentFromJsonData = function (data) {
    if (!data) return;
    this.data = data;
    var _this = this;
    this.columns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.val(pValue);
    });
    var departInfo = data.departInfo;
    var idArray = [];
    $.each(departInfo, function(index, row){
    	idArray.push(row.departId);
    })
    _this.fillDepartSelect(idArray);
};

CBSPermission.prototype.modify = function () {
    this.inModify = true;
};

CBSPermission.prototype.fillDepartSelect = function(initData) {
	$.get(global.server + "/admin/staff/getDepartList", function (msg) {
        if (msg && msg.status && msg.status.statusCode == global.status.success) {
            var data = msg.data;
            $.each(data, function(i, j) {
            	$("#depart").append("<option value="+j.departId+">"+j.name+"</option>");
            }); 
        }
    }).done(function(msg){
    	$('#depart').multiselect('refresh');
    	$("#depart").multiselect().multiselectfilter();
    	if(initData){
    		$('#depart').multiselect('selectValue', initData);
    	}
    });
}
//去掉数组中重复元素
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
/*CBSPermission.prototype.validToPost = function () {
    var _this = this;
    var valid = true;
    this.needColumns.each(function(i, j){
		var _this = $(this);
		var pValue = _this.val();
		if( pValue=='' || pValue == null) {
			valid = false;
			_this.siblings('.tips').show();
		}else{
			_this.siblings('.tips').hide();
		}
	});
    return valid;
};*/