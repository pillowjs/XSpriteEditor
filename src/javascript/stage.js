;define('stage',['util','msg','loadImg'],function(_,Msg,LoadImg){
    var MAX_HEIGHT = 600;
    var PREVENT = 151;
    var msg = new Msg();
	function Rect(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
    function Stage(){
        this.playground = document.getElementById('playground');
        this.ctx = this.playground.getContext("2d");
        this.input = document.getElementById('input');
        this.help = document.getElementById('help');
        this.status = 0;
        this.init();
    };
    Stage.prototype = {
        init:function(){
            this.bind();
        },
        fillPlayGround:function(s){
            var that = this;
            that.readFile(s);
        },
        readFile:function(s){
            var that = this;
            var detector = window.File && window.FileReader && window.FileList && window.Blob;
            if (!detector) {
                alert('The File APIs are not fully supported in this browser.');
                return;
            }
            msg.send('fileRead',s);
            that.reader = new FileReader();
            that.reader.readAsDataURL(s);
	        that.reader.onload = function(e){
                that.fillImg(this.result);
	        }
        },
        fillImg:function(s){
            var that = this;
            if(s){
                that.image = new Image();
                that.image.src = s;
            }
            msg.send('loadImg',that.image);
            if(that.image.height > MAX_HEIGHT) {
                that.zoom = MAX_HEIGHT / that.image.height;
            }else{
                that.zoom = 1;
            }
            that.playground.style.zoom = that.zoom;
            that.ctx.clearRect(0, 0, that.ctx.width, that.ctx.height);
            that.playground.width = that.image.width;
            that.playground.height = that.image.height;
            that.ctx.drawImage(that.image, 0, 0, that.image.width, that.image.height);
            that.status = 1;
        },
        bind:function(){
            var that = this;
            that.playground.addEventListener('click', function(e) {
                if(that.status == 0){
                    return that.input.click();
                }
                var data = that.ctx.getImageData(e.offsetX/that.zoom,e.offsetY/that.zoom,1,1).data;
                if(that.isAlphaEmpty(data)||that.isPrevent(data)){
                    return;
                }
                that.detectRect(e.offsetX/that.zoom,e.offsetY/that.zoom);
            }, false);
            that.playground.addEventListener('mousemove', function(e) {
                if(that.status == 0){
                    return;
                }
                that.detectMouse(e.offsetX/that.zoom,e.offsetY/that.zoom);
            }, false);
            that.input.addEventListener('change', function(e) {
                that.fillPlayGround(e.target.files[0]);
            }, false);
            that.help.addEventListener('click', function(e) {
                that.initHelp();
            }, false);
        },
        detectMouse:function(x,y){
            var that = this;
            if(that.isAlphaEmpty(that.ctx.getImageData(x,y,1,1).data)){
                that.playground.style.cursor = 'default';
                that.playground.title = '此区域不可点';
                msg.send('moving',{
                    x:x,
                    y:y,
                    status:'unavailable'
                });
            }else if(that.isPrevent(that.ctx.getImageData(x,y,1,1).data)){
                that.playground.style.cursor = 'default';
                that.playground.title = '此区域已被选择过了';
                msg.send('moving',{
                    x:x,
                    y:y,
                    status:'selected'
                });
            }else{
                that.playground.style.cursor = 'pointer';
                that.playground.title = '请点击选中';
                msg.send('moving',{
                    x:x,
                    y:y,
                    status:'available'
                });
            }
        },
        isPrevent:function(data){
            return data[3] == PREVENT;
        },
        isAlphaEmpty:function(data){
            return /{\"0":0(,\"\d+\":0)+}/.test(JSON.stringify(data));
        },
        detectRect:function(x,y){
            var that = this;
            setTimeout(function(){
                var rect = that.calculate(x,y);
                that.drawRect(rect);
            },10);
        },
        calculate:function(x,y){
            var rect = new Rect(x,y,1,1);
            var that = this;
            var i = 0;
            var data;
            function detectLine(x,y,width,scrollx){
                if(scrollx){
                    data = that.ctx.getImageData(x,y,width,1).data;
                }else{
                    data = that.ctx.getImageData(x,y,1,width).data;
                }
                return !that.isAlphaEmpty(data);
            }
            function detectTop(){
                if(i==4){
                    return rect;
                }
                if(detectLine(rect.x,rect.y-1,rect.width,true)){
                    i =0;
                    rect.y --;
                    rect.height++;
                }else{
                    i++;
                }
                return detectRight();
            }
            function detectRight(){
                if(i==4){
                    return rect;
                }
                if(detectLine(rect.x+rect.width+1,rect.y,rect.height,false)){
                    i =0;
                    rect.width ++;
                }else{
                    i++;
                }
                return detectBottom();
            }
            function detectBottom(){
                if(i==4){
                    return rect;
                }
                if(detectLine(rect.x,rect.y+rect.height+1,rect.width,true)){
                    rect.height++;
                    i =0;
                }else{
                    i++;
                }
                return detectLeft();
            }
            function detectLeft(){
                if(i==4){
                    return rect;
                }
                if(detectLine(rect.x-1,rect.y,rect.height,false)){
                    rect.x--;
                    rect.width++;
                    i =0;
                }else{
                    i++;
                }
                return detectTop();
            }
            return detectTop();
        },
        drawRect:function(rect){
            var that = this;
            var offset = {
                x:0,
                y:0
            };
            msg.send('selected',{
                rect:rect,
                offset:offset,
                data:that.ctx.getImageData(rect.x,rect.y,rect.width,rect.height)
            });
            that.ctx.beginPath();
            that.ctx.rect(rect.x,rect.y,rect.width,rect.height);
            that.ctx.fillStyle="rgba(100,100,100,0.1)";
            that.ctx.fill();
            var back = that.ctx.createImageData(rect.width, rect.height);
            var arr = back.data;
            var data = that.ctx.getImageData(rect.x,rect.y,rect.width,rect.height).data;
            for(var i=0,len = data.length;i<len;i+=4){
                var red = data[i],
                    green = data[i+1],
                    blue = data[i+2],
                    alpha = data[i+3];
                arr[i] = red;
                arr[i+1] = green;
                arr[i+2] = blue;
                arr[i+3] = PREVENT;
            }
            that.ctx.putImageData(back,rect.x,rect.y);
            that.ctx.stroke();
        },
        initHelp:function(){
            var that = this;
            var src = 'docs/simple.png';
            if(that.status ==  1){
                return;
            }
            msg.send('updateName','正在加载演示图片…');
            new LoadImg(src).ready(function(d){
                msg.send('updateName',src);
                that.image = d[0];
                that.fillImg();
            });
        }
    };
    return Stage;
});
