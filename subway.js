
//subway.js
// Author: Cameron Davidson-Pilon
// Date: July, 2012
// License: MIT


// Dependencies: 
//  Paper.js (http://paperjs.org/)





// These change the subway node design. Try manipulating them to see what they do.
// Note: all measurments are in pixels.

var NODE_SIZE = 16; //radius of the nodes
var INNER_NODE_SIZE = 7; //radius of the inner circle in the stations
var CUR_NODE_SIZE = 9; // radious of the inner cicle, if is is currently selected.
var LINE_WIDTH = 23; //width of the inter-station lines.

// fonts
var FONT_SIZE = 16;
var TEXT_FONT = 'Arial';
var FONT_COLOR = 'black';

var CHARACTER_STYLE = {
		fillColor: FONT_COLOR,
		fontSize: FONT_SIZE,
        font: TEXT_FONT,
		};
        
var nodes = []; // after initilization, this variable will contain all stations. Needed for clicking stations with mouse. 
var shiftDown = 0; //This is used in controlling the location with the keys. It is a boolean representing whether the 
                   // shift key is currently pressed down. 

function Line( color, name ){
    // the Line object creates a subway line. 
    //   color: must be a paper.js RgbColor or a keyword color, eg: 'black', 'green'.
    //   name: the unique name of the line. 

    this['color'] = color;
    this['path'] = new Path();
    this['path'].strokeWidth = LINE_WIDTH;
    this['path'].strokeColor = this['color'];
    this['name'] = name;
	
}
	
	
		
function SingleNode( line, position, neighbours, name, url, name_offset, name_angle){
    // the Node object is a non transitionay subway stop
    //      line: the line the node lies on.
    //      position: the coordinates on the canvas as Point class object.
    //      neighbours: the neighbours of the node.  It 
    //          must be the syntax {'E':Neighbour1, 'W':Neighbour2, etc.}. Note: this way we can also do things like:
    //          {'W': Neighbour1, 'S': Neighbour1, 'E': Neighbour2}. Note all the directions need to be defined.
    //      name: the station name to be displayed.
    //      url: the url to go to if the SpaceBar is pressed. Leave as '' if not wanted.
    //      name_offset: the amount to move the display named away from the center of the station. It must be a paper.js Point
    //                   object. ie. new Point( 10, 10) will position the top left corner of the text 10 pixels right and 
    //                  10 pixels below the center of the station.
    //      name_angle: the angle the name to be at. Enter it in counterclockwise radians.
    
    this['line'] = line;
    this['position'] = position;
	this['name'] = name;
	this['url'] = url;
    this['name_angle'] = name_angle;
    this['neighbours'] = neighbours;
	nodes.push(this)
    
    //Methods
    this.onkeydownNode = onkeydownNode; //this controls the movement if keys are pressed.
    this.fillNode = function(){
            //this method fires when the user enters the node.
            this.ic.fillColor = 'black';
    }; 
    this.emptyNode = function(){
            //this method fires when the user enters the node.
            this.ic.fillColor = 'white';
    };

    
    // generate the visual shapes.
    var c = new Path.Circle( this['position'], NODE_SIZE);
    c.fillColor = this['line']['color'];
    var ic = new Path.Circle( this['position'], INNER_NODE_SIZE+2);
    ic.fillColor = 'black';
    
    this.ic = new Path.Circle( this['position'], INNER_NODE_SIZE);
    this.ic.fillColor = 'white';
	
	this['text'] = new PointText( this['position'] + name_offset );
	this['text'].content = this['name'];
    this['text'].characterStyle = CHARACTER_STYLE;
    this['text'].rotate( -this['name_angle'], this['position'] );

	
    // add it to the line.
    this['line']['path'].add( this['position'] );
    
    }
    
function TransitionNode( line, line2, angle, position, neighbours, name, url,name_offset, name_angle){
    // the Node object is a non transitionay subway stop
    //      line: the primary line the node lies on.
    //      line2: the secondary line the node lies on.
    //      angle: the angle of the above and underneath node. Equal to the angle of the two lines.
    //      position: the coordinates on the canvas as Point class object.
    //      neighbours: the neighbours of the node.  It 
    //          must be the syntax {'E':Neighbour1, 'W':Neighbour2, etc.}. Note: this way we can also do things like:
    //          {'W': Neighbour1, 'S': Neighbour1, 'E': Neighbour2}. Note all the directions need to be defined.
    //      name: the station name to be displayed.
    //      url: the url to go to if the SpaceBar is pressed. Leave as '' if not wanted.
    //      name_offset: the amount to move the display named away from the center of the station. It must be a paper.js Point
    //                   object. ie. new Point( 10, 10) will position the top left corner of the text 10 pixels right and 
    //                  10 pixels below the center of the station.
    //      name_angle: the angle the name to be at. Enter it in counterclockwise radians.

    
	var STROKE_WIDTH = 2; //this two control the offset and appearance of the 'underneath node'
	var CIRCLE_DIST = 16;
	
	
	//This Node is the class for line transition stations.
	this['line'] = line;
	this['line2'] = line2;
	this['position'] = position; //This is the position of either of the circles. The angle determines the position of the other one.
	this['neighbours'] = neighbours;
	this['angle'] = angle; //This is the angle between the two circles.
	this['positionAlt'] = this['position'] + new Point( CIRCLE_DIST*Math.cos( angle), CIRCLE_DIST*Math.sin( angle)  );
	this['name'] = name;
	this['url'] = url;
	nodes.push(this);
	
	//Methods;
	this.onkeydownNode = onkeydownNode;
	this.emptyNode = function(){
			this.innerc.fillColor = this['path']['color'];
	}
	this.fillNode = function(){
			this.innerc.fillColor = 'black';
	} 
	
    // Title to display.
	this['text'] = new PointText( this['position'] + name_offset );
	this['text'].content = this['name'];
    this['text'].characterStyle = CHARACTER_STYLE;
    this['text'].rotate( -name_angle, this.position);
	
	//generate visual shapes
	var c2 = new Path.Circle( this.positionAlt , NODE_SIZE);
	c2.strokeWidth = STROKE_WIDTH;
	c2.strokeColor = 'black';
	c2.fillColor = 'white';
	var c2 = new Path.Circle( this.positionAlt, CUR_NODE_SIZE+1);
	c2.fillColor = this.line2.color;
	
	var c1 = new Path.Circle( this.position, NODE_SIZE);
	c1.strokeWidth = STROKE_WIDTH;
	c1.fillColor = 'white';
	c1.strokeColor = 'black';
	this.innerc = new Path.Circle( this.position, CUR_NODE_SIZE);
	this.innerc.fillColor = this.line.color;
	

	//add it the the lines.
	this['line'].path.add( this['position']);
	this['line2'].path.add(this['positionAlt']);
	
	
	}
    
function LegendItem( start, end, subwayLine ){
    
     this['line'] = new Line(subwayLine['color'], subwayLine['name']);
     this['line']['path'].add( start, end)
     var title = new PointText( end + new Point( 7,5) );
     title.content = subwayLine.name;
     title.characterStyle = {
		fillColor: 'black',
		fontSize: 14,
        font: TEXT_FONT
		}; 
        
}
   
 
function onKeyDown(event){
    var key = event.key;
    if ((key=="up" && shiftDown) || (key=="w" ) ){
        current_position.onkeydownNode('N');}
    else if ((key=="left" && shiftDown) || (key=="a" ) ){
        current_position.onkeydownNode('W');}
    else if ((key=="right" && shiftDown) || (key=="d" ) ){
        current_position.onkeydownNode('E');}
    else if ((key=="down" && shiftDown) || (key=="s" ) ){
        current_position.onkeydownNode('S');}
    //else if (key in oc(['enter', 'space']) ){
	//	window.location.href=current_position.url;}
    else if (key=="shift"){
        shiftDown=1;}
}

function onKeyUp(event){
    if (event.key == "shift"){
        shiftDown=0;
        }
}

 
function onkeydownNode( keydown, node ){
    for ( key in this['neighbours'] ){
        if (key == keydown){
            current_position.emptyNode();
            current_position = this['neighbours'][key];
            current_position.fillNode();
            }
    }
    return;
}




	   
function DashLine( color, point1, point2){
    // This creates a dashed subway line to represent either construction or leaving the webpage.
    //    color: the color of the dashed line.
    //    point1, point2: the beginning and end of the dashed line, as paper.js Point objects. 
	this.color = color;
	this.path = new Path();
	this.path.style = { 
		strokeWidth: LINE_WIDTH,
		strokeColor: this.color,
		};
	this.path.dashArray = [7,4];
	
	this.path.add(point1, point2);
	}





function onMouseDown(event){
    // This function fires whenever the mouse is pressed down. It iteratres through the stations and stops if it finds the 
    // cursor is over a station.
	var N = nodes.length;
    var point = event.point;
	for( var i=0; i<N; i++){
		var node_position = nodes[i].position;
		if (Path.Circle( node_position, NODE_SIZE ).bounds.contains(point) ){
			current_position.emptyNode();
			current_position = nodes[i];
			current_position.fillNode();
			break;
		}
	}
}

function onFrame(event){
    //This control the halo. You can choose to turn it off by removing this function, or you can create your own using 
    //this function too.
	halo.strokeColor = current_position['line']['color'];
    halo.scale( Math.pow( 1.04, Math.sin(event.count/8 )));
    halo.position = current_position['position'];
    
    //test how long it takes to compute sin(x) for different values of x.

}

var shiftDown = 0;


