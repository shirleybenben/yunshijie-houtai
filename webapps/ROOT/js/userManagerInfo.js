var CBSUseManager = function(options) {
	this.opt = $.extend({}, options);
	this.columns = $('.column');
	var _this = this;

	this.init = function(options) {
		$('#action_freeze').hide();
		$('#action_thaw').hide();
		var _this = this;
		if (options && options.accountId) {
			console.log('init account data with id: ' + options.accountId);
			var url = "/admin/account/getAccountDetail2?accountId="+ options.accountId;
			var _this = this;
			$
					.get(
							global.server + url,
							function(msg) {
								if (msg
										&& msg.status
										&& msg.status.statusCode == global.status.success) {
									var data = msg.data;
									var status=data.accountInfo.status;
									if (status == '04') {
										$('#action_thaw').show();
										$('#action_thaw').click(function(){
											_this.thaw(data.accountInfo.accountId);
										});
									} else if(status=='00') {
										$('#action_freeze').show();
										$('#action_freeze').click(function(){
											_this.freeze(data.accountInfo.accountId);
										});
									}
									_this.fillUserContentFromJsonData(data.accountInfo);
									_this.fillLineContentFromJsonData(data.lineInfo);
									_this.fillVehicleContentFromJsonData(data.accountInfo.accountId,data.vehicleInfo);
								}
							}).done(function(msg) {
						var data = msg.data;
					});
		}
	}
	this.init(options);

};

CBSUseManager.prototype.fillUserContentFromJsonData = function(data) {
	if (!data)
		return;
	this.data = data;
	var _this = this;
	var checkStatus=data.checkStatus;
	if(checkStatus=='00') {
		checkStatus='审核通过:';
	} else if(checkStatus=='01') {
		checkStatus='待审核:';
	} else if(checkStatus=='02') {
		checkStatus='审核未通过:';
	} else {
		checkStatus='';
	}
	$('.account_info_1').html(global.defaultIfBlack(data.realName,'')+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+data.telphone);
	$('.account_info_2').html(checkStatus+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;身份证号'+global.defaultIfBlack(data.idno,''));
	$('.account_info_3').html('审核人:'+global.defaultIfBlack(data.checkBy,''));
	if(!checkStatus=='') {
		$('.account_info_1').addClass('to-info');
		$('.account_info_2').addClass('to-info');
		$('.account_info_3').addClass('to-info');
		$('.account').click(function(){
			_this.directUser(data.accountId);
		});
	}
};

CBSUseManager.prototype.fillLineContentFromJsonData = function(data) {
	if (!data)
		return;
	this.data = data;
	var _this = this;
	if(data.length>0) {
		$.each(data,function(i,j){
			var el=$('<div class="info_line_div">\
					<span class="spa_n from">北京</span>\
					<span class="spa_n to column" data-column="">武汉</span>\
				</div>');
			el.find('.from').text(j.departureCodeCn);
			el.find('.to').text(j.destinationCodeCn);
			$('.line-info-detail').append(el);
		});
	}
};

CBSUseManager.prototype.fillVehicleContentFromJsonData = function(accountId,data) {
	if (!data)
		return;
	this.data = data;
	var _this = this;
	if(data.length>0) {
		$('.info-content').show();
		$.each(data,function(i,j){
			var driverList=j.driverList;
			var driverInfo='司机：';
			var type=j.type?'车型:'+j.type:'';
			var length=j.length?' 车长:'+j.length+'米':'';
			if(driverList) {
				$.each(driverList,function(k,l){
					driverInfo+=global.defaultIfBlack(l.realName,'')+' '+global.defaultIfBlack(l.telphone,'')+' 身份证号:'+global.defaultIfBlack(l.idno,'')+type+length+';';
				});
			}
			var el=$('<tr>\
					<td>\
						<div class="car-num to-info"></div>\
					</td>\
					<td>\
						<div class="car-list to-info"></div>\
					</td>\
					<td>\
					<div class="owe-to">\
			    		<p class="check_by to-info">审核人：张萌萌萌吗</p>\
			    	</div>\
				</td>\
				</tr>')
			el.find('.car-num').html(global.defaultIfBlack(j.plateNumber,''));
			el.find('.car-list').html(driverInfo);
			el.find('.check_by').html(j.checkName?'审核人:'+j.checkName:'审核人:');
			el.find('.to-info').click(function(){
				_this.directVehicle(accountId,j.vehicleInfoId);
			});
			$('.info-content>table>tbody').append(el);
		});
	}
};

CBSUseManager.prototype.directUser=function(accountId) {
	var url = global.getContextPath() + '/newAccountInfo2.html?accountId='+accountId;
	var body = document.getElementsByTagName("body")[0];
	var el = document.createElement("a");
	body.appendChild(el);
	el.href = url;
	el.target = '_blank';
	el.click();
	body.removeChild(el);
}

CBSUseManager.prototype.directVehicle=function(accountId,vehicleInfoId) {
	var url = global.getContextPath() + '/VehicleAndDriverInfo.html?accountId='+accountId+'&vehicleInfoId='+vehicleInfoId;
	var body = document.getElementsByTagName("body")[0];
	var el = document.createElement("a");
	body.appendChild(el);
	el.href = url;
	el.target = '_blank';
	el.click();
	body.removeChild(el);
}

//冻结
CBSUseManager.prototype.freeze = function(accountId) {
	$.ajax({
		type : "post",
		url : global.server + '/admin/account/freezeAccount',
		data : {accountId:accountId},
		async : true,
		success : function(msg) {
			if (msg && msg.status&& msg.status.statusCode == global.status.success) {
				alert('操作成功！');
				window.location.reload();
			} else if (msg.status.statusCode != global.status.success) {
				return false;
			}
		}
	});
}

//解冻
CBSUseManager.prototype.thaw = function(accountId) {
	$.ajax({
		type : "post",
		url : global.server + '/admin/account/thawAccount',
		data : {accountId:accountId},
		async : true,
		success : function(msg) {
			if (msg && msg.status&& msg.status.statusCode == global.status.success) {
				alert('操作成功！');
				window.location.reload();
			} else if (msg.status.statusCode != global.status.success) {
				return false;
			}
		}
	});
}