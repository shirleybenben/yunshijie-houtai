var CBSHr = function(options){

	this.opt = $.extend({}, options);
	this.columns = $('.column');
	this.needColumns=$('.require');
	this.inModify = false;
    var _this = this;
    
    
    this.init = function (options) {
    	var _this = this;
        _this.needColumns.click(function(){
        	$(this).siblings('.tips').hide();
        });
        
        _this.needColumns.change(function(){
        	$(this).siblings('.tips').hide();
        });
        
        _this.currentStep = _this.opt.step;
        
        if (options && options.staffId) {
            //console.log('init driver data with id: ' + options.staffId);
            var url = "/admin/staff/getStaffInfo?staffId=" + options.staffId;
            var _this = this;
            $.get(global.server + url, function (msg) {
                if (msg && msg.status && msg.status.statusCode == global.status.success) {
                    var data = msg.data;
                    _this.fillContentFromJsonData(data);
                    _this.modify();
                    $('.car-information p').html('修改HR信息');
                    $('.title_val').html('修改HR信息');
                }
            }).done(function (msg) {
            	var data = msg.data;
            	
            	_this.fillDepartSelect(data.departId);
            	
            	$('select').multiselect({
        			header : false,
        			multiple : false,
        			selectedList : 1,
        			noneSelectedText: '请选择'
        		});
            });
        } else {
            console.log('new hr');
            $('select').multiselect({
    			header : false,
    			multiple : false,
    			selectedList : 1,
    			noneSelectedText: '请选择'
    		});
            _this.fillDepartSelect();
        }
    }
    
	this.init(options);
};

CBSHr.prototype.doSave = function () {
    var _this = this;
    var valid = _this.validToPost();
    if(valid) {
    	var validExp=_this.validKeyExpress();
    	if(validExp) {
    		var result = _this.getJsonDataFromContent();
//    		var departId=$('#autocomplete-ajax').attr('data');
    		
    		
    		//TODO:
//    		result.departId=departId;
    		
            var url = null;
            if(_this.inModify){
            	url = "/admin/staff/editStaff";
            	result.staffId = _this.opt.staffId;
            } else {
            	url = "/admin/staff/addStaff";
            }
            $.ajax({
                url: global.server + url,
                type: "POST",
                data: result,
                success: function (msg) {
                    console.log(msg);
                    if (msg && msg.status && msg.status.statusCode == global.status.success) {
                    	var staffId = null;
                    	if(_this.inModify){
                    		staffId = _this.opt.staffId;
                    	} else {
                    		staffId = msg.data.staffId;
                    	}
                    	
                    	alert("保存成功。");
                    	window.close();
                        window.opener.location.reload();
                    } else {
                    	console.log(msg.status.errorMsg);
                    	var number = $("input[data-column='number']");
                    	number.siblings('.tips').html('该工号已存在');
                    	number.siblings('.tips').show();
                    }
                }
            });
    	}
    }
    
};

CBSHr.prototype.getJsonDataFromContent = function(){
	var _this = this;
	var data = {};
	this.columns.each(function(i, j){
		var _this = $(this);
		var pName = _this.data("column");
		var pValue = _this.val();
		data[pName] = pValue;
	});
	var departId = _this.departSelect.getValue();
	data.departId = departId;
	return data;
};

CBSHr.prototype.fillContentFromJsonData = function (data) {
    if (!data) return;
    this.data = data;
    var _this = this;
    this.columns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.val(pValue);
    });
};

CBSHr.prototype.fillDepartSelect = function(departId) {
	var _this = this;
	_this.departSelect = new CBSAutocomplete2({
		target : $('#autocomplete-ajax'),
		url : '/admin/staff/getDepartList',
		method : 'get',
	    valueField : 'departId',
	    textField : 'name',
	    initValue : departId
	});
}

CBSHr.prototype.modify = function () {
    this.inModify = true;
};

CBSHr.prototype.validToPost = function () {
    var _this = this;
    var valid = true;
    this.needColumns.each(function(i, j){
		var _this = $(this);
		var pValue = $.trim(_this.val());
		if( pValue=='' || pValue == null) {
			valid = false;
			_this.siblings('.tips').show();
		}else{
			_this.siblings('.tips').hide();
		}
	});
    
    var departId = _this.departSelect.getValue();
    
    if(departId == null){
    	valid = false;
    	$('#autocomplete-ajax').siblings('.tips').show();
    } else {
    	$('#autocomplete-ajax').siblings('.tips').hide();
    }
    
    return valid;
};

CBSHr.prototype.validKeyExpress=function() {
	var _this=this;
	var valid=true;
	var telphone=$("input[data-column='telphone']");
	var email=$("input[data-column='email']");
	var validTelphone=/^1[0-9]{10}$/;
	var validEmail=/^([a-zA-Z0-9_-])+@gzzhwl.com$/;
	var validNumber = /^[0-9]{5}$/;
	if(!validTelphone.test(telphone.val())) {
		valid=false;
		telphone.siblings('.tips').show();
	} else {
		telphone.siblings('.tips').hide();
	}
	if($.trim(email.val())=='') {
		valid=true;
		email.siblings('.tips').hide();
	} else {
		if(!validEmail.test(email.val())) {
			valid=false;
			email.siblings('.tips').show();
		} else {
			email.siblings('.tips').hide();
		}
	}
	var realName = $("input[data-column='realName']");
	if($.trim(realName.val())!=''){
		if(!global.isChinese(realName.val())) {
			valid=false;
			realName.siblings('.tips').show();
		} else {
			realName.siblings('.tips').hide();
		}
	} else {
		realName.siblings('.tips').hide();
	}
	var number = $("input[data-column='number']");
	if($.trim(number.val())!=''){
		if(!validNumber.test(number.val())) {
			valid=false;
			number.siblings('.tips').html('请输入正确的工号');
			number.siblings('.tips').show();
		} else {
			number.siblings('.tips').hide();
		}
	} else {
		number.siblings('.tips').hide();
	}
	
	
	
	return valid;
}