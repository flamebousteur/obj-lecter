/*
import the canvas library
https://github.com/flamebousteur/canvas3d
*/
import { canvas3D } from './canvas.js'

class obj {
	constructor(canvas, data = null, d = 10, x = 0, y = 0, z = 0, s = 50) {
		this.canvas = canvas
		this.canvas3d = new canvas3D(this.canvas, d, x, y, z, s);
		if (data != null) {
			this.data = data
			this.build();
		} else {
			this.data = ""
		}
		this.showvertex = true
		this.showedjes = true
		this.showfaces = false
		this.verticeswidth = 1
	}
	
	build(data = null) {
		if (data == null) data = this.data;
		this.max = [Infinity,Infinity,Infinity]
		this.min = [-Infinity,-Infinity,-Infinity]
		this.object = [];
		this.vertices = []
		let lines = data.split("\n");
		for (let i = 0; i < lines.length; i++) {
			if (lines[i] == undefined) {
				continue;
			}
			if (lines[i].startsWith("#")) {
				// comment
				continue;
			}
			if (lines[i].startsWith("o ")) {
				// object name (o Name)
				this.object.push({ name: lines[i].slice(2), vertices: [], faces: [] });
			}
			if (lines[i].startsWith("v ")) {
				// vertex (v X Y Z)
				let vertices = lines[i].slice(2).split(" ");
				for (let j = 0; j < vertices.length; j++) {
					if (this.max[j] > vertices[j]) {
						this.max[j] = vertices[j];
					}
					if (this.min[j] < vertices[j]) {
						this.min[j] = vertices[j];
					}
					vertices[j] = parseFloat(vertices[j]);
				}
				this.vertices.push(vertices);
			}
			if (lines[i].startsWith("f ")) {
				// face (f A//B//C)
				let face = lines[i].slice(2).split(" ");
				let r = [];
				for (let j = 0; j < face.length; j++) {
					face[j] = face[j].split("/");
					r.push(parseInt(face[j][0]) - 1);
				} 
				this.object[this.object.length - 1].faces.push(r)
			}
		}
		return this.object;
	}

	clear() {
		this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	setdata(data) {
//		this.data = data;
		this.build(data);
	}

	draw() {
		for (let i = 0; i < this.object.length; i++) {
			let faces = this.object[i].faces;
			let vertices = this.vertices;
			for (let j = 0; j < faces.length; j++) {
				let alllines = []
				for (let index = 0; index < faces[j].length; index++) {
					let p1 = vertices[faces[j][index]];
					let p2;
					if (vertices[faces[j][index+1]])
						p2 = vertices[faces[j][index+1]];
					else
						p2 = vertices[faces[j][0]];
					if (this.showvertex == true) this.canvas3d.setpoint(p1,this.verticeswidth);
					alllines.push(p1)
				}
				if (this.showedjes == true) this.canvas3d.setlines(alllines, this.showfaces)
				if (this.showfaces == true) this.canvas3d.setlines(alllines, true)
			}
		}
	}
}

export default obj
