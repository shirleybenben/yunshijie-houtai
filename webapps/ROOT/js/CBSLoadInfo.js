var CBSLoadInfo = function(options){
	this.opt = $.extend({}, options);
	this.loadColumns=$('.load-column');
	this.orderColumns=$('.order-column');

	this.init = function(options){
		var _this = this;
		var loadId = _this.opt.loadId;
		_this.getData(loadId);
		_this.getRemarkHis(loadId);
	};
	
	
	this.getData = function(loadId){
		var _this = this;
		$.get(global.server+'/admin/load/getLoadDetail',{loadId:loadId}, function(msg){
			if (msg && msg.status && msg.status.statusCode == global.status.success) {
				var data = msg.data;
				_this.data = data;
				_this.fillLoadContentFromJsonData(data.loadInfo);
				_this.fillOrderContentFromJsonData(data.orderInfo);

			}
		}).done(function(msg){
			var _f=true;  //只有发车按钮
			$('.action').hide();
			var action=msg.data.actionList;
			var contractId=msg.data.loadInfo.contractId;//司机合同
			var consignNo=msg.data.orderInfo.consignNo;//运单号
			if(contractId=='') {
				$('.driver_contract_btn').show();
				_f=false;
			}
			if(!consignNo){
				$('.consign_btn').show();
				_f=false;
			}
			if(action) {
				$.each(action,function(i,j){
					if(j.code=='12' || j.code == '14') {
						if(contractId==''){
							$('.action_'+j.code).show();
						}
					}else{
						$('.action_'+j.code).show();
						if(_f) {
							$('.action_11').addClass('active');
						}
					}
//					if(j.code=='12') {
//						$('.action_12').show();
//					} else if(j.code=='14') {
//						$('.action_14').show();
//					} else if(j.code=='11') {
//						$('.action_11').show();
//					}
				});
			}
			$('.driver_contract_btn').click(function(){
		    	var options = {
		    		data : {loadId : loadId},
		    		text : '是否确认生成司机合同',
		    		callback:function(data){
		    			_this.createDriverContract(loadId);
		    		}
		    	}
		    	new CBSConfirm(options);
		    });
		    $('.consign_btn').click(function(){
		    	_this.createConsign(msg.data.orderInfo.orderId);
		    });
		    $('.action_12').click(function(){
		    	var options = {
		    		data : {loadId : loadId},
		    		text : '是否确认取消',
		    		yes:'是',
		    		no:'否',
		    		callback:function(data){
		    			_this.cancelLoad(loadId);
		    		}
		    	}
		    	new CBSConfirm(options);
		    });
		    $('.action_11').click(function(){
		    	var options={
	    			data:{loadId:loadId},
	    			text:'是否确认发车',
	    			yes:'确认',
		    		no:'取消',
	    			callback:function(data) {
	    				_this.tripTheCar(loadId);
	    			}
		    	}
		    	new CBSConfirm(options);
		    });
		    $('.action_14').click(function(){
		    	_this.editLoad(loadId);
		    });
		});
	};
	
	this.init(options);
};


CBSLoadInfo.prototype.fillLoadContentFromJsonData = function (data) {
    if (!data) return;
    var _this = this;
    this.loadColumns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.text(pValue);
    });
    
    var getDriver = function(driverInfo, type){
		var result = null;
		$.each(driverInfo, function(i, j){
			if(j.isMajor == type){
				result = j;
				return false;
			}
		});
		return result;
	}
    
    var driverInfo=data.driverInfo;
//    var realName=$('span[data-column="_realName"]');
//    var telphone=$('span[data-column="_telphone"]');
//    $.each(driverInfo,function(i,j){
//    	if(j.realName) {
//    		$(realName[i]).text(j.realName);
//    	}
//    	if(j.telphone) {
//    		$(telphone[i]).text(j.telphone);
//    	}
//    });
    if(driverInfo){
    	var driver1 = getDriver(driverInfo,'01');
    	if(driver1!=null) {
    		$('span[data-column="_realName1"]').text(driver1.realName);
        	$('span[data-column="_telphone1"]').text(driver1.telphone);
    	}
    	var driver2 = getDriver(driverInfo,'02');
    	if(driver2!=null) {
    		$('span[data-column="_realName2"]').text(driver2.realName);
        	$('span[data-column="_telphone2"]').text(driver2.telphone);
    	}
    }
    var isPredict=data.isPredict;
    if(isPredict=='01') {
    	$('span[data-column="isPredict"]').text('准确');
    } else if(isPredict=='02') {
    	$('span[data-column="isPredict"]').text('预估');
    }
    var bridgeType=data.bridgeType;
    if(bridgeType=="01") {
    	$('span[data-column="bridgeType"]').text("单桥");
    } else if(bridgeType=="02") {
    	$('span[data-column="bridgeType"]').text("双桥");
    }
};

CBSLoadInfo.prototype.fillOrderContentFromJsonData = function (data) {
    if (!data) return;
    var _this = this;
    this.orderColumns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	if(pValue){
    		if(pName == 'pickUpTime' || pName == 'needStartTime' || pName == 'needArriveTime'){
    			pValue = moment(pValue).format("YYYY-MM-DD HH:mm");
    		}
    		_this.text(pValue);
    	} else {
    		_this.text('');
    	}
    	
    });
    
    var getPcd = function(data){
		var p = "";
		var c = "";
		var d = "";
		$.each(data,function(i, j){
			if(j.regionLevel == 1){
				p = j.regionName;
			} else if(j.regionLevel == 2){
				c = j.regionName;
			} else if(j.regionLevel == 3){
				d = j.regionName;
			}
		});
		var result = '';
		if(p){
			result+=p+" ";
		}
		if(c){
			result+=c+" ";
		}
		if(d){
			result+=d+" ";
		}
		return result;
	}
    
    var needType=data.needType?data.needType:'';
    var needLength=data.needLength?data.needLength:'';
    if(needLength=='其他') {
    	needLength=needLength;
    } else {
    	needLength=needLength+"米";
    }
    var _need=needType+" "+needLength;
    $('span[data-column="_need"]').text(_need);
    var startP=data.startCodePCn?data.startCodePCn:'';
    var startC=data.startCodeCCn?data.startCodeCCn:'';
    var endP=data.endCodePCn?data.endCodePCn:'';
    var endC=data.endCodeCCn?data.endCodeCCn:'';
    var start=startP+" "+startC;
    var end=endP+" "+endC;
    $('span[data-column="_start"]').text(start);
    $('span[data-column="_end"]').text(end);
    var receive=getPcd(data.receiveRegion);
    var send=getPcd(data.sendRegion);
    $('span[data-column="_receive"]').text(receive+" "+data.receiveAddress);
    $('span[data-column="_send"]').text(send+" "+data.sendAddress)
};
//生成司机合同
CBSLoadInfo.prototype.createDriverContract=function(loadId) {
	var url='/admin/contract/create';
	$.ajax({
        url: global.server + url,
        type: "post",
        data: {loadId:loadId},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	alert('已生成司机合同');
            	window.location.reload();
            } else {
            	alert(msg.status.errorMsg);
            }
        }
    });
}
//取消提货单
CBSLoadInfo.prototype.cancelLoad=function(loadId) {
	var url='/admin/load/cancel';
	$.ajax({
        url: global.server + url,
        type: "post",
        data: {loadId:loadId},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	alert('已取消');
            	window.close();
            	window.opener.location.reload();
            } else {
            	alert(msg.status.errorMsg);
            }
        }
    });
}
//生成运单
CBSLoadInfo.prototype.createConsign=function(orderId) {
	var url = global.getContextPath() + '/busContract.html?orderId='+orderId;
	var body = document.getElementsByTagName("body")[0];
	var el = document.createElement("a");
	body.appendChild(el);
	el.href = url;
	el.target = '_blank';
	el.click();
	body.removeChild(el);
}
//修改提货单
CBSLoadInfo.prototype.editLoad=function(loadId) {
	var url = global.getContextPath() + '/addBusVehicles.html?loadId='+loadId;
	var body = document.getElementsByTagName("body")[0];
	var el = document.createElement("a");
	body.appendChild(el);
	el.href = url;
	el.target = '_blank';
	el.click();
	body.removeChild(el);
}
//发车
CBSLoadInfo.prototype.tripTheCar=function(loadId) {
	var url='/admin/load/doTrip';
	$.ajax({
        url: global.server + url,
        type: "post",
        data: {loadId:loadId},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	alert('已发车');
            	window.close();
            	window.opener.location.reload();
            } else {
            	alert(msg.status.errorMsg);
            }
        }
    });
}

CBSLoadInfo.prototype.getRemarkHis=function(loadId) {
	var url = "/admin/remark/getRecordList";
	$.ajax({
        url: global.server + url,
        type: "get",
        data: {targetId:loadId,remarkType:'04'},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	$('.hover_content').append('<h4>操作记录</h4>');
            	var recordList=msg.data;
            	if(recordList.length>0) {
            		$.each(recordList,function(i,j){
            			var content=j.content;
            			if(j.destStatus=='11'&&j.srcStatus=='11') {
            				var contentJson=$.parseJSON(content);
            				content=contentJson.msgInfo;
            				$('.hover_content').append('<p><span>'+global.defaultIfBlack(j.realName,'')+'</span> 推送时间：'+j.createdTime+' 备注:'+content+'</p>');
            			} else {
            				$('.hover_content').append('<p><span>'+global.defaultIfBlack(j.realName,'')+'</span> 推送时间：'+j.createdTime+' 备注:'+content+'</p>');
            			}
            		})
            	}
            } else {
            	console.log(msg.status.errorMsg);
            }
        }
    });
}


$(function(){
	
	var loadId = global.QueryString.loadId;
	var param = {
		loadId : loadId
	};
	var load=new CBSLoadInfo(param);
    $(".check_hover").hover(function(){$(".hover_content").show()},function(){$(".hover_content").hide()})
	
});
