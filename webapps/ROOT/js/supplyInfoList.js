$(function(){
//    $('.search-content').bind('click', function(e){
//        return false;
//    });
	var onBodyDown = function(event){
    	if(($(event.target).parents(".search-content").length>0)){
    		
    	} else {
    		advSearch.hide();
    	}
    };
    
    var advSearch = {
        show : function() {
            $('.search-content').show(10, function(){
//                $('body').one('click', function(){
//                    advSearch.hide();
//                });
            	$("body").bind("mousedown", onBodyDown);
            });
        },
        hide : function() {
        	$("body").unbind("mousedown", onBodyDown);
            $('.search-content').hide();
//            $('body').unbind();
        }
    }   
	
    $('select').each(function(i, j){
		var minWidth = $(j).data('width');
		$(j).multiselect({
			minWidth : minWidth,
			header : false,
			multiple : false,
			selectedList : 1,
			appendTo : '.search-content',
			position:{
				my: 'left top',
			    at: 'left bottom'
			},
			noneSelectedText: '请选择',
		})
	});
    
    //修改
	var editSupply = function(supplyId){
		var url = global.getContextPath() + '/addSupplier.html?supplyId='+supplyId;
    	var body = document.getElementsByTagName("body")[0];
    	var el = document.createElement("a");
    	body.appendChild(el);
    	el.href = url;
    	el.target = '_blank';
    	el.click();
    	body.removeChild(el);
    }
	
    var table = new CBSTable({
        page : $('.handle-page'),
        content : $('.handle-content > table > tbody'),
        url : '/admin/supply/pageSupplyList',
        method  : 'GET',
        pageNumber : 0,
        pageSize : 10,
        rowRender : function(index, row){
            /*var el = $('<tr> \
            <td class="f-width" width="">\
            <input type="checkbox" class="cancel check_box" val="" status="" loadId=""/>\
            <a href="javascript:void(0);" class="edit"></a>\
            <b class="index"></b>\
            </td> \
            <td  class="fullName to-info"></td> \
            <td  class="mobile to-info"></td> \
            <td  class="type to-info"></td> \
            <td class="paymentType to-info"></td> \
            <td class="cardName to-info"></td>\
            <td class="depositBank to-info"></td> \
            <td  class="cardNo to-info"></td> \
            </tr>');*/
        	var el=$('<tr>\
						<td class="f-width" width="60">\
			            	<input type="checkbox" class="cancel check_box" val="" status="" loadId=""/>\
			            	<a href="javascript:void(0);" class="edit"></a>\
		            	</td>\
		            	<td width="220" class="supply-num to-info"></td>\
		            	<td width="670" class="supply-list to-info"></td>\
				</tr>');
            /*var $index=index+1;
            el.find(".fullName").html(row.fullName);
            el.find(".index").html($index);
            el.find(".mobile").html(row.mobile);
            el.find(".type").html(type);
            el.find(".paymentType").html(row.paymentType);
            el.find(".cardName").html(row.cardName);
            el.find(".depositBank").html(row.depositBank);
            el.find(".cardNo").html(row.cardNo);*/
        	var type='';
            if(row.type=="01") {
            	type="个人";
            } else if(row.type=="02") {
            	type="公司";
            }
            var cardName=global.defaultIfBlack(row.cardName,'');
            cardName=cardName?" 开户名："+cardName:'';
            var bankName=global.defaultIfBlack(row.bankName,'');
            bankName=bankName?bankName:'';
            var cardNo=global.defaultIfBlack(row.cardNo,'');
            cardNo=cardNo?": 银行账号："+cardNo:'';
        	el.find('.supply-num').html(global.defaultIfBlack(row.contactName,'')+" "+global.defaultIfBlack(row.mobile,''));
        	el.find('.supply-list').html(type+": 结算类型："+global.defaultIfBlack(row.paymentType,'')+cardName+" "+bankName+cardNo);
            el.find(".edit").click(function(){
            	editSupply(row.supplyId);
            });
            el.find(".to-info").click(function(){
                openSupply(row.supplyId);
            });
            el.find('.f-width > .check_box').data(row).val(row.supplyId);
			el.find('.f-width > .check_box').click(function(){
				var flag=$(this).attr('checked');
				if(flag===undefined) {
					$(this).attr('checked','checked');
					$("tr:eq("+index+")").css('background-color','#FBEDC1');
				} else {
					$(this).removeAttr('checked');
					$("tr:eq("+index+")").removeAttr("style");
				}
			});
            return el;
        },
        onBeforeLoad : function(param){
            return param.queryType != null;;
        }
    });
    //详情
    var openSupply = function(supplyId){
        var url = global.getContextPath() + '/checkSupplier.html?supplyId='+supplyId;
        var body = document.getElementsByTagName("body")[0];
        var el = document.createElement("a");
        body.appendChild(el);
        el.href = url;
        el.target = '_blank';
        el.click();
        body.removeChild(el);
    }
    //取消
    /*var delSupply = function(){
    	var supplyIds = [];
    	$('.f-width > .cancel:checked').each(function () {
            var supplyId = $(this).attr("supplyId");
            supplyIds.push(supplyId);
        });
    	var supplyId = supplyIds.join(",");
    	$.ajax({
            url: global.server + '/admin/supply/removeSupplyBatch',
            type: "POST",
            data: {supplyIds: supplyId},
            success: function (msg) {
                if (msg && msg.status && msg.status.statusCode == global.status.success) {
                	alert("供应商信息已删除");
                    table.load({
                        queryType: 0
                    });
                } else {
                	alert("有供应商不允许删除");
                }
            }
        });
    	
    }*/
    
    $('.handle-data>.handle-delete').click(function() {
        var selected = $('.f-width > .cancel:checked');
        console.log(selected.length)
        /*if (selected.length > 0) {
        	var options = {
    			data : {},
    			text : '是否需要删除供应商信息',
    			callback:function(data){
    				delSupply();
    			}
    		}
    		new CBSConfirm(options);
        } else {
            alert("请选择要删除的供应商信息");
        }*/
        if(selected.length>0) {
			if(confirm('确认删除？')){
				$('.f-width > .cancel:checked').each(function() {  
			    	var supplyId=$(this).val();
			    	$.ajax({
				        url: global.server + '/admin/supply/removeSupply',
				        type: "POST",
				        data: {supplyId:supplyId},
				        success: function (msg) {
				            if (msg && msg.status && msg.status.statusCode == global.status.success) {
				            	table.reload();
				            }
				        }
				    });
			    });
			}
		} else {
			alert("请选择要删除的供应商信息");
		}
    });
    
    //搜索/高级搜索
    $('#btn_search').click(function(){
        table.load({
            queryType:0,
            keyWord:$('.list-search').val()
        });
    });
    $('.advance-sea').click(function(event) {
        advSearch.show();
    });

    $('.sea-close').click(function(event) {
        advSearch.hide();
    });
    $('#btn_adv_search').click(function(){
        var columns=$('.column');
        var data = {};
        columns.each(function(i, j){
            var _this = $(this);
            var pName = _this.data("column");
            var pValue = _this.val();
            data[pName] = pValue;
        });
        data.queryType=1;
        table.load(data);
        advSearch.hide();
    });
    
    table.load({
        queryType:0
    });

});