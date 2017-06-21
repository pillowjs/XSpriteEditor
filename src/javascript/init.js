//aml config
;aml.config({
    path: (false ? '//pillowjs.github.io/XSpriteEditor/src/javascript/' : 'src/javascript/')
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
