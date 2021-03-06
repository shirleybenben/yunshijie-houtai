var CBSPayInfo = function(options){
	this.opt = $.extend({}, options);
	this.vColumns=$('.v-column');
	this.payColumns=$('.pay-column');

	this.init = function(options){
		var _this = this;
		var contractId = _this.opt.contractId;
		_this.getData(contractId);
	};
	
	
	this.getData = function(contractId){
		var _this = this;
		$.get(global.server+'/admin/payables/getPayDetail',{contractId:contractId}, function(msg){
			if (msg && msg.status && msg.status.statusCode == global.status.success) {
				var data = msg.data;
				_this.data = data;
				_this.fillOrderContentFromJsonData(data.payVehicleInfo);
				_this.fillPayContentFromJsonData(data.payChargesInfo);
				_this.fillFeedBackContentFromJsonData(data.feedBackList);
			}
		}).done(function(msg){
			var data = msg.data;
			var status=data.payVehicleInfo.status;
			if(status=='04') {
				$('.padd_ing').remove();
				$('.fee').remove();
			}
			$('.padd_ing').click(function() {
				$('.mo_del').show();
				$('.review').show().siblings('div').hide();
				//提交审核
				$('.check_confirm').click(function(){
					$.ajax({
				        url: global.server + '/admin/payables/verifyPayables',
				        type: "POST",
				        data: {
				        	contractId:contractId
				        },
				        success: function (msg) {
				            if (msg && msg.status && msg.status.statusCode == global.status.success) {
				            	window.close();
				            	window.opener.location.reload();
				            } else {
				            	alert(msg.status.errorMsg);
				            }
				        }
				    });
				});
			});
		});
	};
	
	this.init(options);
};


CBSPayInfo.prototype.fillOrderContentFromJsonData = function (data) {
    if (!data) return;
    var _this = this;
    this.vColumns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.text(pValue);
    });
    var startCodePCn=data.startCodePCn;
    var startCodeCCn=data.startCodeCCn;
    var endCodePCn=data.endCodePCn;
    var endCodeCCn=data.endCodeCCn;
    $('span[data-column="_start"]').text(startCodePCn+" - "+startCodeCCn);
    $('span[data-column="_end"]').text(endCodePCn+" - "+endCodeCCn);
};

CBSPayInfo.prototype.fillPayContentFromJsonData=function(data) {
	if (!data) return;
    var _this = this;
    this.payColumns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.text(pValue);
    });
    var oilCardNo=data.oilCardNo;
    if(oilCardNo) {
    	$('span[data-column="oilPay"]').html(data.oilPay+'<b>(卡号:'+data.oilCardNo+')</b>');
    } else {
    	$('span[data-column="oilPay"]').html(data.oilPay);
    }
    
}

CBSPayInfo.prototype.fillFeedBackContentFromJsonData=function(data) {
	if (!data) return;
    var _this = this;
    var cheJianList=new Array();
	var kaoTaiList=new Array();
	var faCheList=new Array();
	var daoDaList=new Array();
	$.each(data,function(i,j){
		var status=j.status;
		if(status=='01') {
			cheJianList.push(j);
		} else if(status=='02') {
			kaoTaiList.push(j);
		} else if(status=='03') {
			faCheList.push(j);
		} else if(status=='11') {
			daoDaList.push(j);
		}
	});
	if(cheJianList.length>0) {
		$('.chejian').show();
		$('.che_jian').show();
		_this.fillFeedBack(cheJianList,$('.che_jian'));
	}
	if(kaoTaiList.length>0) {
		$('.kaotai').show();
		$('.kao_tai').show();
		_this.fillFeedBack(kaoTaiList,$('.kao_tai'));
	}
	if(faCheList.length>0) {
		$('.fache').show();
		$('.fa_che').show();
		_this.fillFeedBack(faCheList,$('.fa_che'));
	}
	if(daoDaList.length>0) {
		$('.daoda').show();
		$('.dao_da').show();
		_this.fillFeedBack(daoDaList,$('.dao_da'));
	}
}

CBSPayInfo.prototype.fillFeedBack=function(data,head) {
	$.each(data,function(i,j){
		var el=$('<div class="un_bg">\
				<p>\
					<span class="un_time" data-column=""></span>\
					<span class="un_name" data-column="">诸葛孔明名（客服）</span>	\
					<span class="delay">时效罚款</span>\
					<span class="un_cost"><i>133</i>元</span>\
					<span class="delay_reason">实际迟到。副书记方辣椒粉低啦房间爱啦啦房间爱立方</span>\
					<span class="fee">费用调整</span>\
				</p>\
			</div>');
		el.find('.un_time').text(j.feedbackTime);
		el.find('.un_name').text(global.defaultIfBlack(j.realName,'')+'('+global.defaultIfBlack(j.position,'')+')');
		el.find('.delay').text(j.itemName);
		el.find('.un_cost>i').text(j.itemPrice);
		el.find('.delay_reason').text(j.itemDesc);
		var price=j.itemPrice;
		if(price){
			el.find('.fee').remove();
		}
		el.find('.fee').click(function(){
			var feedbackId=j.feedbackId;
			var options = {
			    	data : {
			    		feedbackId : feedbackId
			    	}
			    }
			    new CBSCostAdjust(options);
		});
		head.append(el);
	});
}

$(function(){
	
	var contractId = global.QueryString.contractId;
	var param = {
			contractId : contractId
	};
	var pay=new CBSPayInfo(param);
	
	$('.clo_se').click(function() {
		$('.mo_del').hide();
	});
	
});