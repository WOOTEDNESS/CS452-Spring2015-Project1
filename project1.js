var gl;
var points;
var modelViewMatrix =  mat4();
var proj = mat4();
var program;
var xPos = 0.7;
var yPos = 0.7;
var numPoints = 4;
var wallPoints = 4;

var bufferId;
var vPosition;
var vColor;
var colorBufferId;

var BufferWall_1;
var BufferWall_4;
var greenBufferId;
var blackBufferId


var colors;

window.onload = function init()
{
	var canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	points = new Float32Array([-.05,  .05, 
							   -.05, -.05,
							    .05,  .05, 
							    .05, -.05
							  ]);

	wall_1 = new Float32Array([-.01, -.7, //green
							   -.01, -1,
							    .01,  -.7, 
							    .01, -1]);

	wall_2 = new Float32Array([-.01, .4, 
							   -.01, 0,
							    .01, .4, 
							    .01, 0]);

	green = new Float32Array ([0.0,1.0,0.0,1.0,
							   	   0.0,1.0,0.0,1.0,
							       0.0,1.0,0.0,1.0,
							       0.0,1.0,0.0,1.0,
							  	  ]);

	blck = new Float32Array ([0.0,0.0,0.0,1.0,
							   	   0.0,0.0,0.0,1.0,
							       0.0,0.0,0.0,1.0,
							       0.0,0.0,0.0,1.0,
							  	  ]);

	colors = new Float32Array([0.0,0.0,1.0,1.0,
							   1.0,0.0,1.0,1.0,
							   1.0,0.0,1.0,1.0,
							   0.0,0.0,1.0,1.0,
							  ]);
	//
	// Configure WebGL
	//
	gl.viewport(0, 0, canvas.width, canvas.height );
	gl.clearColor(0.5, 0.5, 0.5, 1.0 );

	// Load shaders and initialize attribute buffers
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram(program);

	// Load the data into the GPU
	bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
	gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW ); 

	//wall buffers
	BufferWall_1 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, BufferWall_1);
	gl.bufferData( gl.ARRAY_BUFFER, wall_1, gl.STATIC_DRAW ); 

	BufferWall_2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, BufferWall_2);
	gl.bufferData( gl.ARRAY_BUFFER, wall_2, gl.STATIC_DRAW ); 

	//make a buffer for the colors
	colorBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

	greenBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, greenBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, green, gl.STATIC_DRAW);

	blackBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, blackBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, blck, gl.STATIC_DRAW);
	
	// Associate our shader variables with our data buffer
	vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	//Associcate color from html 
	vColor = gl.getAttribLocation(program, "aVColor");
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);

	proj = ortho(-1, 1, -1, 1, -100, 100);


	document.onkeydown = function(event) { HandleKeys(event);};


	render();
	
};

function setMatrixUniforms ()
{
	gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(gl.getUniformLocation(program, "projMatrix"),false,flatten(proj));
}


function render() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	collisonTest();
	//draw movable object
	modelViewMatrix = mat4();
	modelViewMatrix = translate(xPos,yPos,0);
	setMatrixUniforms();
	//sets vertex info ont he fly.
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	//sets color info ont he fly.
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPoints);

	//draws the two obstacles the same way.
	//green wall
	modelViewMatrix = mat4();
	setMatrixUniforms();
	gl.bindBuffer( gl.ARRAY_BUFFER, BufferWall_1);
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer(gl.ARRAY_BUFFER, greenBufferId);
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, wallPoints);

	//black wall
	modelViewMatrix = mat4();
	setMatrixUniforms();
	gl.bindBuffer( gl.ARRAY_BUFFER, BufferWall_2);
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer(gl.ARRAY_BUFFER, blackBufferId);
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, wallPoints);

	requestAnimFrame(render);
}



function collisonTest()
{
	
	if(-.01 < .1 && .02 > (xPos+.1) && .3 < 1 &&  .3 > (yPos +.3) )
	{
		alert("YOU HAVE WON!	Refresh to restart.")
	}
	else
	{
		//no collision keep playing 
	}
	

}





function HandleKeys(event)
{
	if (event.keyCode == 119 || event.keyCode == 87 )//w keys is pressed move up
	{
		yPos += .03
		console.log("w key pressed")
		//points += translate(0,.1,0)
	}
	else if (event.keyCode == 97 ||  event.keyCode == 65 )//a key is pressed move left
	{
		xPos -= .03
		console.log("a key pressed")
		//points -= translate(.1,0,0)
	}
	else if (event.keyCode == 115 || event.keyCode == 83 )//s key is pressed move down
	{
		yPos -= .03
		console.log("s key pressed")
		//points -= translate(0,.1,0)
	}
	else if (event.keyCode == 100 || event.keyCode == 68)//d key is pressed move right
	{
		xPos += .03
		console.log("d key pressed")
		//points += translate(.1,0,0)
	}
	else if (event.keyCode == 113 || event.keyCode == 81)
	{
		xPos = 0.7;
		yPos = 0.7;
		console.log("q key pressed")
	}
}

































