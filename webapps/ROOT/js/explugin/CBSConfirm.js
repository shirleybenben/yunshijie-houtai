var CBSConfirm = function(options){
	this.opt = $.extend({yes:'是',no:'否'}, options);
	
	this.el = $('<div class="mo_del"> \
			<div class="model_content_cansel"> \
			<p></p> \
			<a href="javascript:void(0);" class="mo_con_yes">是</a> \
			<a href="javascript:void(0);" class="mo_con_no">否</a> \
			<i class="clo_se"></i> \
		</div> \
	</div>');
	
	
	this.init = function(options){
		var _this = this;
		_this.el.find('p').text(_this.opt.text)
		$('body').append(_this.el);
		_this.el.find('.clo_se').click(function(){
			_this.destory();
		});
		_this.el.find('.mo_con_no').text(_this.opt.no).click(function(){
			_this.destory();
		});
		_this.el.find('.mo_con_yes').text(_this.opt.yes).click(function(){
			_this.opt.callback.call(_this, _this.opt.data);
			_this.destory();
		});
		_this.show();
	};
	
	this.show = function(){
		var _this = this;
		_this.el.find('.model_content_cansel').show();
		_this.el.show();
	}
	
	this.destory = function(){
		var _this = this;
		_this.el.remove();
	}
	
	this.init(options);
}