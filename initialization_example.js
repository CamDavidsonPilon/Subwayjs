
// Paper.js does ot operate across different javascript files yet, so your initialization or subways stations needs to be done in the subway.js file.\
// I've seperated the two purely for asthetics.


 
// initialize some subway lines
MainLine = new Line( '#af1b8b', 'Main'); // (color, name)
BlogLine = new Line( '#b3d529', 'Blogs');
ProjectsLine = new Line('#ababab', 'Projects');


// initalize the subway stations. Note the <i>order</i> of the initilization is important. The subway line will be drawn in order of how they are added
// to the Lines object. Note that I have left the "neighbours" parameter empty for now. They will be initilized later. 

homeNode = new SingleNode( MainLine, new Point(30, 100), null, 'Home','http://www.70percentfatfree.com',new Point( 12, -14) );
gitNode = new SingleNode(ProjectsLine,  new Point( 182, 100), null, 'GitHub','https://github.com/Valloway',new Point( 19, 0));

    projectsNode = new TransitionNode( MainLine, ProjectsLine, 0.79, new Point( 182, Main_height), null, 'Projects', 'http://www.70percentfatfree.com/Projects.html', new Point( 12, -14));
    pyProcessNode = new SingleNode( ProjectsLine, new Point( 182+diff, Main_height+diff), null, 'PyProcess Library', 'http://pyprocess.70percentfatfree.com/', new Point( 19, 0));
    moreProjectsNode = new SingleNode( ProjectsLine, new Point(100, 200), null, 'More Projects','/', new Point( 12, -14));

researchNode = new SingleNode( MainLine, new Point( 334, Main_height), null, 'Research', 'http://www.70percentfatfree.com/Research.html', new Point( 12, -14));

    blogNode = new TransitionNode( MainLine, BlogLine, -0.79, new Point( 486, Main_height), null, 'Blogs', '/blogs', new Point( 18, 26) ) ;
    latestBlogNode = new SingleNode( BlogLine, new Point( 486 + 70, 40), null, 'Latest Blog', '/', new Point( 13, -14));
    allBlogsNode = new SingleNode( BlogLine, new Point( 690, 40), null,'All Blogs', '/blogs', new Point( 13, -14));

resumeNode = new SingleNode( MainLine, new Point(640, Main_height), null, 'Resume', '/mediaFiles/PDFs/Resume.pdf',new Point( 12, -14));


//populuate neighbours. This is how the stations are mapped to the keyboard.
homeNode.neighbours = {'E':projectsNode};
projectsNode.neighbours = {'W':homeNode, 'N':gitNode, 'E':researchNode, 'S': pyProcessNode};
researchNode.neighbours = {'E':blogNode, 'W':projectsNode};
blogNode.neighbours = {'W': researchNode, 'E':resumeNode, 'N':latestBlogNode };
gitNode.neighbours = {'S': projectsNode, 'E':projectsNode};
resumeNode.neighbours = {'W':blogNode, 'E':twNode, 'S':twNode };
latestBlogNode.neighbours = {'S': blogNode, 'E': allBlogsNode};
allBlogsNode.neighbours = {'S': latestBlogNode, 'W':latestBlogNode };
pyProcessNode.neighbours = {'N':projectsNode, 'W':projectsNode };
moreProjectsNode.neighbours = {'N':projectsNode};

// initialize myself.
current_position = homeNode;
current_position.fillNode();

// form the halo around the current position
halo = new Path.Circle( current_position.position, NODE_SIZE  );
halo.strokeColor = current_position.line.color;
halo.strokeWidth = 3;


// Some asthetics. 

//construct same dashed paths.
var blogconstructionpath = new DashLine( BlogLine.color, allBlogsNode.position + new Point(14,0), allBlogsNode.position + new Point(100, 0) );
var projectsconstructionpath = new DashLine( ProjectsLine.color, moreProjectsNode.position + new Point(14,0), moreProjectsNode.position + new Point(110, 0) );

//create a legend
var p = new Point(20, 140)
var lgnt = new Point(60,0); //these makes the lines uniformly spread out and even.
var btw = new Point(0,25);

var key = new LegendItem( p, p + lgnt, MainLine );
var key = new LegendItem( p + btw, p + btw + lgnt, BlogLine );
var key = new LegendItem( p + btw+btw, p + btw+btw + lgnt, ProjectsLine );


// create a title
var title = new PointText( new Point(20,55) );
title.content = "Metro";
title.characterStyle = {
		fillColor: 'black',
		fontSize: 28,
        font: TEXT_FONT
		}; 
		
