	var CBSAccount = function(options){
		this.opt = $.extend({}, options);
		this.columns = $('.column');
		this.imageColumns = $('.car-img');
	    var _this = this;
	    
	    this.init = function (options) {
	    	$('#checkUnpass').hide();
			$('#checkPass').hide();
	    	var _this = this;
	        if (options && options.accountId) {
	            console.log('init account data with id: ' + options.accountId);
	            var url = "/admin/account/getUserDetail2?accountId=" + options.accountId;
	            var _this = this;
	            $.get(global.server + url, function (msg) {
	                if (msg && msg.status && msg.status.statusCode == global.status.success) {
	                    var data = msg.data;
	                    var status=data.userInfo.status;
	                    if(status=='01') {
	                    	$('#checkUnpass').show();
	    	    			$('#checkPass').show();
	                    }
	                    _this.fillUserContentFromJsonData(data.userInfo);
	                    _this.fillVehicleContentFromJsonData(data.userInfo.accountId,data.vehicleInfo);
	                }
	            }).done(function (msg) {
	            	var data = msg.data;
	            });
	        } 
	    }
		this.init(options);
		
	};

	CBSAccount.prototype.fillUserContentFromJsonData = function (data) {
	    if (!data) return;
	    this.data = data;
	    var _this = this;
	    this.columns.each(function (i, j) {
	    	var _this = $(this);
	    	var pName = _this.data("column");
	    	var pValue = data[pName];
	    	if(pName=='status') {
	    		if(pValue=='01') {
	    			pValue='待审核';
	    		} else if(pValue=='02') {
	    			pValue='审核未通过'
	    		} else if(pValue=='00') {
	    			pValue='审核通过';
	    		}
	    	}
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
	    }
	};
	
	CBSAccount.prototype.fillVehicleContentFromJsonData=function(accountId,data) {
		if(!data) return;
		this.data=data;
		var _this=this;
		if(data.length>0) {
			$('.info-content').show();
			$.each(data,function(i,j){
				var driverList=j.driverList;
				var type=j.type?' 车型：'+j.type:'';
				var length=j.length?' 车长：'+j.length+'米 ':'';
				var driverInfo='审核通过： '+type+length;
				if(driverList) {
					$.each(driverList,function(k,l){
						driverInfo+='司机 '+global.defaultIfBlack(l.realName,'')+' '+global.defaultIfBlack(l.telphone,'')+' 身份证号：'+global.defaultIfBlack(l.idno,'')+'; ';
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
				    		<p class="check_by to-info"></p>\
				    	</div>\
					</td>\
					</tr>')
				el.find('.car-num').html(global.defaultIfBlack(j.plateNumber,''));
				el.find('.car-list').html(driverInfo);
				el.find('.check_by').html(j.checkName?'审核人:'+j.checkName:'审核人:');
				el.find('.to-info').click(function(){
					_this.direct(accountId,j.vehicleInfoId);
				});
				$('.info-content>table>tbody').append(el);
			});
		}
	}
	
	CBSAccount.prototype.direct=function(accountId,vehicleInfoId) {
		var url = global.getContextPath() + '/VehicleAndDriverInfo.html?accountId='+accountId+'&vehicleInfoId='+vehicleInfoId;
		var body = document.getElementsByTagName("body")[0];
		var el = document.createElement("a");
		body.appendChild(el);
		el.href = url;
		el.target = '_blank';
		el.click();
		body.removeChild(el);
	}
	
	CBSAccount.prototype.checkUnpass=function(data) {
		$.ajax({
	        type: "post",
	        url: global.server + '/admin/account/checkUnpass',
	        data: data,
	        async: true,
	        success: function(msg) {
	        	if (msg && msg.status && msg.status.statusCode == global.status.success) {
	        		alert('操作成功！');
	        		window.close();
	        		window.opener.location.reload();
	        		//window.location.reload();
	        	} else if(msg.status.statusCode != global.status.success){
	            	return false;
	            }
	        }
	    });
	}
	
	CBSAccount.prototype.checkPass=function(data) {
		$.ajax({
	        type: "post",
	        url: global.server + '/admin/account/checkPass',
	        data: data,
	        async: true,
	        success: function(msg) {
	        	if (msg && msg.status && msg.status.statusCode == global.status.success) {
	        		alert('操作成功！');
	        		window.close();
	        		window.opener.location.reload();
	        		//window.location.reload();
	        	} else if(msg.status.statusCode != global.status.success){
	            	return false;
	            }
	        }
	    });
	}