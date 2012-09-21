
//subway.js
// Author: Cameron Davidson-Pilon
// Date: Sept, 2012
// License: MIT
// Code available at https://github.com/Valloway/Subwayjs

// Dependencies: 
//  Paper.js (http://paperjs.org/)




// These change the subway node design. Try manipulating them to see what they do.
// Note: all measurments are in pixels.

var NODE_SIZE = 16; //radius of the nodes
var INNER_NODE_SIZE = 7; //radius of the inner circle in the stations
var CUR_NODE_SIZE = 9; // radious of the inner cicle, if is is currently selected.
var LINE_WIDTH = 18; //width of the inter-station lines.

// fonts
var FONT_SIZE = 18;
var TEXT_FONT = 'Carme';
var FONT_COLOR = 'black';
var LINE_EMPH = 5;

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
            move_infobox(this)
            this.ic.fillColor = 'black';
            this['line']['path'].strokeWidth = LINE_WIDTH + LINE_EMPH;
//            this['line']['path'].strokeColor.alpha= .9;

    }; 
    this.emptyNode = function(){
            //this method fires when the user enters the node.
            this.ic.fillColor = 'white';
            this['line']['path'].strokeWidth = LINE_WIDTH;
            //this['line']['path'].strokeColor.alpha= .4;

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
			this.innerc.fillColor = this['line']['color'];
            this['line']['path'].strokeWidth = LINE_WIDTH;
            this['line2']['path'].strokeWidth = LINE_WIDTH;
            //this['line2']['path'].strokeColor.alpha = .4;
            //this['line']['path'].strokeColor.alpha = .4;


	}
	this.fillNode = function(){
			this.innerc.fillColor = 'black';
            this['line']['path'].strokeWidth = LINE_WIDTH + LINE_EMPH;
            this['line2']['path'].strokeWidth = LINE_WIDTH + LINE_EMPH;
            move_infobox(this)
            //this['line2']['path'].strokeColor.alpha = .9;
            //this['line']['path'].strokeColor.alpha= .9;
            
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
    

    
    
    
function move_infobox(node){
    var x = node['position'].x;
    var y = node['position'].y;
    
    
    infobox.style.left = x + 20;
    infobox.style.top = y - 20 ;
    document.getElementById('infobox-text').innerHTML = document.getElementById( toHTMLname(node['name']) ).innerHTML; //might be easier to have a property in the object to store this.
    return;
 }    
 
 
function toHTMLname( name ){
    //var htmlname = name.replace(//g, '' );
    var htmlname = name.replace(/[.'-*\s]/g, '').toLowerCase()
    console.log( htmlname );

    return htmlname.toLowerCase();
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
	this['color'] = color;
	this['path'] = new Path();
	this['path'].style = { 
		strokeWidth: LINE_WIDTH,
		strokeColor: this.color,
		};
	this['path'].dashArray = [7,4];
	
	this['path'].add(point1, point2);
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
function onMouseMove(event){
    // This function fires whenever the mouse moves. Creates hover pointer
	var N = nodes.length;
    var point = event.point;
	for( var i=0; i<N; i++){
		var node_position = nodes[i].position;
		if (Path.Circle( node_position, NODE_SIZE ).bounds.contains(point) ){
            document.body.style.cursor = 'pointer';

			return;
		}
	}
    document.body.style.cursor = 'default';

}

function onFrame(event){
    //This control the halo. You can choose to turn it off by removing this function, or you can create your own using 
    //this function too.
	halo.strokeColor = current_position['line']['color'];
    halo.scale( Math.pow( 1.04, Math.sin(event.count/5 )));
    halo.position = current_position['position'];
    
    //test how long it takes to compute sin(x) for different values of x.

}


H_CANVAS = 800;
W_CANVAS = 1000;
offset = new Point( 20 ,20);
H_SLC = 250
W_SLC = 450


SLC_delta = 190;

//create the river
river = new Path()
river.add( new Point(W_SLC - 60 + 90,  H_SLC+SLC_delta + 200) )
river.add( new Point(W_SLC - 60 - 20,  H_SLC+SLC_delta) )
river.add( new Point(W_SLC - 60,  H_SLC) )
river.add( new Point(W_SLC - 120,  H_SLC - 30) )
river.add( new Point(W_SLC - 190,  H_SLC - 30) )
river.add( new Point( W_SLC - 2*SLC_delta/2 - 60, H_SLC - 1*SLC_delta/2) )
river.add( new Point( W_SLC - 2*SLC_delta/2, H_SLC - 1*SLC_delta/2 - 60 ) )
river.add( new Point( W_SLC - 1*SLC_delta/2-20, 0)  )


river.smooth();

river.strokeColor = "rgb(200,200,255)";
river.strokeWidth = 12;


//create lines
RingLine = new Line( '#af1b8b', 'Ring Line');
NWLine = new Line( '#b3d529', 'SLC Line');
NLine = new Line( '#ababab', 'CIF Line');
DCLine = new Line( '#9AE4E8', 'DC Line');
EVLine = new Line( 'rgb(23,45,100)', 'EV Line');

var dCIF = new DashLine( NLine['color'], new Point( W_SLC+SLC_delta, H_SLC-160)+ new Point( 0, -75),  new Point( W_SLC+SLC_delta, H_SLC-160)  );
var dUWP = new DashLine( NWLine['color'], new Point( W_SLC+2*SLC_delta + 100, H_SLC+SLC_delta + 55)+ new Point( +75, 0),  new Point( W_SLC+2*SLC_delta + 100, H_SLC+SLC_delta + 55)  );


clv = new SingleNode( NWLine, new Point( W_SLC - 3*SLC_delta/2, H_SLC - 2*SLC_delta/2), null, 'CLV', '/', new Point(25, 0), 0);
rev = new SingleNode( NWLine, new Point( W_SLC - 2*SLC_delta/2, H_SLC - 1*SLC_delta/2), null, 'REV', '/', new Point(15,-18), 0);
v1 = new SingleNode( NWLine, new Point( W_SLC - 1*SLC_delta/2, H_SLC - 1*SLC_delta/2), null, 'V1', '/', new Point(15,-18), 0);

slc = new TransitionNode(  RingLine, NWLine,3.8, new Point( W_SLC, H_SLC ), null, 'SLC','/', new Point( -65, 15), 0 );
    dp2 = new TransitionNode( NLine, EVLine,  -4.2, new Point( W_SLC+SLC_delta, H_SLC + SLC_delta/2), null, '', '/', new Point(20, -7), 0);

    dp = new TransitionNode( NLine, NWLine,  .2, new Point( W_SLC+SLC_delta, H_SLC + SLC_delta/2), null, 'DP Library', '/', new Point(24, -15), 0);
    
    cif = new SingleNode( NLine, new Point( W_SLC+SLC_delta, H_SLC-160), null, 'CIF', '/', new Point(23,5), 0);
bmh = new TransitionNode(  RingLine, NLine, 4.75, new Point( W_SLC+SLC_delta, H_SLC-70 ), null, 'BMH','/', new Point(25, -10), 0 );
    mc = new TransitionNode( NLine, DCLine, 0, new Point( W_SLC+SLC_delta, H_SLC), null, 'MC', '/', new Point(20, 34), 0 );


dc = new TransitionNode(  RingLine, DCLine, -3.1, new Point( W_SLC+2*SLC_delta, H_SLC), null, 'DC','/', new Point(20,25), 0 );
    engplus = new SingleNode( DCLine, new Point( W_SLC+2.5*SLC_delta, H_SLC), null, 'ENG-Plus', '/', new Point(20,25), 0);

engminus = new TransitionNode(  RingLine, NWLine, .5, new Point( W_SLC+2*SLC_delta, H_SLC+SLC_delta), null, 'ENG-Minus','/', new Point( 20, -10), 0 );
    uwp = new SingleNode( NWLine, new Point( W_SLC+2*SLC_delta + 100, H_SLC+SLC_delta + 55), null, 'UW Place', '', new Point(18, 28), 0);
    
sch2 = new TransitionNode(  RingLine, EVLine, -2, new Point( W_SLC+SLC_delta, H_SLC+SLC_delta+70), null, '','/', new Point(-175, 30), 0 );

sch = new TransitionNode(  RingLine, NLine, 1.3, new Point( W_SLC+SLC_delta, H_SLC+SLC_delta+70), null, 'South Campus Hall','/', new Point(-175, 30), 0 );

    seagram = new SingleNode( NLine, new Point( W_SLC + 1.5*SLC_delta, H_SLC+SLC_delta+55 + SLC_delta/2), null, 'Seagram','/', offset, 0 );

    

    ev = new TransitionNode( RingLine, EVLine, -1.8, new Point(W_SLC,  H_SLC+SLC_delta), null, 'EV*', '', new Point(-50, 18), 0);

    health =  new SingleNode( EVLine, new Point( W_SLC - 1*SLC_delta/2- 20, H_SLC+SLC_delta - 1*SLC_delta/2 ), null, 'College', '/', new Point(-30,-22), 0);
    
RingLine.path.closePath();




clv.neighbours = { 'S':rev, 'E': rev};
seagram.neighbours = { 'N':sch, 'W': sch};
uwp.neighbours = { 'N':engminus, 'W': engminus};
rev.neighbours = { 'N':clv, 'E':v1, 'W':clv};
v1.neighbours = { 'W':rev, 'S':slc, 'E':slc};
slc.neighbours = { 'S':ev, 'W':v1, 'N':bmh, 'E':dp};
ev.neighbours = {'N': slc, 'E':sch, 'S':sch, 'W': health};
dp.neighbours = {'W':slc, 'S': sch, 'N': mc, 'E':engminus};
bmh.neighbours = {'W':slc, 'S': mc, 'N': cif, 'E':dc};
dc.neighbours = {'W':mc, 'S': engminus, 'N': bmh, 'E':engplus};
engminus.neighbours = {'W':dp, 'S': sch, 'N':dc,  'E':uwp};
sch.neighbours = {'W':ev, 'S': seagram, 'N':dp,  'E':engminus};
engplus.neighbours = {'W':dc};
mc.neighbours = {'S': dp, 'N': bmh, 'E':dc};
cif.neighbours = {'S':bmh};
health.neighbours = {'S':ev, 'E': ev};





//legend

var lg1 = new LegendItem( new Point( 60,300), new Point( 170,300), RingLine);
var lg2 = new LegendItem( new Point( 60,330), new Point( 170,330), NWLine);
var lg3 = new LegendItem( new Point( 60,360), new Point( 170,360), NLine);
var lg4 = new LegendItem( new Point( 60,390), new Point( 170,390), DCLine);
var lg4 = new LegendItem( new Point( 60,420), new Point( 170,420), EVLine);


// title
var title = new PointText( new Point(60,500) );
title.content = "University of Waterloo \nProposed Subway Map";
title.characterStyle = {
		fillColor: 'black',
		fontSize: 25,
        font: "Helvetica"
		};
var description = new PointText( new Point(60,560) );
description.content = "This is a map based on a proposed subway system\n underneath the University of Waterloo.\n Hold [shift] and use your arrow keys to move around, \n or press your WASD keys.";
description.characterStyle = {
		fillColor: 'black',
		fontSize: 14,
        font: "Arial"
		};
        

var shiftDown = 0;

current_position = slc;
current_position.fillNode();

// form the halo
halo = new Path.Circle( current_position.position, NODE_SIZE  );
halo.strokeColor = current_position.line.color;
halo.strokeWidth = 3;
