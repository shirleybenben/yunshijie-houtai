var CBSDriverInfo = function(options){
	this.opt = $.extend({real:false}, options);
	this.columns = $('.car-column');
	//this.bankColumns = $('.bank-column');
	this.imageColumns = $('.car-img');
    var _this = this;
    
    this.init = function (options) {
    	$('#checkUnpass').hide();
		$('#checkPass').hide();
    	var _this = this;
        if (options && options.accountId&&options.vehicleInfoId) {
            console.log('init driver data with id: ' + options.accountId+' '+options.vehicleInfoId);
            var real = _this.opt.real;
            if(real){
            	$('#checkUnpass').remove();
    			$('#checkPass').remove();
    			var url = "/admin/vehiclemanage/queryDriverandVehicleDetail";
    			var data = {};
    			data.accountId = options.accountId;
    			data.vehicleInfoId = options.vehicleInfoId;
    			data.driverInfoList = [];
    			var dataStringify = JSON.stringify(data);
    	        $.ajax({
    	            url: global.server + url,
    	            type: "POST",
    	            contentType: "application/json; charset=utf-8",
    	            data: dataStringify,
    	            dataType: "Json",
    	            success: function (msg) {
    	                if (msg && msg.status && msg.status.statusCode == global.status.success) {
    	                	var data = msg.data;
    	                	if(data){
    	                		_this.fillContentFromJsonData(data);
                                _this.fillDriverContentFromJsonData(data);
                                _this.fillUserContentFromJsonData(data.userInfo);
    	                	}
    	                } else {
    	                	alert("页面参数错误，或数据已不存在。");
                        	window.close();
    	                }
    	            }
    	        });
            } else {
            	var url = "/admin/vehiclemanage/queryDriverandVehicleCheckDetail?accountId=" + options.accountId+'&vehicleInfoId='+options.vehicleInfoId;
                $.get(global.server + url, function (msg) {
                    if (msg && msg.status && msg.status.statusCode == global.status.success) {
                        var data = msg.data;
                        if(data.status=='01') {
                        	$('#checkUnpass').show();
                			$('#checkPass').show();
                        } else {
                        	$('#checkUnpass').remove();
                			$('#checkPass').remove();
                        }
                        if(data){
                        	_this.fillContentFromJsonData(data);
                            _this.fillDriverContentFromJsonData(data);
                            _this.fillUserContentFromJsonData(data.userInfo);
                        }
                    } else {
                    	alert("页面参数错误，或数据已不存在。");
                    	window.close();
                    }
                });
                $('#checkUnpass').click(function(){
                	_this.check({accountId:accountId,vehicleInfoId:vehicleInfoId,authFlag:1});
        		});
        		
        		$('#checkPass').click(function(){
        			_this.check({accountId:accountId,vehicleInfoId:vehicleInfoId,authFlag:0});
        		});
            }
        } else {
        	alert("页面参数错误");
        	window.close();
        }
    }
    
	this.init(options);
	
};

CBSDriverInfo.prototype.fillUserContentFromJsonData=function(data) {
	if(!data) return;
	this.data=data;
	var _this=this;
	var status=data.status;
	if(status=='00') {
		status='审核通过:';
	} else if(status=='01') {
		status='待审核:';
	} else if(status=='02') {
		status='审核未通过:';
	} else {
		status='';
	}
	$('.user-info-1').html(global.defaultIfBlack(data.realName,'')+' '+global.defaultIfBlack(data.telphone,''));
	$('.user-info-2').html(status+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;身份证号'+global.defaultIfBlack(data.idno,''));
	$('.user-info-3').html('审核人:'+global.defaultIfBlack(data.checkBy,''));
	$('.b1').html(global.defaultIfBlack(data.updatedTime,''));
	$('.b2').html(global.defaultIfBlack(data.checkTime,''));
	$('.to-info').click(function(){
		_this.direct(data.accountId);
	});
}

CBSDriverInfo.prototype.fillContentFromJsonData = function (data) {
    if (!data) return;
    this.data = data;
    var _this = this;
    this.columns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.text(pValue);
    });
    // 加载照片控件
    if (typeof CBSImageInfo === "function") {
    	this.imageColumns.each(function(i, j){
    		var category = $(this).data("column");
    		var imageId = data[category];
        	var image = new CBSImageInfo({
        		view: $(this),
        		category: $(this).data("column"),
        		imageId: imageId
            });
        });
    };
};

CBSDriverInfo.prototype.fillDriverContentFromJsonData=function(data) {
	var _this = this;
	var real = _this.opt.real;
	var driverInfo = data.driverList;
	if(!real){
		driverInfo = data.DriverInfo;
	}
	$.each(driverInfo,function(i,j){
		var el=$('<div class="group">\
				<div class="info_line">\
					<div class="info_line_div">\
						<label class="fl labe_l">姓名：</label>\
						<span class="fr spa_n driver-column" data-column="realName"></span>\
					</div>\
					<div class="info_line_div">\
						<label class="fl labe_l">手机号：</label>\
						<span class="fr spa_n driver-column" data-column="telphone"></span>\
					</div>\
					<div class="info_line_div">\
						<label class="fl labe_l">身份证号：</label>\
						<span class="fr spa_n driver-column" data-column="idno"></span>\
					</div>\
				</div>\
				<ul class="u_l clearfix">\
					<li class="mar_left">\
						<div class="im_ages car-img" data-column="idFImageRefId"></div>\
						<span>身份证正面照片</span>\
					</li>\
					<li>\
						<div  class="im_ages car-img" data-column="idBImageRefId"></div>\
						<span>身份证反面照片</span>\
					</li>\
					<li>\
						<div class="im_ages car-img" data-column="qualifiImageRefId"></div>\
						<span>从业资格证照片</span>\
					</li>\
					<li>\
						<div class="im_ages car-img" data-column="qualifiImage2RefId"></div>\
						<span>从业资格证照片</span>\
					</li>\
					<li>\
						<div class="im_ages car-img" data-column="drivingFImageRefId"></div>\
						<span>驾驶证照片</span>\
					</li>\
				</ul>\
				<hr class="sp-line"/>\
			</div>')
		$('.driver-info').append(el);
		if(i==(driverInfo.length-1)) {
			el.find('.sp-line').remove();
		}
		var columns=el.find('.driver-column');
		var imageColumns=el.find('.car-img');
		columns.each(function (k, l) {
	    	var _this = $(this);
	    	var pName = _this.data("column");
	    	var pValue = j[pName];
	    	_this.text(pValue);
	    });
		if (typeof CBSImageInfo === "function") {
	    	imageColumns.each(function(k, l){
	    		var category = $(this).data("column");
	    		var imageId = j[category];
	        	var image = new CBSImageInfo({
	        		view: $(this),
	        		category: $(this).data("column"),
	        		imageId: imageId
	            });
	        });
	    };
	});
}

CBSDriverInfo.prototype.direct=function(accountId) {
	var url = global.getContextPath() + '/newAccountInfo2.html?accountId='+accountId;
	var body = document.getElementsByTagName("body")[0];
	var el = document.createElement("a");
	body.appendChild(el);
	el.href = url;
	el.target = '_blank';
	el.click();
	body.removeChild(el);
}

CBSDriverInfo.prototype.check=function(data) {
	$.ajax({
        type: "get",
        url: global.server + '/admin/vehiclemanage/driverAndVehicleCheck',
        data: data,
        async: true,
        success: function(msg) {
        	if (msg && msg.status && msg.status.statusCode == global.status.success) {
        		alert('操作成功！');
        		//window.location.reload();
        		window.close();
        		window.opener.location.reload();
        	} else if(msg.status.statusCode != global.status.success){
            	return false;
            }
        }
    });
}