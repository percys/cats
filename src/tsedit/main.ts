///<reference path='./typescript-hint.ts'/>
///<reference path='./codemirror.d.ts'/>

var tsh = new TypeScriptHint("./demo/");
var script = tsh.getScript(0);

var filename = script.name;

function getAutoComplete(level:number)  {
var l = level;    
return function autoComplete() {
        var cur = editor.getCursor();
        if (level === 0) {
            editor.replaceRange(".",cur);
            cur.ch++;
        }
        var src = editor.getValue();
        var coord:Coord = {
            line: cur.line + 1,
            col: cur.ch
        };

        var result = tsh.autoComplete(l,coord, filename, src); 
        return result;
    }
}

CodeMirror.commands.autocomplete_member = function (cm) {
    CodeMirror.simpleHint(cm, getAutoComplete(0));
};

CodeMirror.commands.autocomplete_type = function (cm) {
    CodeMirror.simpleHint(cm, getAutoComplete(1));
};


CodeMirror.commands.autocomplete = function (cm) {
    CodeMirror.simpleHint(cm, getAutoComplete(2));
};

var editor = CodeMirror(document.body, {
    lineNumbers: true,
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "." : "autocomplete_member",
        ":" : "autocomplete_type"
    },
    matchBrackets: true,
    mode: "text/typescript"
});

editor.setValue(script.content);

var root:Element = <any>document.getElementsByClassName("CodeMirror")[0];

var mytime;
root.addEventListener("mousemove", function (e:MouseEvent) {
    clearTimeout(mytime);
    mytime = setTimeout(() => {
        var coord = editor.coordsChar({left: e.pageX, top: e.pageY});
        // console.log(coord.line + ":" + coord.ch);
    }, 200);
});
