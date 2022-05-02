# obj-lecter

display a obj file in canvas

read the documentation https://github.com/flamebousteur/obj-lecter/wiki/doc

example:
```js
var data = "o cube\n"+
"v 1 1 -1\n"+
"v 1 -1 -1\n"+
"v 1 1 1\n"+
"v 1 -1 1\n"+
"v -1 1 -1\n"+
"v -1 -1 -1\n"+
"v -1 1 1\n"+
"v -1 -1 1\n"+
"f 1 5 7 3\n"+
"f 4 3 7 8\n"+
"f 8 7 5 6\n"+
"f 6 2 4 8\n"+
"f 2 1 3 4\n"+
"f 6 5 1 2\n";
objv = new obj(document.querySelector("canvas"));
objv.build(data);
objv.draw();
```

see the demo at https://flamebousteur.github.io/demo/objlecter/
