//TTC subway


//subway.js
// Author: Cameron Davidson-Pilon
// Date: July, 2012
// License: MIT


// Dependencies: 
//  Paper.js (http://paperjs.org/)


//subway for blogs.
//canvas dimensions
width = 1890;
height = 1000;

// These change the subway chacteristics. Try manipulating them to see what they do.
// Note: all measurments are in pixels.
var NODE_SIZE = 16; //radius.
var INNER_NODE_SIZE = 7; 
var CUR_NODE_SIZE = 9;
var LINE_WIDTH = 23;

// fonts
var FONT_SIZE = 16;
var TEXT_FONT = 'Arial';
var CHARACTER_STYLE = {
		fillColor: 'white',
		fontSize: FONT_SIZE,
        font: TEXT_FONT,
		};
        
// after initilization, this variable will contain all stations. Needed for clicking with mouse. 
nodes = []; 

function Line( color, name ){
    // the Line object creates a subway line. 
    //   color: must be a paper.js RgbColor or a keyword color, eg: 'black', 'green'.
    //   name: the unique name of the line. 

    this.color = color;

    this.path = new Path();
    this.path.strokeWidth = LINE_WIDTH;
    this.path.strokeColor = this.color;
    this.name = name;
	
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
    
    this.line = line;
    this.position = position;
    this.neighbours = neighbours;
	this.name = name;
	this.url = url;
	nodes.push(this)
    
    //Methods
    this.onkeydownNode = onkeydownNode;
    this.emptyNode = emptyNode;
    this.fillNode = fillNode;

    // generate the visual shapes.
    var c = new Path.Circle( this.position, NODE_SIZE);
    c.fillColor = this.line.color;
    var ic = new Path.Circle( this.position, INNER_NODE_SIZE);
    ic.fillColor = 'white';
	
	this.text = new PointText( this.position + name_offset );
	this.text.content = this.name;
    this.text.characterStyle = CHARACTER_STYLE;
	// To rotate names, uncomment below. 
    this.text.rotate( -name_angle, this.position );

	
    // add it to the line.
    this.line.path.add( this.position);
    
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

    
	STROKE_WIDTH = 2; //this two control the offset and appearance of the 'underneath node'
	CIRCLE_DIST = 16;
	
	
	//This Node is the class for line transition stations.
	this.line = line;
	this.line2 = line2;
	this.position = position; //This is the position of either of the circles. The angle determines the position of the other one.
	this.neighbours = neighbours;
	this.angle = angle; //This is the angle between the two circles.
	this.positionAlt = this.position + new Point( CIRCLE_DIST*Math.cos( angle), CIRCLE_DIST*Math.sin( angle)  );
	this.name = name;
	this.url = url;
	nodes.push(this);
	
	//Methods;
	this.onkeydownNode = onkeydownNode;
	this.emptyNode = function(){
			this.innerc.remove()
	}
	//this.fillNode = fillNode;
	this.fillNode = function(){
		    this.innerc = new Path.Circle( this.position, CUR_NODE_SIZE);
			this.innerc.fillColor = 'black';
//            window.location.href=this.url;
	} 
	
	this.text = new PointText( this.position + name_offset );

	this.text.content = this.name;

    this.text.characterStyle = CHARACTER_STYLE;
    // uncomment below to rotate.
    this.text.rotate( -name_angle, this.position);
	
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
	var c1 = new Path.Circle( this.position, CUR_NODE_SIZE);
	c1.fillColor = this.line.color;
	

	//add it the the lines.
	this.line.path.add( this.position);
	this.line2.path.add(this.positionAlt);
	
	
	}
    
function LegendItem( start, end, subwayLine ){
    
     this.line = new Line(subwayLine.color, subwayLine.name);
     this.line.path.add( start, end)
     title = new PointText( end + new Point( 7,5) );
     title.content = subwayLine.name;
     title.characterStyle = {
		fillColor: 'black',
		fontSize: 14,
        font: TEXT_FONT
		}; 
        
}
   
 
function onKeyDown(event){
    //this function fires when a key is pressed.
    if (event.key =='w' ){
        current_position.onkeydownNode('N');}
    if (event.key =='a' ){
        current_position.onkeydownNode('W');}
    if (event.key == 'd'){
        current_position.onkeydownNode('E');}
    if (event.key == 's'){
        current_position.onkeydownNode('S');}
        
    //if (event.key in oc(['enter', 'space']) ){
       //will work if you set station urls. See the doc for SingleNode.
	//	window.location.href=current_position.url;
	//	}
}
 
function onkeydownNode( keydown ){
    for ( key in this.neighbours ){
        if (key == keydown){
            current_position.emptyNode();
            current_position = this.neighbours[key];
            current_position.fillNode();
            }
    }
    return 0;

}

function fillNode(){
    //this method fires when the user enters the node.
    var c = new Path.Circle( this.position, CUR_NODE_SIZE);
    c.fillColor = 'black';
}
    


function emptyNode(){
    //this function fires when the user leaves the node;
    var c = new Path.Circle( this.position, NODE_SIZE);
    c.fillColor = this.line.color;
    var ic = new Path.Circle( this.position, INNER_NODE_SIZE);
    ic.fillColor = 'white';
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
	for( var i=0; i<N; i++){
		var node_position = nodes[i].position;
		if (Path.Circle( node_position, NODE_SIZE ).bounds.contains(event.point) ){
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
	halo.strokeColor = current_position.line.color;
    halo.scale( Math.pow( 1.05, Math.sin(event.count/4 )));
    halo.position = current_position.position ;


}







bloorLine = new Line( '#2C7212', 'Bloor Line');
youngeLine = new Line( '#FCC61C', 'Younge Line');
sheppardLine = new Line( 'rgb(151,69,120)', 'Sheppard Line'); 
scarboroughLine = new Line('rgb(0,146,220)', 'Scarborough Line');


d_bloor = Math.floor( 1700/28 );
i_bloor = 20;
bloor_height = 470 + 70;
bloor_offset = new Point( 15, -12);
bloor_offset_alt = new Point( 20, 8);
bloor_name_angle = 35;

younge_offset = new Point( 22, 5 );
younge_d = 50;
younge_i = 30 + 70;
younge_width = i_bloor + 13*d_bloor;
young_d_alt = 44;
// I think it would be useful to package the offset, angle etc. into a new object, so it can be passed around easier. 

downsview = new SingleNode( youngeLine, new Point(younge_width - 2*d_bloor+20, younge_i + 0*younge_d), null, 'Downsview','url', younge_offset, 0 );
wilson = new SingleNode( youngeLine, new Point(younge_width -2*d_bloor+20, younge_i + 1*younge_d), null, 'Wilson','url', younge_offset, 0 );
yorkdale = new SingleNode( youngeLine, new Point(younge_width- 2*d_bloor+20, younge_i + 2*younge_d), null, 'Yorkdale','url', younge_offset, 0 );
lawrenceWest = new SingleNode( youngeLine, new Point(younge_width-2*d_bloor+20, younge_i + 3*younge_d), null, 'Lawrence West','url', younge_offset, 0 );
glencairn = new SingleNode( youngeLine, new Point(younge_width-2*d_bloor+20, younge_i + 4*younge_d), null, 'Glencairn','url', younge_offset, 0 );
eglingtonWest = new SingleNode( youngeLine, new Point(younge_width-2*d_bloor+20, younge_i + 5*younge_d), null, 'Eglington West','url', younge_offset, 0 );
stClairWest = new SingleNode( youngeLine, new Point(younge_width-1*d_bloor+10, younge_i + 6*younge_d), null, 'St. Clair West','url', younge_offset, 0 );
dupont = new SingleNode( youngeLine, new Point(younge_width, younge_i + 7*younge_d), null, 'Dupont','url', younge_offset, 0 );


kipling = new SingleNode( bloorLine, new Point(i_bloor + 0*d_bloor, bloor_height) + new Point( 5, d_bloor-10 ), null, 'Kipling','url', bloor_offset_alt, 0 );
islington = new SingleNode( bloorLine, new Point(i_bloor + 1*d_bloor, bloor_height), null, 'Islington','url', bloor_offset, bloor_name_angle );
royalYork = new SingleNode( bloorLine,new Point(i_bloor + 2*d_bloor, bloor_height), null, 'Royal York','url', bloor_offset, bloor_name_angle );
oldMill = new SingleNode( bloorLine, new Point(i_bloor + 3*d_bloor, bloor_height), null, 'Old Mill','url', bloor_offset, bloor_name_angle );
runnymede = new SingleNode( bloorLine, new Point(i_bloor + 4*d_bloor, bloor_height), null, 'Runnymede','url', bloor_offset, bloor_name_angle );
highPark = new SingleNode( bloorLine, new Point(i_bloor + 5*d_bloor, bloor_height), null, 'High Park','url', bloor_offset, bloor_name_angle );
keele = new SingleNode( bloorLine, new Point(i_bloor + 6*d_bloor, bloor_height), null, 'Keele','url', bloor_offset, bloor_name_angle );
dundasWest = new SingleNode( bloorLine, new Point(i_bloor + 7*d_bloor, bloor_height), null, 'Dundas West','url', bloor_offset, bloor_name_angle );
lansdowne = new SingleNode( bloorLine, new Point(i_bloor + 8*d_bloor, bloor_height), null, 'Landsdowne','url', bloor_offset, bloor_name_angle );
dufferin = new SingleNode( bloorLine, new Point(i_bloor + 9*d_bloor, bloor_height), null, 'Dufferin','url', bloor_offset, bloor_name_angle );
ossington = new SingleNode( bloorLine, new Point(i_bloor + 10*d_bloor, bloor_height), null, 'Ossington','url', bloor_offset, bloor_name_angle );
christie = new SingleNode( bloorLine, new Point(i_bloor + 11*d_bloor, bloor_height), null, 'Christie','url', bloor_offset, bloor_name_angle );
bathurst = new SingleNode( bloorLine, new Point(i_bloor + 12*d_bloor, bloor_height), null, 'Bathurst','url', bloor_offset, bloor_name_angle );
spadina = new TransitionNode(  bloorLine, youngeLine, 1.571, new Point(i_bloor + 13*d_bloor, bloor_height), null, 'Spadina','url', bloor_offset, bloor_name_angle );
stGeorge = new TransitionNode( bloorLine, youngeLine, 1.571, new Point(i_bloor + 14*d_bloor, bloor_height), null, 'St. George','url', bloor_offset, bloor_name_angle );
    
    museum = new SingleNode( youngeLine, new Point(i_bloor + 14*d_bloor, younge_i + 10*younge_d), null, 'Museum','url', new Point(-80,5), 0 );
    queensPark = new SingleNode( youngeLine, new Point(i_bloor + 14*d_bloor, younge_i + 11*younge_d), null, 'Queen\'s Park','url', new Point(-115,5), 0 );
    stPatrick = new SingleNode( youngeLine, new Point(i_bloor + 14*d_bloor, younge_i + 12*younge_d), null, 'St. Patrick','url', new Point(-95,5), 0 );
    osgoode = new SingleNode( youngeLine, new Point(i_bloor + 14*d_bloor, younge_i + 13*younge_d), null, 'Osgoode','url', new Point(-87,5), 0 );
    stAndrew = new SingleNode( youngeLine, new Point(i_bloor + 14*d_bloor, younge_i + 14*younge_d), null, 'St. Andrews','url', new Point(-105,5), 0 );
    union = new SingleNode( youngeLine, new Point(i_bloor + 15*d_bloor, younge_i + 15*younge_d - 20), null, 'Union','url', new Point(20, 15), 0 );
    king = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 14*younge_d), null, 'King','url', younge_offset, 0 );
    queen = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 13*younge_d), null, 'Queen','url', younge_offset, 0 );
    dundas = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 12*younge_d), null, 'Dundas','url', younge_offset, 0 );
    college = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 11*younge_d), null, 'College','url', younge_offset, 0 );
    wellesley = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 10*younge_d), null, 'Wellesley','url', younge_offset, 0 );

bay = new SingleNode( bloorLine, new Point(i_bloor + 15*d_bloor, bloor_height), null, 'Bay','url', bloor_offset, bloor_name_angle );
    
    bloorYounge = new TransitionNode( bloorLine, youngeLine, 1.571, new Point(i_bloor + 16*d_bloor, bloor_height), null, 'Bloor/Younge','url', bloor_offset, bloor_name_angle );

sherbourne = new SingleNode( bloorLine, new Point(i_bloor + 17*d_bloor, bloor_height), null, 'Sherbourne','url', bloor_offset, bloor_name_angle );
castleFrank = new SingleNode( bloorLine, new Point(i_bloor + 18*d_bloor, bloor_height), null, 'Castle frank','url', bloor_offset, bloor_name_angle);
broadview = new SingleNode( bloorLine, new Point(i_bloor + 19*d_bloor, bloor_height), null, 'Broadview','url', bloor_offset, bloor_name_angle );
chester = new SingleNode( bloorLine, new Point(i_bloor + 20*d_bloor, bloor_height), null, 'Chester','url', bloor_offset, bloor_name_angle );
pape = new SingleNode( bloorLine, new Point(i_bloor + 21*d_bloor, bloor_height), null, 'Pape','url', bloor_offset, bloor_name_angle );
donlands = new SingleNode( bloorLine, new Point(i_bloor + 22*d_bloor, bloor_height), null, 'Donlands','url', bloor_offset, bloor_name_angle );
greenwood = new SingleNode( bloorLine, new Point(i_bloor + 23*d_bloor, bloor_height), null, 'Greenwood','url', bloor_offset, bloor_name_angle );
coxwell = new SingleNode( bloorLine, new Point(i_bloor + 24*d_bloor, bloor_height), null, 'Coxwell','url', bloor_offset, bloor_name_angle );
woodbine = new SingleNode( bloorLine, new Point(i_bloor + 25*d_bloor, bloor_height), null, 'Woodbine','url', bloor_offset, bloor_name_angle);
mainStreet = new SingleNode( bloorLine, new Point(i_bloor + 26*d_bloor, bloor_height), null, 'Main Street','url', bloor_offset_alt, 0);
victoriaPark = new SingleNode( bloorLine, new Point(i_bloor + 27*d_bloor, bloor_height) + new Point( -20, -d_bloor+10 ) , null, 'Victoria Park','url', bloor_offset_alt, 0);
warden = new SingleNode( bloorLine, new Point(i_bloor + 28*d_bloor, bloor_height) + new Point( -2*20, -2*d_bloor+2*10 ), null, 'Warden','url', bloor_offset_alt, 0 );
kennedy = new TransitionNode( bloorLine, scarboroughLine, -1.571, new Point(i_bloor + 29*d_bloor -3*20, bloor_height -3*d_bloor+3*10) , null, 'Kennedy','url', bloor_offset_alt ,0  );

    rosedale = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d + 0*young_d_alt), null, 'Rosedale','url', younge_offset, 0 );
    summerhill = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d -1*young_d_alt), null, 'Summerhill','url', younge_offset, 0 );
    stClair = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-2*young_d_alt), null, 'St. Clair','url', younge_offset, 0 );
    davisville = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-3*young_d_alt), null, 'Davisville','url', younge_offset, 0 );
    eglington = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-4*young_d_alt), null, 'Eglington','url', younge_offset, 0 );
    lawrence = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-5*young_d_alt), null, 'Lawrence','url', younge_offset, 0 );
    yorkMills = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-6*young_d_alt), null, 'York Mills','url', younge_offset, 0 );
    sheppardYounge = new TransitionNode( youngeLine, sheppardLine, 0, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-7*young_d_alt), null, 'Sheppard-Younge','url', new Point(-150, 5), 0 );
    northYorkCentre = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-8*young_d_alt), null, 'North York Centre','url', younge_offset, 0 );
    finch = new SingleNode( youngeLine, new Point(i_bloor + 16*d_bloor, younge_i + 6.5*younge_d-9*young_d_alt), null, 'Finch','url', younge_offset, 0 );

//purpz line
shep_d = 60;
shep_i = 90;
bayview = new SingleNode( sheppardLine, new Point(i_bloor + 16*d_bloor + shep_i + 1*shep_d, younge_i + 6.5*younge_d-7*young_d_alt), null, 'Bayview','url', bloor_offset, bloor_name_angle );
bessarion = new SingleNode( sheppardLine, new Point(i_bloor + 16*d_bloor + shep_i + 2*shep_d, younge_i + 6.5*younge_d-7*young_d_alt), null, 'Bessarion','url', bloor_offset, bloor_name_angle );
leslie = new SingleNode( sheppardLine, new Point(i_bloor + 16*d_bloor + shep_i + 3*shep_d, younge_i + 6.5*younge_d-7*young_d_alt), null, 'Leslie','url', bloor_offset, bloor_name_angle );
donMills = new SingleNode( sheppardLine, new Point(i_bloor + 16*d_bloor + shep_i +  4*shep_d, younge_i + 6.5*younge_d-7*young_d_alt), null, 'Don Mills','url', bloor_offset, bloor_name_angle );


// bluez line
lawrenceEast = new SingleNode( scarboroughLine, new Point(i_bloor + 29*d_bloor -3*20, bloor_height -3*d_bloor+15 - 1*60), null, 'Lawrence East','', bloor_offset_alt, 0);
ellsemere = new SingleNode( scarboroughLine, new Point(i_bloor + 29*d_bloor -3*20, bloor_height -3*d_bloor+15 - 2*60), null, 'Ellsemere', '', bloor_offset_alt, 0);
midland = new SingleNode( scarboroughLine, new Point(i_bloor + 29*d_bloor -3*20, bloor_height -3*d_bloor+15 - 3*60), null, 'Midland','', bloor_offset, bloor_name_angle);
scarboroughCentre = new SingleNode( scarboroughLine, new Point(i_bloor + 29*d_bloor -3*20 + 50, bloor_height -3*d_bloor+15 - 3*60), null, 'Scarborough Centre', '', bloor_offset, bloor_name_angle);
mcCowan = new SingleNode( scarboroughLine, new Point(i_bloor + 29*d_bloor -3*20 + 2*50, bloor_height -3*d_bloor+15 - 3*60), null, 'McCowan', '', bloor_offset, bloor_name_angle);

 

kipling.neighbours = {'N': islington, 'E': islington };
islington.neighbours = {'W': kipling, 'E': royalYork, 'S':kipling };
royalYork.neighbours = {'W': islington,'E':oldMill};
oldMill.neighbours = {'W':royalYork, 'E':runnymede};
runnymede.neighbours = {'W':oldMill, 'E':highPark};
highPark.neighbours = {'W':runnymede, 'E':keele};
keele.neighbours = {'W':highPark, 'E':dundasWest};
dundasWest.neighbours = {'W':keele, 'E':lansdowne};
lansdowne.neighbours = {'W':dundasWest, 'E':dufferin};
dufferin.neighbours = {'W':lansdowne, 'E':ossington};
ossington.neighbours = {'W':dufferin, 'E':christie};
christie.neighbours = {'W':ossington, 'E':bathurst};
bathurst.neighbours = {'W':christie, 'E':spadina};
spadina.neighbours = {'W':bathurst, 'E':stGeorge, 'N':dupont, 'S':stGeorge};
stGeorge.neighbours = {'W':spadina, 'E':bay, 'S':museum, 'N':spadina};
bay.neighbours = {'W':stGeorge, 'E':bloorYounge};
bloorYounge.neighbours = {'W':bay, 'E':sherbourne, 'N':rosedale, 'S':wellesley};
sherbourne.neighbours = {'E':castleFrank, 'W':bloorYounge};
castleFrank.neighbours = {'W':sherbourne, 'E':broadview};
broadview.neighbours = {'W':castleFrank, 'E':chester};
chester.neighbours = {'W':broadview, 'E':pape};
pape.neighbours = {'W':chester, 'E':donlands};
donlands.neighbours = {'W':pape, 'E':coxwell};
coxwell.neighbours = {'W':donlands, 'E':woodbine};
woodbine.neighbours = {'W':coxwell, 'E':mainStreet};
mainStreet.neighbours = {'W':woodbine, 'E':victoriaPark, 'N':victoriaPark};
victoriaPark.neighbours = {'W':mainStreet, 'E':warden, 'S':mainStreet, 'N':warden};
warden.neighbours = {'W':victoriaPark, 'E':kennedy, 'S':victoriaPark, 'N':kennedy};
kennedy.neighbours = {'W':warden, 'S':warden, 'N':lawrenceEast};
lawrenceEast.neighbours = { 'S':kennedy, 'N':ellsemere};
ellsemere.neighbours = { 'S':lawrenceEast, 'N':midland};
midland.neighbours = { 'S':ellsemere, 'E':scarboroughCentre};
scarboroughCentre.neighbours = { 'W':midland, 'E':mcCowan};
mcCowan.neighbours = { 'W':scarboroughCentre};


dupont.neighbours = {'S':spadina, 'N':stClairWest, 'W':stClairWest};
stClairWest.neighbours = {'S':dupont, 'N':eglingtonWest, 'W':eglingtonWest, 'E':dupont};
eglingtonWest.neighbours = {'E':stClairWest, 'S':stClairWest, 'N':glencairn};
glencairn.neighbours = {'N':lawrenceWest, 'S':eglingtonWest};
lawrenceWest.neighbours = {'N':yorkdale, 'S':glencairn};
yorkdale.neighbours = {'N':wilson, 'S':lawrenceWest};
wilson.neighbours = {'N':downsview, 'S':yorkdale};
downsview.neighbours = {'S':wilson};

finch.neighbours = {'S':northYorkCentre};
northYorkCentre.neighbours = {'S':sheppardYounge, 'N':finch };
sheppardYounge.neighbours = {'S':yorkMills, 'N':northYorkCentre, 'E':bayview };
yorkMills.neighbours = {'S':lawrence, 'N':sheppardYounge };
lawrence.neighbours = {'S':eglington, 'N':yorkMills };
eglington.neighbours = {'S':davisville, 'N':lawrence };
davisville.neighbours = {'S':stClair, 'N':eglington };
stClair.neighbours = {'S':summerhill, 'N':davisville };
summerhill.neighbours = {'S':rosedale, 'N':stClair };
rosedale.neighbours = {'S':bloorYounge, 'N':summerhill };

museum.neighbours = {'N':stGeorge, 'S':queensPark};
queensPark.neighbours = {'N':museum, 'S':stPatrick};
stPatrick.neighbours = {'N':queensPark, 'S':osgoode};
osgoode.neighbours = {'N':stPatrick, 'S':stAndrew};
stAndrew.neighbours = {'N':osgoode, 'S':union, 'E':union};
king.neighbours = {'N':queen, 'S':union, 'W':union};
union.neighbours = {'E':king, 'W':stAndrew};
queen.neighbours = {'N':dundas, 'S':king};
dundas.neighbours = {'N':college, 'S':queen};
college.neighbours = {'N':wellesley, 'S':dundas};
wellesley.neighbours = {'N':bloorYounge, 'S':college};

bayview.neighbours = {'W':sheppardYounge, 'E':bessarion};
bessarion.neighbours = {'W':bayview, 'E':leslie};
leslie.neighbours = {'W':bessarion, 'E':donMills};
donMills.neighbours = {'W':leslie};




    
// initialize myself.
current_position = stGeorge;
current_position.fillNode();

// form the halo
halo = new Path.Circle( current_position.position, NODE_SIZE  );
halo.strokeColor = current_position.line.color;
halo.strokeWidth = 3;