//发车反馈
var CBSTripFeedBack = function(options){
	this.opt = $.extend({}, options);
	
	this.el=$('<div class="mo_del">\
			<div class="model_content">\
			<h4>发车反馈</h4>\
			<div class="model_back clearfix">\
				<div class="layout mar_right fl">\
					<p class="fl stage">订单号</p>\
					<span class="fr spa_n orderNo"></span>\
				</div>\
				<div class="layout fl">\
					<p class="fl stage">运单号</p>\
					<span class="fr spa_n consignNo">OR123456778</span>\
				</div>\
				<div class="layout fl right_no">\
					<p class="fl stage">计价方式</p>\
					<span class="fr spa_n priceType"></span>\
				</div>\
			</div>\
			<div class="model_back clearfix">\
				<div class="fl">\
					<div class="layout clearfix">\
						<label class="labe_l">计划发车</label>\
						<span class="spa_n needStartTime" data-column=""></span>\
					</div>\
					<div class="layout clearfix">\
						<label class="labe_l weight">实际重量</label>\
						<input maxlength="8" class="inpu_t unit_short trip-car goodsWeight" type="text" data-column="goodsWeight" onkeyup="if(isNaN(value))execCommand(\'undo\')">\
					</div>\
					<div class="layout clearfix volume">\
						<label class="labe_l">实际体积</label>\
						<input maxlength="8" class="inpu_t unit_short trip-car goodsVolume" type="text" data-column="goodsVolume" onkeyup="if(isNaN(value))execCommand(\'undo\')">\
					</div>\
					<div class="layout clearfix">\
						<label class="labe_l">客户单号</label>\
						<input maxlength="20" class="inpu_t trip-car customerBillNo" type="text" data-column="customerBillNo">\
					</div>\
				</div>\
				<div class="fr">\
					<div class="images">\
						<input type="text" class="file-add image-column" readonly onfocus="this.blur();" data-column="contractImageRefId"/>\
						<span class="p-add">货主托运合同照片</span>\
					</div>\
				</div>\
			</div>\
			<a href="javascript:void(0);" class="">发车</a>\
			<i class="clo_se"></i>\
		</div>\
			</div>');
	
	
	this.init = function(options){
		var _this = this;
		$('body').append(_this.el);
		_this.el.find('.orderNo').text(_this.opt.data.orderNo);
		_this.el.find('.consignNo').text(_this.opt.data.consignNo);
		_this.el.find('.priceType').text(_this.opt.data.name);
		var needStartTime=_this.opt.data.needStartTime;
		if(needStartTime) {
			var _date=moment(needStartTime).format("YYYY-MM-DD HH:mm");
			_this.el.find('.needStartTime').text(_date);
		}
		var goodsWeight=_this.opt.data.goodsWeight;
		var orderGoodsWeight=_this.opt.data.orderGoodsWeight;
		if(goodsWeight) {
			_this.el.find('.goodsWeight').val(goodsWeight);
			_this.el.find('.goodsWeight').attr('readonly',true);
		} else {
			if(orderGoodsWeight) {
				_this.el.find('.goodsWeight').val(orderGoodsWeight);
			}
		}
		_this.el.find('.goodsWeight').on('blur',function(){
			var v=$(this).val();
			var dot = v.indexOf(".");
			if(dot=="-1") {
				$(this).val(v);
			} else {
				$(this).val(Number(v).toFixed(1));
			}
		});
		var goodsVolume=_this.opt.data.goodsVolume;
		var orderGoodsVolume=_this.opt.data.orderGoodsVolume;
		if(goodsVolume) {
			_this.el.find('.goodsVolume').val(goodsVolume);
			_this.el.find('.goodsVolume').attr('readonly',true);
		} else {
			if(orderGoodsVolume) {
				_this.el.find('.goodsVolume').val(orderGoodsVolume);
			}
		}
		_this.el.find('.goodsVolume').on('blur',function(){
			var v=$(this).val();
			var dot = v.indexOf(".");
			if(dot=="-1") {
				$(this).val(v);
			} else {
				$(this).val(Number(v).toFixed(1));
			}
		});
		var customerBillNo=_this.opt.data.customerBillNo;
		var orderCustomerBillNo=_this.opt.data.orderCustomerBillNo;
		if(customerBillNo) {
			_this.el.find('.customerBillNo').val(customerBillNo);
			_this.el.find('.customerBillNo').attr('readonly',true);
		} else {
			if(orderCustomerBillNo) {
				_this.el.find('.customerBillNo').val(orderCustomerBillNo);
			}
		}
		_this.el.find('.clo_se').click(function(){
			_this.destory();
		});
		_this.el.find('a').click(function(){
			_this.opt.callback.call(_this, _this.opt.data);
		});
		/*_this.el.find('.use-date').each(function(i, j){
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
        });*/
		var imageColumns=_this.el.find('.image-column');
		var imageList = _this.opt.data.imageList;
		//加载图片控件
		if (typeof CBSImage === "function") {
	    	imageColumns.each(function(i, j){
	        	var image = new CBSImage({
	        		view: $(this),
	        		category: $(this).data("column")
	            });
	        	imageList.push(image);
	        });
	    }
		_this.show();
	};
	
	this.show = function(){
		var _this = this;
		_this.el.find('.model_content').show();
		_this.el.show();
	}
	
	this.destory = function(){
		var _this = this;
		_this.el.remove();
	}
	
	this.init(options);
}

var CBSTripInfo = function(options){
	this.opt = $.extend({}, options);
	this.loadColumns=$('.load-column');
	this.orderColumns=$('.order-column');
	//this.imageColumns = $('.image-column');
	this.imageList = [];

	this.init = function(options){
		var _this = this;
		var loadId = _this.opt.loadId;
		_this.getData(loadId);
	};
	
	
	this.getData = function(loadId){
		var _this = this;
		$.get(global.server+'/admin/trip/getTripDetail',{loadId:loadId}, function(msg){
			if (msg && msg.status && msg.status.statusCode == global.status.success) {
				var data = msg.data;
				_this.data = data;
				_this.fillLoadContentFromJsonData(data.loadInfo);
				_this.fillOrderContentFromJsonData(data.orderInfo);
				_this.getFeedBack(data);
			}
		}).done(function(msg){
			var data = msg.data;
			var action=data.actionList;
			var loadId=data.loadInfo.loadId;
			var orderNo=data.orderInfo.orderNo;  //订单号
			var consignNo=data.orderInfo.consignNo;  //运单号
			var needStartTime=data.orderInfo.needStartTime;  //计划发车
			var tripFeedBackDetail=data.tripFeedBackDetail;
			var source = data.loadInfo.source;
			
			var name='';  //计价方式
			var goodsVolume=''; //运单体积
			var goodsWeight='';  //运单重量
			var customerBillNo=''; //运单客户单号
			var orderGoodsVolume='';//订单提价
			var orderGoodsWeight='';//订单重量
			var orderCustomerBillNo='';//订单客户单号
			if(tripFeedBackDetail) {
				name=tripFeedBackDetail.name;
				goodsVolume=tripFeedBackDetail.goodsVolume; 
				goodsWeight=tripFeedBackDetail.goodsWeight;
				customerBillNo=tripFeedBackDetail.customerBillNo;
				orderGoodsVolume=tripFeedBackDetail.orderGoodsVolume;
				orderGoodsWeight=tripFeedBackDetail.orderGoodsWeight;
				orderCustomerBillNo=tripFeedBackDetail.orderCustomerBillNo;
			}
			if(action) {
				$.each(action,function(i,j){
					if(j.code=='02') {  //车检
						$('.action_02').show();
						$('.action_customer').show();
						$('.action_vehicle').show();
						$('.action_customer').click(function(){
							var options = {
						    	data : {
						    		loadId : loadId,
						    		status : '01',
						    		type : '01'
						    	},
						    	title : '货主异常反馈'
//						    	callback:function(data){
//						    		var dialog = this;
//						    		_this.saveLoadFeedBack(loadId,'01','01',dialog);
//						    	}
						    }
						    new CBSFeedBack(options);
						});
						$('.action_vehicle').click(function(){
							var options = {
							    data : {
							    	loadId : loadId,
							    	status : '01',
							    	type : '02'
							    },
							    title : '车辆异常反馈'
//							    callback:function(data){
//							    	var dialog = this;
//							    	_this.saveLoadFeedBack(loadId,'01','02',dialog);
//							    }
							 }
							 new CBSFeedBack(options);
						});
					} else if(j.code=='03') {   //靠台
						$('.action_03').show();
						$('.action_customer').show();
						$('.action_vehicle').show();
						$('.action_customer').click(function(){
							var options = {
						    	data : {
						    		loadId : loadId,
						    		status : '02',
						    		type : '01'
						    	},
						    	title : '货主异常反馈'
//						    	callback:function(data){
//						    		var dialog = this;
//						    		_this.saveLoadFeedBack(loadId,'02','01',dialog);
//						    	}
						    }
						    new CBSFeedBack(options);
						});
						$('.action_vehicle').click(function(){
							var options = {
							    data : {
							    	loadId : loadId,
							    	status : '02',
							    	type : '02'
							    },
							    title : '车辆异常反馈'
//							    callback:function(data){
//							    	var dialog = this;
//							    	_this.saveLoadFeedBack(loadId,'02','02',dialog);
//							    }
							 }
							 new CBSFeedBack(options);
						});
					} else if(j.code=='06') {   //取消发车
						$('.action_06').show();
					} else if(j.code =='16'){
						$('.action_16').show();
					} else if(j.code=='05') {   //发车反馈
						$('.action_05').show();
						$('.action_customer').show();
						$('.action_vehicle').show();
						$('.action_customer').click(function(){
							var options = {
						    	data : {
						    		loadId : loadId,
						    		status : '03',
						    		type : '01'
						    	},
						    	title : '货主异常反馈'
//						    	callback:function(data){
//						    		var dialog = this;
//						    		_this.saveLoadFeedBack(loadId,'03','01',dialog);
//						    	}
						    }
						    new CBSFeedBack(options);
						});
						$('.action_vehicle').click(function(){
							var options = {
							    data : {
							    	loadId : loadId,
							    	status : '03',
							    	type : '02'
							    },
							    title : '车辆异常反馈'
//							    callback:function(data){
//							    	var dialog = this;
//							    	_this.saveLoadFeedBack(loadId,'03','02',dialog);
//							    }
							 }
							 new CBSFeedBack(options);
						});
					}
				});
				$('.action_02').click(function(){  //车检
					var options = {
			    		data : {},
			    		text : '是否确认车辆检查',
			    		callback:function(data){
			    			_this.vehicleCheck(loadId);
			    		}
			    	}
			    	new CBSConfirm(options);
				});
				$('.action_03').click(function(){  //靠台
					var options = {
				    		data : {},
				    		text : '是否确认靠台',
				    		callback:function(data){
				    			_this.closeToSurface(loadId);
				    		}
				    	}
				    	new CBSConfirm(options);
				});
				$('.action_06').click(function(){   //取消发车
					if(source == '01'){
						var options = {
								data : {},
								text:'是否确认取消发车',
								callback:function(data){
									_this.cancelTrip(loadId);
								}
							}
							new CBSConfirm(options);
					} else {
						alert('运势界创建的提货单，取消发车请先作废报价。');
					}
					
				});
				$('.action_16').click(function(){   //取消发车
					var options = {
							data : {},
							text:'是否确认取消发车',
							callback:function(data){
								_this.cancelTripForYSJ(loadId);
							}
						}
						new CBSConfirm(options);
				});
				$('.action_05').click(function(){   //发车反馈
					var options = {
						data : {
							loadId : loadId,
							orderNo:orderNo,
							consignNo:consignNo,
							name:name,
							needStartTime:needStartTime,
							goodsVolume:goodsVolume,
							goodsWeight:goodsWeight,
							customerBillNo:customerBillNo,
							orderGoodsVolume:orderGoodsVolume,
							orderGoodsWeight:orderGoodsWeight,
							orderCustomerBillNo:orderCustomerBillNo,
							imageList:_this.imageList
						},
						callback:function(data){
							var dialog = this;
							_this.tripTheCar(loadId,dialog);
						}
					}
					new CBSTripFeedBack(options);
				});
			}
		});
	};
	
	//根据异常类型重新组装发车阶段异常数据
	this.splitFeedBackList=function(data) {
		var feedBackList={};
		var driverManagerList=new Array();
		var sourceManagerList=new Array();
		var vehicleManagerList=new Array();
		$.each(data,function(i,j){
			if(j.type=='03') {
				driverManagerList.push(j);
			} else if(j.type=='01') {
				sourceManagerList.push(j);
			} else if(j.type=='02') {
				vehicleManagerList.push(j);
			}
		});
		feedBackList.driverManagerList=driverManagerList;
		feedBackList.sourceManagerList=sourceManagerList;
		feedBackList.vehicleManagerList=vehicleManagerList;
		return feedBackList;
	}
	
	//渲染发车阶段异常数据
	this.getFeedBack=function(data) {
		var _this=this;
		//车辆异常反馈
	    var VCFeedBackList=data.VCFeedBackList;
	    if(VCFeedBackList==undefined) {
	    	$('.VCFeedBack-info').remove();
	    } else {
	    	var feedBackList=_this.splitFeedBackList(VCFeedBackList.feedBackList);
	    	var driverManagerList=feedBackList.driverManagerList;
	        var sourceManagerList=feedBackList.sourceManagerList;
	        var vehicleManagerList=feedBackList.vehicleManagerList;
	        if(VCFeedBackList.actionTime) {
	        	var _date=moment(VCFeedBackList.actionTime).format("YYYY-MM-DD HH:mm");
	    		$('.vc_action_time').text(_date);
	    	} else {
	    		if(driverManagerList.length==0&&sourceManagerList.length==0&&vehicleManagerList.length==0) {
		        	$('.VCFeedBack-info').remove();
		        }
	    	}
	        if(driverManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>司机异常</h4>\
	    				<div class="un_bg vc_driver_feedback">\
	    				</div>\
	    			</div>');
	    		$('.VCFeedBack-info').append(_t);
	    		$.each(driverManagerList,function(i,j){
	        		var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	        		var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	        		el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.vc_driver_feedback').append(el);
	        	});
	    	}
	    	if(sourceManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>货主异常</h4>\
	    				<div class="un_bg vc_source_feedback">\
	    				</div>\
	    			</div>');
	    		$('.VCFeedBack-info').append(_t);
	    		$.each(sourceManagerList,function(i,j){
	    			var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	    			var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	    			el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.vc_source_feedback').append(el);
	        	});
	    	}
	    	if(vehicleManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>车辆异常</h4>\
	    				<div class="un_bg vc_vehicle_feedback">\
	    				</div>\
	    			</div>');
	    		$('.VCFeedBack-info').append(_t);
	    		$.each(vehicleManagerList,function(i,j){
	    			var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	    			var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	    			el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.vc_vehicle_feedback').append(el);
	        	});
	    	}
	    }
	    //靠台异常反馈
	    var CTSFeedBackList=data.CTSFeedBackList;
	    if(CTSFeedBackList==undefined) {
	    	$('.CTSFeedBack-info').remove();
	    } else {
	    	var feedBackList=_this.splitFeedBackList(CTSFeedBackList.feedBackList);
	    	var driverManagerList=feedBackList.driverManagerList;
	        var sourceManagerList=feedBackList.sourceManagerList;
	        var vehicleManagerList=feedBackList.vehicleManagerList;
	        if(CTSFeedBackList.actionTime) {
	        	var _date=moment(CTSFeedBackList.actionTime).format("YYYY-MM-DD HH:mm");
	        	$('.cts_action_time').text(_date);
	        } else {
	        	if(driverManagerList.length==0&&sourceManagerList.length==0&&vehicleManagerList.length==0) {
		        	$('.CTSFeedBack-info').remove();
		        }
	        }
	        if(driverManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>司机异常</h4>\
	    				<div class="un_bg cts_driver_feedback">\
	    				</div>\
	    			</div>');
	    		$('.CTSFeedBack-info').append(_t);
	    		$.each(driverManagerList,function(i,j){
	        		var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	        		var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	        		el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.cts_driver_feedback').append(el);
	        	});
	    	}
	    	if(sourceManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>货主异常</h4>\
	    				<div class="un_bg cts_source_feedback">\
	    				</div>\
	    			</div>');
	    		$('.CTSFeedBack-info').append(_t);
	    		$.each(sourceManagerList,function(i,j){
	    			var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	    			var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	    			el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.cts_source_feedback').append(el);
	        	});
	    	}
	    	if(vehicleManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>车辆异常</h4>\
	    				<div class="un_bg cts_vehicle_feedback">\
	    				</div>\
	    			</div>');
	    		$('.CTSFeedBack-info').append(_t);
	    		$.each(vehicleManagerList,function(i,j){
	    			var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	    			var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	    			el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.cts_vehicle_feedback').append(el);
	        	});
	    	}
	    }
	    //发车异常反馈
	    var TripFeedBackList=data.TripFeedBackList;
	    if(TripFeedBackList==undefined) {
	    	$('.trip-info').remove();
	    } else {
	    	var feedBackList=_this.splitFeedBackList(TripFeedBackList.feedBackList);
	    	var driverManagerList=feedBackList.driverManagerList;
	        var sourceManagerList=feedBackList.sourceManagerList;
	        var vehicleManagerList=feedBackList.vehicleManagerList;
	        if(TripFeedBackList.actionTime) {
	        	var _date=moment(TripFeedBackList.actionTime).format("YYYY-MM-DD HH:mm");
	        	$('.trip_action_time').text(_date);
	        } else {
	        	if(driverManagerList.length==0&&sourceManagerList.length==0&&vehicleManagerList.length==0) {
		        	$('.trip-info').remove();
		        }
	        }
	        if(driverManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>司机异常</h4>\
	    				<div class="un_bg trip_driver_feedback">\
	    				</div>\
	    			</div>');
	    		$('.trip-info').append(_t);
	    		$.each(driverManagerList,function(i,j){
	        		var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	        		var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	        		el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.trip_driver_feedback').append(el);
	        	});
	    	}
	    	if(sourceManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>货主异常</h4>\
	    				<div class="un_bg trip_source_feedback">\
	    				</div>\
	    			</div>');
	    		$('.trip-info').append(_t);
	    		$.each(sourceManagerList,function(i,j){
	    			var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	    			var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	    			el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.trip_source_feedback').append(el);
	        	});
	    	}
	    	if(vehicleManagerList.length>0) {
	    		var _t=$('<div class="un_content">\
	    				<h4>车辆异常</h4>\
	    				<div class="un_bg trip_vehicle_feedback">\
	    				</div>\
	    			</div>');
	    		$('.trip-info').append(_t);
	    		$.each(vehicleManagerList,function(i,j){
	    			var el=$('<div class="un_div">\
							<span class="un_num"></span>\
							<span class="un_time"></span>\
							<span class="un_name"></span>\
							<span class="un_cost"></span>\
							<div class="un_reason">\
								<span class="un_rea_span"></span>\
								<ul class="pic">\
								</ul>\
							</div>\
						</div>');
	    			var _date=j.feedbackTime;
	        		if(_date){
	        			_date=moment(_date).format("YYYY-MM-DD HH:mm");
	        		}
	    			el.find('.un_num').text((i+1)+".");
	    			el.find('.un_time').text(_date);
	    			el.find('.un_name').text(j.itemName);
	    			el.find('.un_cost').text(j.itemPrice?j.itemPrice+' 元':'');
	    			el.find('.un_rea_span').text(j.itemDesc);
	    			var atta=j.atta;
	    			if(atta.length>0) {
	    				 $.each(atta,function(k,l){
	    					 var _p = $('<li class="images car-img" data-column="imageId"></li>');
	         				el.find('.pic').append(_p);
	     	        		var category = _p.data("column");
	     	        		var imageId = l.fileId;
	     	            	var image = new CBSImageInfo({
	     	            		view: _p,
	     	            		category: category,
	     	            		imageId: imageId
	     	                });
	    				 });
	    			}
	        		$('.trip_vehicle_feedback').append(el);
	        	});
	    	}
	    }
	}
	
	this.init(options);
};


CBSTripInfo.prototype.fillLoadContentFromJsonData = function (data) {
    if (!data) return;
    var _this = this;
    this.loadColumns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.text(pValue);
    });
    var driverInfo=data.driverInfo;
    var idno=$('span[data-column="_idno"]');
    var realName=$('span[data-column="_realName"]');
    var telphone=$('span[data-column="_telphone"]');
    $.each(driverInfo,function(i,j){
    	if(j.idno) {
    		$(idno[i]).text(j.idno);
    	}
    	if(j.realName) {
    		$(realName[i]).text(j.realName);
    	}
    	if(j.telphone) {
    		$(telphone[i]).text(j.telphone);
    	}
    });
    var isPredict=data.isPredict;
    if(isPredict=='01') {
    	$('span[data-column="isPredict"]').text('准确');
    } else if(isPredict=='02') {
    	$('span[data-column="isPredict"]').text('预估');
    }
};

CBSTripInfo.prototype.fillOrderContentFromJsonData = function (data) {
    if (!data) return;
    var _this = this;
    this.orderColumns.each(function (i, j) {
    	var _this = $(this);
    	var pName = _this.data("column");
    	var pValue = data[pName];
    	_this.text(pValue);
    });
    
/*    var getPcd = function(data){
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
	}*/
    
    //var startP=data.startCodePCn?data.startCodePCn:'';
    //var endP=data.endCodePCn?data.endCodePCn:'';
    //var start=startP+" "+startC;
    //var end=endP+" "+endC;
    //$('span[data-column="_start"]').text(start);
    //$('span[data-column="_end"]').text(end);
    //var receive=getPcd(data.receiveRegion);
    //var send=getPcd(data.sendRegion);
    //$('span[data-column="_receive"]').text(receive+" "+data.receiveAddress);
    //$('span[data-column="_send"]').text(send+" "+data.sendAddress)
    
    var startC=data.startCodeCCn?data.startCodeCCn:'';
    var endC=data.endCodeCCn?data.endCodeCCn:'';
    $('span[data-column="_line"]').text(startC+" - "+endC);
};
//异常反馈
//CBSTripInfo.prototype.saveLoadFeedBack=function(loadId,status,type,dialog) {
//	var _this=this;
//	var data = {};
//	var result={};
//	var obj=new Array();
//	$('.feed-column').each(function(i, j){
//        var _this = $(this);
//        var pName = _this.data("column");
//        var pValue = _this.val();
//        data[pName] = pValue;
//    });
//	data.loadId=loadId;
//	data.status=status;
//	data.type=type;
//	obj.push(data);
//	result.loadFeedbackList=obj;
//	var valid=_this.validFeedBack(data);
//	if(valid){
//		var dataStringify = JSON.stringify(result);
//	    $.ajax({
//	        url: global.server + '/admin/feedback/saveLoadFeedback',
//	        type: "POST",
//	        contentType: "application/json; charset=utf-8",
//	        data: dataStringify,
//	        dataType: "json",
//	        success: function (msg) {
//	            if (msg && msg.status && msg.status.statusCode == global.status.success) {
//	            	alert("提交成功");
//	            	dialog.destory();
//	            	window.location.reload();
//	            } else {
//	            	alert(msg.status.errorMsg);
//	            }
//	        }
//	    });
//	}
//}

//CBSTripInfo.prototype.validFeedBack=function(data) {
//	var valid=true;
//	if(!data.itemName) {
//		valid=false;
//		alert('异常名称不能为空');
//		return false;
//	}
//	if(data.itemPrice>=100000) {
//		valid=false;
//		alert('产生费用最多为5位整数2位小数');
//		return false;
//	}
//	if(!data.itemDesc){
//		valid=false;
//		alert('异常描述不能为空');
//		return false;
//	}
//	return valid;
//}
//车检
CBSTripInfo.prototype.vehicleCheck = function (loadId) {
	var url='/admin/trip/vehicleCheck';
	$.ajax({
        url: global.server + url,
        type: "post",
        data: {loadId:loadId},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	alert('已完成车辆检查');
            	window.location.reload();
            } else {
            	alert(msg.status.errorMsg);
            }
        }
    });
}
//靠台
CBSTripInfo.prototype.closeToSurface = function (loadId) {
	var url='/admin/trip/closeToSurface';
	$.ajax({
        url: global.server + url,
        type: "post",
        data: {loadId:loadId},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	alert('已靠台');
            	window.location.reload();
            } else {
            	alert(msg.status.errorMsg);
            }
        }
    });
}
//取消发车
CBSTripInfo.prototype.cancelTrip = function (loadId) {
	var url='/admin/trip/cancelTrip';
	$.ajax({
        url: global.server + url,
        type: "post",
        data: {loadId:loadId},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	alert('已取消发车');
            	window.close();
            	window.opener.location.reload();
            } else {
            	alert(msg.status.errorMsg);
            }
        }
    });
}
//取消发车
CBSTripInfo.prototype.cancelTripForYSJ = function (loadId) {
	var url='/admin/trip/cancelTripForYSJ';
	$.ajax({
        url: global.server + url,
        type: "post",
        data: {loadId:loadId},
        success: function (msg) {
            if (msg && msg.status && msg.status.statusCode == global.status.success) {
            	alert('已取消发车');
            	window.close();
            	window.opener.location.reload();
            } else {
            	alert(msg.status.errorMsg);
            }
        }
    });
}
//发车
CBSTripInfo.prototype.tripTheCar = function (loadId,dialog) {
	var _this=this;
	var url='/admin/trip/tripTheCar';
	var data = {};
	$('.trip-car').each(function(i,j){
		var _this = $(this);
		var pName = _this.data("column");
		var pValue = _this.val();
		data[pName] = pValue;
	});
	data.tripTime=$('.needStartTime').text();
	$.each(this.imageList,function(i, j){
		var result = j.postToServer('/admin/trip/tripUploadImage');
		if(result != null){
			var pName = result.column;
			var pValue = result.imageId;
			data[pName] = pValue;
		}
	});
	data.loadId=loadId;
	console.log(data)
	var valid=_this.validTripTheCar(data);
	if(valid) {
		$.ajax({
	        url: global.server + url,
	        type: "post",
	        data: data,
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
}

CBSTripInfo.prototype.validTripTheCar=function(data) {
	var valid=true;
	if(!data.goodsWeight) {
		valid=false;
		alert('重量不能为空');
		return false;
	}
	if(!data.goodsVolume) {
		valid=false;
		alert('体积不能为空');
		return false;
	}
	if(!data.customerBillNo) {
		valid=false;
		alert('客户单号不能为空');
		return false;
	}
	if(!data.contractImageRefId) {
		valid=false;
		alert('货主合同照片不能为空');
		return false;
	}
	return valid;
}

$(function(){
	
	var loadId = global.QueryString.loadId;
	var param = {
		loadId : loadId
	};
	var load=new CBSTripInfo(param);
	
});