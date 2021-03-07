///////////////////////////////////////////////////////////////
/////////////Scatter Chart Renderer///////////////////////////
/////////////////////////////////////////////////////////////

function renderScatterChart(data) {
  //Define the shape of the plot width, height and everything else
  var margin = { top: 20, right: 30, bottom: 60, left: 40 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    // radius for scatter points
    radius = 3,
    // on mouse over
    radiusZoom = 12;


  // Define an svg element for the scatter plot
  var svg = d3.select("#PCAscatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  ///////////////////////////////

  // Add a linear X-axis for the scatter plot
  var x = d3.scaleLinear()
    .domain([d3.min(data, d => d.dim1) - 2, d3.max(data, d => d.dim1) + 2])
    .range([0, width]);


  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Define Y-axis, also linear, since it is a scatter plot
  var y = d3.scaleLinear()
    .range([0, height])
    .domain([d3.max(data, d => d.dim2) + 2, d3.min(data, d => d.dim2) - 2]);

  svg.append("g")
    .call(d3.axisLeft(y));



  // This will be used to display the stats of the car chosen at the bottom of the graph
  // var descriptionTooltip = svg.append("g")
  //   .attr("class", "tooltip")
  //   .style("display", "inline");

  // g up the tooltip
  // descriptionTooltip.append("g:text")
  //   .attr("x", 30)
  //   .attr("y", "1.2em")
  //   .style("text-anchor", "left")
  //   .attr("font-size", "14px");

///////////////////////////////////////////////////////////////////////////
//////////////////////////Tooltip to show stats///////////////////////////
/////////////////////////////////////////////////////////////////////////
var tooltipMain = d3.select("#Stats")
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
              //  .style("background-color", "white")
                .style("color", "#fbcf66")
                .style("border", "#ffebcd")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px");
                



  ////////Coloring zone/////////////////////

  // Choosing the appropriate color scheme here
    var myColor = d3.scaleOrdinal(data.map(d => d.cluster), d3.schemeSet2);
  


  ////////////////////////////////////////////////////////////////////////////////////////
  ///////////////On moise point over a scatter point [And] Scatter plot main///////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  // PLot a scatter point for bmw that is always zoomed in 
 

  svg.selectAll("circle")
    .data(data).enter().append("circle")
    .attr("cx", function (d) { return (x(d.dim1)); })
    .attr("cy", function (d) { return (y(d.dim2)); })
    // .attr("width", function(d) { return x(d[divname]);})
    .attr("r", radius)
    .attr("fill", function (d) { return (myColor(d.cluster)); })
    .attr("fill-opacity", 0.6)
    .on('pointerover', function (p, d) {

      // Transitioning the mouse over, a sweet functionality of d3  
      d3.select(this).transition()
        .duration('400')
        .attr("r", radiusZoom);

      // for rounding values in a string
      var floatFormat = d3.format(".1f");
  
        // Declare the text to be displayed when hover over bmw     
        console.log("<img src='../flags/" + d.Origin + ".png' width=200 height=120></img>"); 
      var textToDisplay = 
       "<img src='../flags/" + d.Origin + ".png' width=200 height=100></img>" +
        "<p>MPG: " + d.MPG +
        "</p><p>Cylinders: " + d.Cylinders +
        "</p><p>Displacement: " + d.Displacement +
        "</p><p>Horsepower: " + d.Horsepower +
        "</p><p>Weight: " + d.Weight+
        "</p><p>Acceleration: " + d.Acceleration + "</p>";
      
      // Finally, once the mouse is hovered, the stats are displayed
      // descriptionTooltip.style("display", "inline")
      //   .attr("transform", "translate(" + 25 + "," + 240 + ")");
      
      //   descriptionTooltip.select("text")
      //   .text(textToDisplay)
      //   .style("fill", "#fbcf66");

      tooltipMain.style("visibility", "visible")
      .html(textToDisplay);
//"<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>"
console.log(p);

svg.append("text")
.attr("x", p.x<width-300?p.x:p.x-330)
.attr("y", p.y<height-100?p.y:p.y-50)
.style("font-size", "18px")
.style('fill', '#fbcf66')
.text(d.Model_Year);


    })
    .on('pointerout', function (d, i) {
      d3.select(this).transition()
        .duration('300')
        .attr("r", radius);

      // Important! need to clear before plotting again
      d3.selectAll("svg").remove();
     tooltipMain.style("visibility", "hidden");

      renderScatterChart(data);


    });

// PCA header
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (height + (16 * 3)))
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("text-decoration", "underline")
    .style('fill', '#fbcf66')
    .text("TSNE + Kmeans clustering analysis");


//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Legend ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Attributes of legend to plot (location, color, text)
var legendData = [{index : 0, text :"Cluster 1", color : myColor(0)},
                      {index : 1, text :"Cluster 2", color : myColor(1)},
                      {index : 2, text :"Cluster 3", color : myColor(2)}];
  
var legendBox ={      
 xPos : width-200,
 yPos : 0,
 yBoxSize : 150,
 xBoxSize : 175};

    svg
    .append("rect")
    .attr("x", legendBox.xPos)
    .attr("y", legendBox.yPos)
    .attr("width", legendBox.xBoxSize)
    .attr("height", legendBox.yBoxSize)
    .attr("fill", "#ffebcd")
    .attr("opacity",0.2);
    
    svg.selectAll("legendCircles")
    .data(legendData).enter().append("circle")
    .attr("cx", (d)=>{return(legendBox.xPos + 30);})
    .attr("cy", (d)=>{return(legendBox.yPos + (legendBox.yBoxSize/3)*(d.index + 1) - (legendBox.yBoxSize/6));})
    .attr("r", 5)
    .attr("fill", (d)=>{return(d.color);})
    .attr("opacity",0.9);

    svg.selectAll("legendText")
    .data(legendData).enter().append("text")
    .attr("x", (d)=>{return(legendBox.xPos + 50);})
    .attr("y", (d)=>{return( legendBox.yPos +  ((legendBox.yBoxSize/3)*(d.index + 1) - (legendBox.yBoxSize/6)) + 7.5);})
    .attr("fill", (d)=>{return(d.color);})
    .text((d)=>{return(d.text);});
    
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Main Section/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

const PATH = "../Data/tsne_kmeans_0123_cars.csv";

d3.dsv(",", PATH, function(element) {
  return {
    Model : element.Model,
      Acceleration : +element.Acceleration,
      Cylinders : +element.Cylinders,
      Displacement : +element.Displacement,
      Horsepower : +element.Horsepower,
      MPG : +element.MPG,
      dim1 : +element.dim1,
      dim2 : +element.dim2,
      Weight : +element.Weight,
      Year : +element.Year,
      Origin: element.Origin,
      cluster: +element.cluster,
      Model_Year : element.Model_Year
};
}).then(function(AllData) {
   renderScatterChart(AllData);  

});


//////////////////////////////////////////////////////
/////////////Flow of program/////////////////////////
////////////////////////////////////////////////////

// First in the data loop, csv is fetched and a call is made to renderScatterPlot
// In the data loop, the selection button for the colors is also defined

// scatter function plots a scatter plot, and mouse over action is defined, 
// scatter plot then call renderBarplot based on the selections made in the scatter chart