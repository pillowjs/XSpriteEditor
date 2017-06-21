//aml config
;aml.config({
    path: (false ? 'http://rawgithub.com/xudafeng/XSpriteEditor/master/src/javascript/' : 'src/javascript/')
});
;define('init',['stage','preview','timer','status'],function(Stage,PreView,Timer,Status){
    var classQuery = arguments;
    function XSpriteEditor(){
        this.init();
    }
    XSpriteEditor.prototype = {
        init:function(){
            for(var i=0;i<classQuery.length;i++){
                new classQuery[i];
            }
        }
    };
    new XSpriteEditor();
});
