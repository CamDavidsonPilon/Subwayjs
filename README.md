Subwayjs is a javascript module for creating an interactive subway system for you website. See www.camdp.com for an example of one. 
The module relies on Paper.js (http://paperjs.org/download/). 

To run, you'll need something that looks like this in your header:

        <script type="text/javascript" src="/scripts/paperjs/lib/paper.js"></script>
        <script type="text/paperscript" src="/scripts/subway.js" canvas="subway"></script>
        
Note that there is only one file that can contain BOTH the classes (present aready in subway.js) and the initialization of the stations 
(see initialization_example.js). The seperation above was purely for asthetics. Please email me at cam.davidson.pilon@gmail.com it you 
have any comments, questions or suggestions.

