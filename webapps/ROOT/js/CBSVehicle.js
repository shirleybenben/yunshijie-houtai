var CBSVehicle = function(options){
	this.opt = $.extend({}, options);
	this.columns = $('.column');
	this.imageColumns = $('.image-column');
	this.needColumns=$('.required');
	this.pcdColumns = $('.pcd-column');
	this.singleColumns = $('.single');
	this.inModify = false;
	this.imageList = [];
//	this.pcdList = [];
	this.lineList = [];
	this.acm = {};
	
    var _this = this;
    
    this.init = function (options) {
    	var _this = this;
    	
    	$('.use-date').each(function(i, j){
    		var time = $(this).data('time');
    		if(time){
    			$(this).datetimepicker({
            		timepicker:true,
            		format:'Y-m-d H:i',
            		autoclose:true,
            		todayHighlight:true,
            		keyboardNavigation:false
        		});
    		} else {
    			$(this).datetimepicker({
            		timepicker:false,
            		format:'Y-m-d',
            		autoclose:true,
            		todayHighlight:true,
            		keyboardNavigation:false
        		});
    		}
        });
        
    	_this.needColumns.click(function(){
        	$(this).siblings('.tips').hide();
        });
        
        _this.needColumns.change(function(){
        	$(this).siblings('.tips').hide();
        });
        
        _this.currentStep = _this.opt.step;
        
        
        if (options && options.vehicleInfoId) {
            console.log('init vehicle data with id: ' + options.vehicleInfoId);
            var url = "/admin/vehiclemanage/queryDetail?vehicleInfoId=" + options.vehicleInfoId;
            var _this = this;
            $.get(global.server + url, function (msg) {
                if (msg && msg.status && msg.status.statusCode == global.status.success) {
                    var data = msg.data;
                    _this.fillContentFromJsonData(data);
                    _this.modify();
                    $('.car-information p').html('修改车辆信息');
                    $('.title_val').html('修改车辆信息');
                } else {
                	alert("页面参数错误");
                	window.close();
                }
            }).done(function (msg) {
            	var data = msg.data;
            	$('select').multiselect({
					header : false,
					multiple : false,
					selectedList : 1,
					noneSelectedText: '请选择'
				});
            	$('.line-column').each(function(i, j){
             		var category = $(this).data('column');
             		var value = data[category];
             		var line = new CBSLineSelect({width:100,category:category,initCode:value}, $(this));
             		_this.lineList.push(line);
             	});
            	
                
                $('.autocomplete-column.department').each(function(){
                	var self = $(this);
                	var _p = self.data('column');
                	var ac = new CBSAutocomplete2({
            			target : self,
            			url : '/admin/staff/getDepartList',
            			method : 'get',
            		    valueField : 'departId',
            		    textField : 'name',
            		    initValue : data[_p]
            		});
                	_this.acm[_p] = ac;
                })
                
                $('.autocomplete-column.supply_info').each(function(){
                	var self = $(this);
                	var _p = self.data('column');
                	var ac = new CBSAutocomplete2({
            			target : self,
            			url : '/admin/supply/getSupplyList',
            			method : 'get',
            		    valueField : 'supplyId',
            		    textField : 'fullName',
            		    initValue : data[_p],
            		    onChange : function(row){
            		    	if(row != null) {
            		    		$('.supply_tel').val(row.mobile);
            		    	} else {
            		    		$('.supply_tel').val('');
            		    	}
            		    }
            		});
                	_this.acm[_p] = ac;
                })
            	
//            	 _this.pcdColumns.each(function(i, j){
//             		$(this).append('<select class="pcd-select-p"></select>');
//             		$(this).append('<select class="pcd-select-c"></select>');
//             		$(this).append('<select class="pcd-select-d"></select>');
//             		var category = $(this).data('column');
//             		var value = data[category];
//             		var pcd = new CBSPcdSelect({width:100,category:category,initCode:value}, $(this));
//             		_this.pcdList.push(pcd);
//             	});
            });
        } else {
            console.log('new vehicle');
            if(_this.currentStep == 2){
            	alert("页面参数错误");
            	window.close();
            }
            // 加载照片控件
            if (typeof CBSImage === "function") {
            	this.imageColumns.each(function(i, j){
                	var image = new CBSImage({
                		view: $(this),
                		category: $(this).data("column")
                    });
                	_this.imageList.push(image);
                });
            }
            $('.line-column').each(function(i, j){
         		var category = $(this).data('column');
         		var line = new CBSLineSelect({width:100,category:category}, $(this));
         		_this.lineList.push(line);
         	});
//            _this.pcdColumns.each(function(i, j){
//        		$(this).append('<select class="pcd-select-p"></select>');
//        		$(this).append('<select class="pcd-select-c"></select>');
//        		$(this).append('<select class="pcd-select-d"></select>');
//        		var category = $(this).data('column');
//        		var pcd = new CBSPcdSelect({width:100,category:category}, $(this));
//        		_this.pcdList.push(pcd);
//        	});
            $('select').multiselect({
				header : false,
				multiple : false,
				selectedList : 1,
				noneSelectedText: '请选择'
			});
            
            $('.autocomplete-column.department').each(function(){
            	var self = $(this);
            	var _p = self.data('column');
            	var ac = new CBSAutocomplete2({
        			target : self,
        			url : '/admin/staff/getDepartList',
        			method : 'get',
        		    valueField : 'departId',
        		    textField : 'name'
        		});
            	_this.acm[_p] = ac;
            })
            
            $('.autocomplete-column.supply_info').each(function(){
            	var self = $(this);
            	var _p = self.data('column');
            	var ac = new CBSAutocomplete2({
        			target : self,
        			url : '/admin/supply/getSupplyList',
        			method : 'get',
        		    valueField : 'supplyId',
        		    textField : 'fullName',
        		    onChange : function(row){
        		    	if(row != null) {
        		    		$('.supply_tel').val(row.mobile);
        		    	} else {
        		    		$('.supply_tel').val('');
        		    	}
        		    }
        		});
            	_this.acm[_p] = ac;
            })
        };
        
    };
    
    this.onBeforeClose = function(e){
//    	event.returnValue="确定离开当前页面吗？";
    }
    
    this.onClose = function(){
    	
    }
    
	this.init(options);
	
};

CBSVehicle.prototype.doSave = function () {
    var _this = this;
    var valid = _this.validToPost();
    if(valid){
    	var result = _this.getJsonDataFromContent();
        var url = null;
        if(_this.inModify){
        	url = "/admin/vehiclemanage/updateVehicle";
        	result.vehicleInfoId = _this.opt.vehicleInfoId;
        } else {
        	url = "/admin/vehiclemanage/saveVehicle";
        }
        $.ajax({
            url: global.server + url,
            type: "POST",
            data: result,
            success: function (msg) {
                if (msg && msg.status && msg.status.statusCode == global.status.success) {
                	var vehicleInfoId = null;
                	if(_this.inModify){
                		vehicleInfoId = _this.opt.vehicleInfoId;
                	} else {
                		vehicleInfoId = msg.data.vehicleInfoId;
                		
                	}
                	if(_this.currentStep == 1){
                		if(confirm('保存成功，是否前去下一页？')){
                			window.onbeforeunload = null;
                            window.onunload = null;
                			location.href = global.getContextPath() + '/addCarInfomation.html?vehicleInfoId='+vehicleInfoId;
                		} else {
//                			window.onbeforeunload = _this.onBeforeClose;
//                            window.onunload = _this.onClose;
                			window.onbeforeunload = null;
                            window.onunload = null;
                			window.close();
                		}
                	} else {
                		alert("保存成功。");
//                		window.onbeforeunload = _this.onBeforeClose;
//                        window.onunload = _this.onClose;
                		window.onbeforeunload=null;
                		window.onunload=null;
                		window.close();
                		window.opener.location.reload();
                	}
                	
                } else {
                	console.log(msg.status.errorMsg);
                	window.onbeforeunload = null;
                    window.onunload = null;
                    alert(msg.status.errorMsg);
                	//alert('保存失败，录入信息有误。');
                }
            }
        });
    } else {
    	
    }
};

CBSVehicle.prototype.getJsonDataFromContent = function(){
	var _this=this;
	var data = {};
	this.columns.each(function(i, j){
		var _this = $(this);
		var pName = _this.data("column");
		var pValue = _this.val();
		data[pName] = pValue;
	});
	$.each(this.imageList,function(i, j){
		var result = j.postToServer('/admin/vehiclemanage/uploadImage');
		if(result != null){
			var pName = result.column;
			var pValue = result.imageId;
			data[pName] = pValue;
		}
	});
	$.each(this.acm,function(i,j){
		data[i]=j.getValue();
	});
	
//	$.each(this.pcdList,function(i, j){
//		var result = j.getValue();
//		var pName = result.category;
//		var pValue = result.code;
//		data[pName] = pValue;
//	});
	
	$.each(_this.lineList, function(i, j){
		var _v = j.getValue();
		var _p = _v.category;
		data[_p] = _v.c;
	});
	return data;
};

CBSVehicle.prototype.fillContentFromJsonData = function (data) {
    if (!data) return;
    this.data = data;
    var _this = this;
    this.columns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	if(pName=='ciEffectDate'||pName=='ciValidDate'||pName=='viEffectDate'||pName=='viValidDate') {
    		if(pValue) {
    			var _date=moment(pValue).format("YYYY-MM-DD HH:mm");
        		_this.val(_date);
    		}
    	} else {
    		_this.val(pValue);
    	}
    });
    // 加载照片控件
    if (typeof CBSImage === "function") {
    	this.imageColumns.each(function(i, j){
    		var category = $(this).data("column");
    		var imageId = data[category];
        	var image = new CBSImage({
        		view: $(this),
        		category: $(this).data("column"),
        		imageId: imageId
            });
        	_this.imageList.push(image);
        });
    }
};

CBSVehicle.prototype.modify = function () {
    this.inModify = true;
};

CBSVehicle.prototype.validDate=function() {
	//行驶证
	var licenseRegDate=$('input[data-column="licenseRegDate"]').val();
	var licenseIssueDate=$('input[data-column="licenseIssueDate"]').val();
	var licenseValidDate=$('input[data-column="licenseValidDate"]').val();
	//营运证
	var operatingCertIssueDate=$('input[data-column="operatingCertIssueDate"]').val();
	var operatingCertValidDate=$('input[data-column="operatingCertValidDate"]').val();
	//交强险
	var ciEffectDate=$('input[data-column="ciEffectDate"]').val();
	var ciValidDate=$('input[data-column="ciValidDate"]').val();
	//商业险
	var viEffectDate=$('input[data-column="viEffectDate"]').val();
	var viValidDate=$('input[data-column="viValidDate"]').val();
	
	if(licenseRegDate&&licenseIssueDate&&licenseValidDate){
		var l_r=moment(licenseRegDate,"YYYY-MM-DD");
		var l_s=moment(licenseIssueDate,"YYYY-MM-DD");
		var l_e=moment(licenseValidDate,"YYYY-MM-DD");
		var time_valid_lr=l_s.isBefore(l_r);
		if(time_valid_lr) {
			alert('行驶证发证日期不能早于注册日期');
			return false;
		}
		var time_valid_l=l_e.isAfter(l_s);
		if(!time_valid_l) {
			alert('行驶证有效期不能早于发证日期');
			return false;
		}
	}
	
	if(operatingCertIssueDate&&operatingCertValidDate) {
		var o_s=moment(operatingCertIssueDate,"YYYY-MM-DD");
		var o_e=moment(operatingCertValidDate,"YYYY-MM-DD");
		var time_valid_o=o_e.isAfter(o_s);
		if(!time_valid_o) {
			alert('营运证有效期不能早于发证日期');
			return false;
		}
	}
	
	if(ciEffectDate&&ciValidDate) {
		var c_s=moment(ciEffectDate,"YYYY-MM-DD HH:mm");
		var c_e=moment(ciValidDate,"YYYY-MM-DD HH:mm");
		var time_valid_c=c_e.isAfter(c_s);
		if(!time_valid_c) {
			alert("交强险有效期结束时间不能早于开始时间");
			return false;
		}
	}
	
	if(viEffectDate&&viValidDate) {
		var v_s=moment(viEffectDate,"YYYY-MM-DD HH:mm");
		var v_e=moment(viValidDate,"YYYY-MM-DD HH:mm");
		var time_valid_v=v_e.isAfter(v_s);
		if(!time_valid_v) {
			alert("商业险有效期开始时间必须小于结束时间");
			return false;
		}
	}
	return true;
}

CBSVehicle.prototype.validToPost = function () {
    var _this = this;
    var valid = true;
    var join = []
    
    this.needColumns.each(function(i, j){
		var _this = $(this);
		var pName = _this.data('column');
		var pValue = $.trim(_this.val());
		if( pValue=='' || pValue == null) {
			valid = false;
			_this.parents('.f-tips').find('.tips').show();
		}else{
			if(pName == 'bridgeType' || pName == 'headstockType'){
				join.push(pValue)
			}
			_this.parents('.f-tips').find('.tips').hide();
		}
	});
    
    if(join.length != 2){
    	$('#bhTips').show();
    } else {
    	$('#bhTips').hide();
    }
    
    
    var code = [];
    $.each(_this.lineList, function(i, j){
		var _v = j.getValue();
		if(_v.p!=null&&_v.p!=''){
			code.push(_v.p);
		}
		if(_v.c!=null&&_v.c!=''){
			code.push(_v.c);
		}
	});
    
    if(code.length==0 || code.length==4){
    	$('.line-column[data-column="departureCode"]').siblings('.tips').hide();
	}  else {
		$('.line-column[data-column="departureCode"]').siblings('.tips').show();
		valid = false;
	}
    
    
    $.each(_this.acm, function(i, j){
    	if(j.getValue() == null){
    		valid = false;
    		$('.autocomplete-column[data-column="'+i+'"]').siblings('.tips').show();
    	} else {
    		$('.autocomplete-column[data-column="'+i+'"]').siblings('.tips').hide();
    	}
    });
    
    if(valid){
    	var data = {};
    	
    	this.singleColumns.each(function(i, j){
    		var _this = $(this);
    		var pName = _this.data("column");
    		var pValue = _this.val();
    		if(pValue) {
    			data[pName]=pValue;
    		}
    	});
    	var valid_date=_this.validDate();
    	if(valid_date) {
    		if(!$.isEmptyObject(data)){
        		if (_this.opt.vehicleInfoId) {
            		data.currentVehicleInfoId = _this.opt.vehicleInfoId;
            	}
            	var url = '/admin/vehiclemanage/vehicleManageExistValidator';
            	$.ajax({
                    url: global.server + url,
                    type: "get",
                    async : false,
                    data: data,
                    success: function (msg) {
                        if (msg && msg.status && msg.status.statusCode == global.status.success) {
                        	var exists = msg.data.result;
                        	var existColumn=msg.data.existField;
                        	if(existColumn=='plateNumber') {
                        		existColumn="车牌号重复";
                        	} else if(existColumn=='licenseNo') {
                        		existColumn="行驶证号重复";
                        	} else if(existColumn=='engineNo') {
                        		existColumn="发动机号重复";
                        	} else if(existColumn=='vin') {
                        		existColumn="车架号重复";
                        	} else if(existColumn=='regCertCode') {
                        		existColumn="登记证号重复";
                        	} else if(existColumn=='operatingCertNo') {
                        		existColumn="道路运输证号重复";
                        	}
                        	if(exists){
                        		alert("该车的信息已存在。"+existColumn);
                        		valid = false;
                        	}
                        } 
                    }
                });
        	}
    	} else {
    		valid=false;
    	}
    }
    return valid;
};