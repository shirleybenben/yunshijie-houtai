var CBSOrderPush = function(data){
	this.data = data;
	
	this.el= $('<div class="mo_del"> \
			<div class="model_content"> \
				<h4>推送运势界</h4> \
				<div class="mess_age"> \
					<div class="clearfix"> \
						<div class="left short fl"> \
							<div class="layout clearfix"> \
								<p class="fl stage">订单号</p> \
								<span class="fr spa_n detailInfo-column" data-column="orderNo"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">目的地</p> \
								<span class="fr spa_n lineInfo-column" data-column="endCodePCn,endCodeCCn"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">体积</p> \
								<span class="fr spa_n baseInfo-column" data-column="goodsVolume"></span> \
							</div> \
							<div class="layout clearfix"> \
								<label class="fl labe_l people">司机要求</label> \
								<select class="fr inpu_t column" data-column="needDriverNum">\
									<option value="1">1人</option>\
									<option value="2">2人</option>\
								</select>\
							</div> \
						</div> \
						<div class="right short fr"> \
							<div class="layout clearfix"> \
								<p class="fl stage">始发地</p> \
								<span class="fr spa_n lineInfo-column" data-column="startCodePCn,startCodeCCn"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">重量</p> \
								<span class="fr spa_n baseInfo-column" data-column="goodsWeight"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">用车要求</p> \
								<span class="fr spa_n baseInfo-column" data-column="needLength,needType"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">提货时间</p> \
								<span class="fr spa_n baseInfo-column" data-column="pickUpTime"></span> \
							</div> \
						</div> \
					</div> \
					<div class="layout layout_two clearfix"> \
						<label class="fl labe_l lab_line">竞标起止时间</label> \
						<input class="inpu_t mar_rig use-date column" data-column="startTime" type="text" />\
						<input class="inpu_t use-date column" data-column="endTime" type="text" /> \
					</div> \
					<div class="tips"> \
						<div class="text">&nbsp;</div> \
					</div> \
				</div> \
				<a href="javascript:void(0);" class="model_content_push">推送</a> \
				<i class="clo_se"></i> \
			</div> \
			<div class="model_content_next"> \
				<h4>确认推送运势界</h4> \
				<div class="mess_age"> \
					<div class="clearfix"> \
						<div class="left short fl"> \
							<div class="layout clearfix"> \
								<p class="fl stage">订单号</p> \
								<span class="fr spa_n detailInfo-column" data-column="orderNo"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">目的地</p> \
								<span class="fr spa_n lineInfo-column" data-column="endCodePCn,endCodeCCn"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">体积</p> \
								<span class="fr spa_n baseInfo-column" data-column="goodsVolume" ></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">司机要求</p> \
								<span class="fr spa_n first-column" data-column="needDriverNum"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">竞标起止时间</p> \
								<span class="fr spa_n first-column" data-column="startTime,endTime"></span> \
							</div> \
						</div> \
						<div class="right short fr"> \
							<div class="layout clearfix"> \
								<p class="fl stage">始发地</p> \
								<span class="fr spa_n lineInfo-column" data-column="startCodePCn,startCodeCCn"></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">重量</p> \
								<span class="fr spa_n baseInfo-column" data-column="goodsWeight" ></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">用车要求</p> \
								<span class="fr spa_n baseInfo-column" data-column="needLength,needType" ></span> \
							</div> \
							<div class="layout clearfix"> \
								<p class="fl stage">提货时间</p> \
								<span class="fr spa_n baseInfo-column" data-column="pickUpTime"></span> \
							</div> \
						</div> \
					</div> \
				</div> \
				<a href="javascript:void(0);" class="push_sure">确认推送</a> \
				<i class="clo_se"></i> \
			</div> \
			</div>');
	
	
	this.init = function(){
		var _this = this;
		$('body').append(_this.el);
		_this.el.find('.clo_se').click(function(){
			_this.destory();
		});
		_this.el.find('.model_content_push').click(function(){
			_this.showNext();
		});
		_this.el.find('.push_sure').click(function(){
			_this.doPush();
		});
		_this.fillContentFromJsonData();
		
		_this.el.find('.use-date').each(function(i, j){
			$(this).datetimepicker({
        		timepicker:true,
        		format:'Y-m-d H:i',
        		autoclose:true,
        		todayHighlight:true,
        		keyboardNavigation:false
    		});
		});
		var needOwnVehicles = _this.data.orderBaseInfo.needOwnVehicles;
		if(needOwnVehicles == '否'){
			var tips = '客户合同要求使用公司车辆，是否继续在运势界寻找外请车辆？';
			_this.el.find('.tips > .text').text(tips);
		} 
		_this.show();
	};
	
	this.showNext = function(){
		var _this = this;
		var data = _this.getData();
		var valid = _this.validToPost(data);
		if(valid){
			var next = _this.el.find('.model_content_next');
			_this.fillData(data,'.model_content_next .first-column');
			next.show();
		}
	};
	
	
	this.getData = function(){
		var _this = this;
		var data = {};
		_this.el.find('.column').each(function(i, j){
			var self = $(j);
			var pName = self.data('column');
			var pValue = self.val();
			data[pName] = pValue;
		});
		return data;
	}
	
	this.doPush = function(){
		var _this = this;
		var data = _this.data;
		var result = _this.getData();
	    var valid = _this.validToPost(result);
	    if(valid){
	    	result.orderId = data.orderDetailInfo.orderId;
	    	var dataStringify = JSON.stringify(result);
	    	var url = '/admin/order/push';
	        $.ajax({
	            url: global.server + url,
	            type: "POST",
	            contentType: "application/json; charset=utf-8",
	            data: dataStringify,
	            dataType: "Json",
	            success: function (msg) {
	                if (msg && msg.status && msg.status.statusCode == global.status.success) {
	                	alert("订单已推送至运势界");
	                	window.close();
	                } else {
	                	alert(msg.status.errorMsg);
	                }
	            }
	        });
	    }
	}
	
	this.show = function(){
		var _this = this;
		_this.el.show();
	}
	
	this.destory = function(){
		var _this = this;
		_this.el.remove();
	}
	
	
	this.init();
};


CBSOrderPush.prototype.fillData = function(data, selector){
	var _this = this;
	_this.el.find(selector).each(function(i, j){
    	var properties = $(j).data('column');
    	var pList = properties.split(',');
    	var $self = $(j);
    	var value = [];
    	$.each(pList,function(i, j){
    		if(j=='goodsVolume'){
    			value.push(data[j]+" m³");
    		} else if (j=='goodsWeight'){
    			value.push(data[j]+" kg");
    		} else if (j=='needDriverNum'){
    			value.push(data[j]+" 人");
    		} else if (j=='needLength'){
    			if(data[j]!='其他'){
    				value.push(data[j]+" 米");
    			} else {
        			value.push(data[j]);
        		}
    		} else if(j=='pickUpTime'){
    			if(data[j]) {
    				var _date=moment(data[j]).format("YYYY-MM-DD HH:mm");
    				value.push(_date);
    			}
    		} else {
    			value.push(data[j]);
    		}
    	});
    	$self.text(value.join(' '));
    });
};

CBSOrderPush.prototype.validToPost = function(data){
	var _this = this;
	var hasError = false;
	var errorProperties = null;
	$.each(data,function(i, j){
		if(j==''){
			hasError = true;
			errorProperties = i;
			return false;
		}
	});
	if(!hasError){
		var startTime = data.startTime;
		var endTime = data.endTime;
		var d_s = moment(startTime, "YYYY-MM-DD HH:mm");
		var d_e = moment(endTime, "YYYY-MM-DD HH:mm");
		var time_valid = d_e.isAfter(d_s);
		if(!time_valid){
			hasError = true;
			errorProperties = "timeDiff";
		}
	}
	if(hasError){
		var message = _this.errorInfo(errorProperties);
		alert(message);
	}
	return !hasError;
};


CBSOrderPush.prototype.errorInfo = function(properties){
	var message = {
		needDriverNum :"请填写司机要求",
		startTime:"请填写竞标开始时间",
		endTime:"请填写竞标结束时间",
		timeDiff:"开始时间必须早于结束时间"
	};
	return message[properties];
};



CBSOrderPush.prototype.fillContentFromJsonData = function () {
    var _this = this;
    var data = _this.data;

    var baseInfo = data.orderBaseInfo;
    _this.fillData(baseInfo,'.baseInfo-column');
    
    var lineInfo = data.orderLineInfo;
    _this.fillData(lineInfo,'.lineInfo-column');
    
    var detailInfo = data.orderDetailInfo
    _this.fillData(detailInfo,'.detailInfo-column');
};