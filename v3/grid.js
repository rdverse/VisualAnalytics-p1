var click = 0;
var clickedObj;
var clicked = false;


function gridData() {
	var data = new Array();
	var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 1;
	var width = 100;
	var height = 100;
	var click = 0;
	
	// iterate for rows	
	for (var row = 0; row < 4; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < 5; column++) {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
                r: (column/5)*255,
                g: (row/4)*255,
                b: 0
			})
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += width;
		}
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += height;	
	}
	return data;
}

function drawGrid(gridData) {
//var gridData = gridData();	
// I like to log the data to the console for quick debugging
console.log(gridData);

var grid = d3.select("#grid")
	.append("svg")
	.attr("width","600px")
	.attr("height","600px");
	
var row = grid.selectAll("row")
	.data(gridData)
	.enter()
    .append("g")
	.attr("class", "row");
	
var column = row.selectAll("square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y+200; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", function(d){return("rgb(" + d.r + "," + d.g + ",255)");})
	.style("stroke", "rgb(255,255,255)")
	.on('click', function(d) {
       
       // clickedObj = d;
       console.log(d.explicitOriginalTarget.__data__.r);

       
        if(clicked){

            // var rNew = d.__data__.r;
            // var gNew = d.__data__.g;

            //d3.select(clickedObj).transition().duration('800').style("fill","rgb(" +rNew+ "," +gNew+ ",0)");

           // d3.select(clickedObj).transition().duration('800').style("fill","rgb(255,255,255)");

            var rOld = clickedObj.explicitOriginalTarget.__data__.r;
            var gOld = clickedObj.explicitOriginalTarget.__data__.g;

            d3.select(this).transition().duration('800').style("fill","rgb(" +rOld+ "," +gOld+ ",255)");
            clicked = false;
    
        }
        
        else{
            clickedObj = d;
          //  d3.select(this).transition().duration('800').style("fill","rgb(0,0,0)");
            clicked = true;
        }


    });

}

var gridData = gridData();
drawGrid(gridData);