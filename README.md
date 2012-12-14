Subwayjs is a javascript module for creating an interactive subway system for you website. See www.camdp.com/UWSubway and www.camdp.com/ttc for examples.
The module relies on Paper.js (http://paperjs.org/download/). 

To run, you'll need something that looks like this in your header:
        <meta .... >
        <script type="text/javascript" src="/scripts/paperjs/lib/paper.js"></script>
        <script type="text/paperscript" src="/scripts/subway.js" canvas="subway"></script>
        <style ...>
Note that there must be only one script that will contain the main subways.js library and the initialization of the stations 
(see initialization_example.js for an example of initalization). The seperation above was purely for aesthetics. The reason for this is that paper.js works
only a very local scope, and not across js scripts. 

See ttc.js for a full, working example. 


Please email me at cam.davidson.pilon@gmail.com if you 
have any comments, questions or suggestions.

