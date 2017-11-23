var CBSContractInfo = function(options){
	this.opt = $.extend({}, options);
	
	
	this.init = function(options){
		var _this = this;
		var consignId = _this.opt.consignId;
		_this.getData(consignId);
	};
	
	
	this.getData = function(consignId){
		var _this = this;
		$.get(global.server+'/admin/consignment/getConsignDetail',{consignId:consignId}, function(msg){
			if (msg && msg.status && msg.status.statusCode == global.status.success) {
				var data = msg.data;
				_this.fillContentFromJsonData(data);
			}
		});
	}
	
	
	this.init(options);
};

CBSContractInfo.prototype.getFullAddress = function(info){
	var pcd = [];
	var area = info.area;
	$.each(area, function(i, j){
		pcd.push(j.regionName);
	});
	var str = pcd.reverse().join("");
	return str+info.address;
};

CBSContractInfo.prototype.getAgreementName = function(agreementInfo){
	if(agreementInfo != null) {
		var startCodeCCn = agreementInfo.startCodeCCn;
		var endCodeCCn = agreementInfo.endCodeCCn;
		var lineAttribute = agreementInfo.lineAttribute;
		var needLength = agreementInfo.needLength;
		return startCodeCCn +"-" +endCodeCCn + "+" + lineAttribute + "+" + needLength + "m";
	}else {
		return "";
	}
};

CBSContractInfo.prototype.fillData = function(data, selector){
    $(selector).each(function(i, j){
    	var properties = $(j).data('column');
    	console.log(properties)
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



CBSContractInfo.prototype.fillContentFromJsonData = function (data) {
    if (!data) return;
    var _this = this;
    
    var baseInfo = data.orderBaseInfo;
    _this.fillData(baseInfo,'.baseInfo-column');
    var isPredict=baseInfo.isPredict;
    if(isPredict=="01") {
    	$('.isPredict').html("准确");
    }  else if(isPredict=="02") {
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
    
    var consignInfo = data.consignmentInfo;
    _this.fillData(consignInfo,'.consignInfo-column');
    
    var hasConsign = data.hasConsign;
    $('.hasConsign').text(hasConsign);
    
    var agreementInfo = data.agreementInfo;
    var agreementName = _this.getAgreementName(agreementInfo);
    $('.agreementName').text(agreementName);
};

CBSContractInfo.prototype.getPriceJsonData=function() {
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


$(function(){
	
	var consignId = global.QueryString.consignId;
	var param = {
		consignId : consignId
	};
	var contractInfo = new CBSContractInfo(param);
	
});
