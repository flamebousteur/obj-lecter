import obj from './objlecter.js'

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var data =	"o cube\n"+
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

var objv;

var animate = false
var rotateangle = 0
let addy = 0
let b = 0
let addr = 0

function readvalue() {
	objv.canvas3d.camera.scale = document.querySelector('input#scale').value
	objv.canvas3d.camera.rotateangle[0] = parseInt(document.querySelector('input#xr').value)
	objv.canvas3d.camera.rotateangle[1] = parseInt(document.querySelector('input#yr').value)
	rotateangle = parseInt(document.querySelector('input#zr').value)
	objv.canvas3d.camera.x = parseInt(document.querySelector('input#x').value)
	addy = parseInt(document.querySelector('input#y').value)
	objv.canvas3d.camera.z = parseInt(document.querySelector('input#z').value)

	objv.showvertex = document.querySelector('input#showvertex').checked
	objv.showedjes = document.querySelector('input#showedge').checked
	objv.showfaces = document.querySelector('input#showface').checked
	objv.verticeswidth = parseInt(document.querySelector('input#verticeswidth').value) / 10

	animate = document.querySelector('input#animate').checked
}

async function show() {
	let be = [0, 0.1, 0.2, 0.3, 0.35, 0.4, 0.4, 0.35, 0.3 ,0.2, 0.1, 0, -0.1, -0.2, -0.3, -0.35, -0.4, -0.4, -0.35, -0.3, -0.2, -0.1]
	do {
		readvalue()
		if (animate) {
			addr += 5
			b>=be.length-1 ? b=0 : b++
		}
		objv.canvas3d.camera.rotateangle[2] = rotateangle + addr
		objv.canvas3d.camera.y = be[b] + addy
		objv.canvas3d.clear();
		objv.draw()
		await sleep(1000/24)
	} while (true)
}

function set(e){
	objv.setdata(e)
}

function reset(){
	document.querySelectorAll('input[type=range]').forEach(input => {
		input.value = 0;
	});
	document.querySelector('#scale').value = 50;
	document.querySelector('#verticeswidth').value = 1;
	document.querySelector('#animate').checked = false;
	document.querySelector('#showvertex').checked = true;
	document.querySelector('#showedge').checked = true;
	document.querySelector('#showface').checked = false;

	b = 0
	addr = 0
	rotateangle = 0
	addy = 0

	readvalue()
}

window.onload = function () {
	document.querySelector('#reset').onclick = reset
	objv = new obj(document.querySelector("canvas"))
	set(data, -1);
	show()
	let inp = document.querySelector('input[type=file]')
	if (inp.files.length > 0) {
		var reader = new FileReader();
		reader.onload = function(){
			set(reader.result)
		}
		reader.readAsText(inp.files[0]);
	}
	inp.addEventListener('change', function() {
		var reader = new FileReader();
		reader.onload = function(){
			set(reader.result)
		}
		reader.readAsText(this.files[0]);
	})
}
