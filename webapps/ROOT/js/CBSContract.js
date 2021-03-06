var CBSContract = function(options){
	this.opt = $.extend({}, options);
	
	
	this.init = function(options){
		var _this = this;
		var orderId = _this.opt.orderId;
		_this.getData(orderId);
	};
	
	
	this.getData = function(orderId){
		var _this = this;
		$.get(global.server+'/admin/order/getOrderDetail',{orderId:orderId}, function(msg){
			if (msg && msg.status && msg.status.statusCode == global.status.success) {
				var data = msg.data;
				_this.fillContentFromJsonData(data);
			}
		});
	}
	
	
	this.init(options);
};

CBSContract.prototype.getFullAddress = function(info){
	var pcd = [];
	var area = info.area;
	$.each(area, function(i, j){
		pcd.push(j.regionName);
	});
	var str = pcd.reverse().join("");
	return str+info.address;
};

CBSContract.prototype.fillData = function(data, selector){
    $(selector).each(function(i, j){
    	var properties = $(j).data('column');
    	var pList = properties.split(',');
    	var $self = $(j);
    	if(data!=null){
    		var value = [];
    		$.each(pList,function(i, j){
    			if (j=='needLength'){
        			if(data[j]!='其他'){
        				value.push(data[j]+" 米");
        			} else {
            			value.push(data[j]);
            		}
        		} else if(j=='needStartTime'||j=='needArriveTime'||j=='pickUpTime'){
        			if(data[j]) {
        				var _date=moment(data[j]).format("YYYY-MM-DD HH:mm");
        				value.push(_date);
        			}
        		} else {
        			value.push(data[j]);
        		}
        	});
    		$self.text(value.join(' '));
    	} else {
    		$self.text("");
    	}
    });
}



CBSContract.prototype.fillContentFromJsonData = function (data) {
    if (!data) return;
    var _this = this;
    
    var baseInfo = data.orderBaseInfo;
    _this.fillData(baseInfo,'.baseInfo-column');
    $("input[data-column='goodsWeight']").val(baseInfo.goodsWeight);
    $("input[data-column='goodsVolume']").val(baseInfo.goodsVolume);
    var isPredict=baseInfo.isPredict;
    if(isPredict=="01") {
    	$('.isPredict').html("准确");
    } else if(isPredict=="02") {
    	$('.isPredict').html("预估");
    }
    
    var lineInfo = data.orderLineInfo;
    _this.fillData(lineInfo,'.lineInfo-column');
    
    var detailInfo = data.orderDetailInfo
    _this.fillData(detailInfo,'.detailInfo-column');

    var senderInfo = data.orderSenderInfo;
    _this.fillData(senderInfo,'.senderInfo-column');
    
    var senderAddr = _this.getFullAddress(senderInfo);
    $('.senderInfo-addr').text(senderAddr);
    
    var receiverInfo = data.orderReceiverInfo;
    _this.fillData(receiverInfo,'.receiverInfo-column');
    
    var receiverAddr = _this.getFullAddress(receiverInfo);
    $('.receiverInfo-addr').text(receiverAddr);
    
    var chargeInfo = data.chargeInfo;
    _this.fillData(chargeInfo,'.chargeInfo-column');
};

CBSContract.prototype.getPriceJsonData=function() {
	var priceColumns=$('.price_column');
	var data = {};
	priceColumns.each(function(i, j){
		var _this = $(this);
		var pName = _this.data("column");
		var pValue = _this.val();
		data[pName] = pValue;
	});
	return data;
}

CBSContract.prototype.doSave=function() {
	var _this = this;
	var result = _this.getPriceJsonData();
	if(result.goodsWeight>=100000) {
		alert('重量最大为100000');
		return false;
	}
	if(result.goodsVolume>=1000) {
		alert('体积最大为3位整数，最多保留一位小数');
		return false;
	}
	result.orderId=_this.opt.orderId;
    var url = "/admin/consignment/createConsignment";
    $.ajax({
        url: global.server + url,
        type: "POST",
        data: result,
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	//alert("保存成功。");
        		window.close();
        		window.opener.location.reload();
            } else {
            	//console.log(msg.status.errorMsg);
            	alert(msg.status.errorMsg);
            }
        }
    });
}


$(function(){
	
	var orderId = global.QueryString.orderId;

	var param = {
		orderId : orderId
	};
	
	var orderInfo = new CBSContract(param);
	
	$('.cansel').click(function(){
		var options = {
				data : {orderId : orderId},
				text : '是否确认取消',
				callback:function(data){
					window.close();
				}
			}
		new CBSConfirm(options);
	});

	$('.conserve').click(function(){
		var freightPrice=$('input[data-column="freightPrice"]').val();
		var loadPrice=$('input[data-column="loadPrice"]').val();
		var otherPrice=$('input[data-column="otherPrice"]').val();
		var total=(Number($.trim(freightPrice))+Number($.trim(loadPrice))+Number($.trim(otherPrice))).toFixed(2);
		$('input[data-column="total"]').val(total);
		var options = {
				data : {orderId : orderId},
				text : '是否确认生成运单',
				callback:function(data){
					orderInfo.doSave();
				}
			}
		new CBSConfirm(options);
	});
	
});
