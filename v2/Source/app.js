// Selection color defined in data loop that is used in scatter plot for choosing appropriate color schemes
var globalColorChoice = "cluster";
// sending the color scheme to bar plots
var globalMyColor = "white";


///////////////////////////////////////////////////////////////
/////////////Scatter Chart Renderer///////////////////////////
/////////////////////////////////////////////////////////////

function renderScatterChart(data) {
  //Define the shape of the plot width, height and everything else
  var margin = { top: 20, right: 30, bottom: 60, left: 40 },
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
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
    .domain([d3.min(data, d => d.dim1), d3.max(data, d => d.dim1)])
    .range([0, width]);


  // Append a "graphic" element (everything in d3 needs a g) and add x axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Define Y-axis, also linear, since it is a scatter plot
  var y = d3.scaleLinear()
    .range([0, height])
    .domain([d3.min(data, d => d.dim1), d3.max(data, d => d.dim1)]);

  svg.append("g")
    .call(d3.axisLeft(y));


  ///////define tooltip (actually only displaying the text, no rectangular box) for mouse hovering
  // This will be used to display the stats of the car chosen at the bottom of the graph
  var descriptionTooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "inline");

  // g up the tooltip
  descriptionTooltip.append("g:text")
    .attr("x", 30)
    .attr("y", "1.2em")
    .style("text-anchor", "left")
    .attr("font-size", "14px");


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
    .attr("fill", function (d) { return (myColor(d[globalColorChoice])); })
    .attr("fill-opacity", 0.6)
    .on('pointerover', function (p, d) {

      // Transitioning the mouse over, a sweet functionality of d3  
      d3.select(this).transition()
        .duration('100')
        .attr("r", radiusZoom);

      // for rounding values in a string
      var floatFormat = d3.format(".1f");
  
        // Declare the text to be displayed when hover over bmw      
      var textToDisplay = "Name: " + d.Model +
        "|    MPG: " + floatFormat(d.MPG, 1) +
        "|    Cylinders: " + floatFormat(d.Cylinders, 1) +
        "|    Displacement: " + floatFormat(d.Displacement, 1) +
        "|    Horsepower: " + floatFormat(d.Horsepower, 1) +
        "|    Weight: " + floatFormat(d.Weight, 1) +
        "|    Acceleration: " + floatFormat(d.Acceleration, 1) +
        "|    Year: " + floatFormat(d.Year, 1) +
        "|    Origin: " + d.Origin;
      
      // Finally, once the mouse is hovered, the stats are displayed
      descriptionTooltip.style("display", "inline")
        .attr("transform", "translate(" + 25 + "," + 240 + ")");
      descriptionTooltip.select("text")
        .text(textToDisplay)
        .style("fill", "#fbcf66");

    })
    .on('pointerout', function (d, i) {
      d3.select(this).transition()
        .duration('300')
        .attr("r", radius);
      // Important! need to clear before plotting again
      d3.selectAll("svg").remove();
      renderScatterChart(data);

    });

// PCA header
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (height + (16 * 3)))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .style('fill', '#e08a46')
    .text("TSNE + Kmeans clustering analysis");


//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Legend ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Attributes of legend to plot (location, color, text)
var legendData = [{index : 0, text :"Cluster 0", color : myColor(0)},
                      {index : 1, text :"Cluster 1", color : myColor(1)},
                      {index : 2, text :"Cluster 2", color : myColor(2)}];
  
var legendBox ={      
 xPos : 900,
 yPos : 0,
 yBoxSize : 150,
 xdBoxSize : 200};

    svg.append("g")
    .append("rect")
    .attr("x", xLegendPostition)
    .attr("y", yLegendPosition)
    .attr("width", xlegendBoxSize)
    .attr("height", ylegendBoxSize)
    .attr("fill", "#ffebcd")
    .attr("opacity",0.2);
    
    svg.append("g")
    .selectAll("legendCircles")
    .data(legendData)
    .enter()
    .append("circle")
    .attr("cx", (d)=>{return( + d.index*10);})
    .attr("cy", (d)=>{return(150 + d.index*10);})
    .attr("r", 20)
    .attr("fill", (d)=>{return(d.color);})
    .attr("opacity",0.9);

    console.log(myColor(0));

    
    


    // svg.append("text")
    // .attr("x", (width- 100))
    // .attr("y", (height - 250))
    // .attr("text-anchor", "middle")
    // .style("font-size", "12px")
    // .style('fill', '#a9ab93')
    // .text("Other Categories: Red(min) Blue(Max)");

    // svg.append("text")
    // .attr("x", (width- 100))
    // .attr("y", (height - 275))
    // .attr("text-anchor", "middle")
    // .style("font-size", "12px")
    // .style('fill', '#a9ab93')
    // .text("Origin: Green(US) Blue(Europe) Orange(Japan)");
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
      cluster: +element.cluster
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