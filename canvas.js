// simple canvas functions
var canvas = function(element, lwidth = 1, pwidth = 3, color = "#000", scale = 200, fcolor = "#000"){
	this.canvas = element
//	this.canvas.width = 1080
//	this.canvas.height = 1080
	this.lwidth = lwidth
	this.pwidth = pwidth
	this.color = color
	this.scale = scale
	this.fcolor = fcolor
}

canvas.prototype.setparm = function(parms){
	for (const key in parms) {
		this[key] = parms[key];
	}
}

// set a point on the canvas: position of the point get 2 values [ x, y ].
// with the defalt parameter of scale to be shown on the canvas the point must be between -200 and 200 for x ( y is the same if the height of the canvas is the same of the width )
canvas.prototype.setpoint = function (point, r = null){
	if (r == null) r = this.pwidth
	let x = point[0]
	let y = point[1]
	let canvas = this.canvas
	r < 0 ? r = 0 : r = r
	if(canvas.getContext){
		let ctx = canvas.getContext('2d');
		x = (x+100) * canvas.width / this.scale
		y = (this.scale-y-100) * canvas.width / this.scale
		ctx.beginPath()
		ctx.arc(x,y, r, 0, 2 * Math.PI)
		ctx.fillStyle = this.color
		ctx.fill()
		return true
	} else {
		return false
	}
}

// set line between two points
// the point have the same format of the setpoint() function
canvas.prototype.setline = function (a,b){
	let canvas = this.canvas
	if(canvas.getContext){
		let ctx = canvas.getContext('2d');
		let x1 = (a[0]+100) * canvas.width / this.scale
		let y1 = (this.scale-a[1]-100) * canvas.width / this.scale
		let x2 = (b[0]+100) * canvas.width / this.scale
		let y2 = (this.scale-b[1]-100) * canvas.width / this.scale
		ctx.beginPath()
		ctx.lineWidth = this.lwidth
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.strokeStyle = this.color
		ctx.stroke()
		return true
	} else {
		return false
	}
}

// set the face of the object
// the point have the same format of the setpoint() function
canvas.prototype.setlines = function(points, fill = false){
	let canvas = this.canvas
	if(canvas.getContext){
		let x1 = (points[0][0]+100) * canvas.width / this.scale
		let y1 = (this.scale-points[0][1]-100) * canvas.width / this.scale
		let ctx = canvas.getContext('2d');
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		for (let i = 1; i < points.length; i++) {
			let x2 = (points[i][0]+100) * canvas.width / this.scale
			let y2 = (this.scale-points[i][1]-100) * canvas.width / this.scale
			ctx.lineTo(x2, y2)
		}
		ctx.closePath();
		ctx.lineWidth = this.lwidth
		ctx.strokeStyle = this.color
		ctx.stroke()
		if (fill) {
			ctx.fillStyle = this.fcolor
			ctx.fill()
		}
		return true
	} else {
		return false
	}
}

// clear the canvas
canvas.prototype.clear = function(){
	let canvas = this.canvas
	if(canvas.getContext){
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	} else {
		return false
	}
}


// library for the perspective projection
var camera = function (d = 1000, x = 0, y = 0, z = 0, scale = 1){
	this.x = x
	this.y = y
	this.z = z
	this.d = d
	this.scale = scale
	this.rotateangle = [ 0, 0, 0 ]
	this.rotationpoint = [ 0, 0, 0 ]
}

camera.prototype.setparm = function(parms){
	for (const key in parms) {
		this[key] = parms[key];
	}
}

// rotate the point around the rotationpoint
// for x and y: point have the same format of the setpoint() function
// z has no limit
camera.prototype.rotate3d = function(point, angle = null, rotationpoint = null){
	if (!point) return false
	if (angle == null) angle = this.rotateangle
	if (rotationpoint == null) rotationpoint = this.rotationpoint
	// degree to radianes
	let anglex = angle[0] * Math.PI / 180
	let angley = angle[1] * Math.PI / 180
	let anglez = angle[2] * Math.PI / 180
	// cange the rotation of the point around the rotationpoint
	let x = point[0] - rotationpoint[0]
	let y = point[1] - rotationpoint[1]
	let z = point[2] - rotationpoint[2]
	// rotate the point
	let x1 = x * Math.cos(anglex) + y * Math.sin(anglex)
	let y1 = -x * Math.sin(anglex) + y * Math.cos(anglex)
	let y2 = y1 * Math.cos(angley) - z * Math.sin(angley)
	let z2 = y1 * Math.sin(angley) + z * Math.cos(angley)
	let x3 = x1 * Math.cos(anglez) - z2 * Math.sin(anglez)
	let z3 = x1 * Math.sin(anglez) + z2 * Math.cos(anglez)
	// change the point back
	let x4 = x3 + rotationpoint[0]
	let y4 = y2 + rotationpoint[1]
	let z4 = z3 + rotationpoint[2]
	// return the point
	return [ x4, y4, z4 ]
}

// return 2d point from 3d point
// d is the distance from the camera
camera.prototype.point3d = function(point, d = null){
	if (d == null) d = this.d
	let xb = ( point[0] + this.x ) * d / ( point[2] + this.z + d ) * this.scale
	let yb = ( point[1] + this.y ) * d / ( point[2] + this.z + d ) * this.scale
	return [xb,yb]
}

// get the point with all the modification
camera.prototype.getpoint = function(point){
	return this.point3d(this.rotate3d(point))
}


// objects gestion based on the .obj file
var object = function(name){
	this.name = name
	this.vertices = []
	this.faces = []
}

object.prototype.createpoint = function(x = 0, y = 0, z = null){
	if (z == null) this.vertices.push([x,y])
	else this.vertices.push([x,y,z])
}

object.prototype.getpoint = function(i){
	return this.vertices[i]
}

object.prototype.createface = function(points){
	if (point.length < 2) return false
	this.faces.push(points)
}

object.prototype.getface = function(i){
	return this.faces[i]
}

object.prototype.getfacepoints = function(index){
	let result = []
	for (let i = 0; i < this.faces[index].length; i++) {
		result.push(this.vertices[this.faces[index]])
	}
	return result
}


// canvas3D
// convert the 3d point into a 2d point and draw it with the canvas librarys
var canvas3D = function(element, d = 1000, x = 0, y = 0, z = 0, s = 1){
	this.element = element
	this.canvas = new canvas(element)
	this.camera = new camera(d, x, y, z, s)
}

canvas3D.prototype.setparm = function(parms){
	for (const key in parms) {
		this.canvas[key] = parms[key]
	}
}

// clear the canvas
canvas3D.prototype.clear = function(){
	this.canvas.clear()
}

canvas3D.prototype.setpoint = function(point, r = null){
	// the radius of the point changes with the perspective
	if (!point) return false
	if (point.length === 3){
		let ddd = this.camera.rotate3d(point)
		if (r != null) r = ( r ) * this.camera.d / ( ddd[2] + this.camera.z +this.camera. d )
		point = this.camera.point3d(ddd)
	}
	this.canvas.setpoint(point, r)
}

canvas3D.prototype.setline = function(a,b){
	if (a.length === 3) a = this.camera.getpoint(a)
	if (b.length === 3) b = this.camera.getpoint(b)
	this.canvas.setline(a,b)
}

canvas3D.prototype.setlines = function(points, fill = false){
	for (const key in points) {
		points[key] = this.camera.getpoint(points[key])
	}
	this.canvas.setlines(points, fill)
}

export {canvas, camera, canvas3D, object}
