// Selection color defined in data loop that is used in scatter plot for choosing appropriate color schemes
var globalColorChoice = "MPG";
// var globalBarColorChoice = "#F2EFEE";
var globalBmwBarColor = "#F2EFEE";
// sending the color scheme to bar plots
var globalMyColor = "white";


///////////////////////////////////////////////////////////////
/////////////Scatter Chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////

function renderScatterChart(data) {
  //Define the shape of the plot width, height and everything else
  var margin = { top: 20, right: 30, bottom: 60, left: 40 },
    width = 1200 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom,
    // radius for scatter points
    radius = 3,
    // on mouse over
    radiusZoom = 12;

  // Will need bmw data for some comparisions 
  var bmw2002Data = data.filter((d, i) => { return d.Model == "bmw 2002" });

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
    .domain([d3.min(data, d => d.pca1), d3.max(data, d => d.pca1)])
    .range([0, width]);


  // Append a "graphic" element (everything in d3 needs a g) and add x axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    //translate does not work for some reason, [check later]
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Define Y-axis, also linear, since it is a scatter plot
  var y = d3.scaleLinear()
    .range([0, height])
    .domain([d3.min(data, d => d.pca1), d3.max(data, d => d.pca1)]);

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
  // This will define the feature with respect to which the plot is colored
  // DONT DELETE AGAIN
  d3.select("#choiceColor")
    .on("change", function (d) {
      globalColorChoice = d3.select(this).property("value");
      d3.selectAll("svg").remove();
      renderScatterChart(data);
    });


  // colorList.append("span")
  //           .text(d => d.name);
  // colorList.append("span").text(data => data.keys)

  // console.log(d3.keys(data[0]).slice(1));
  // selection.call(d3.zoom().on("zoom", zoomed));

  // Choosing the appropriate color scheme here
  if (globalColorChoice != "Origin") {
    // All columns except origin are sequential, so a red blue sequential scheme is used 
    var myColor = d3.scaleSequential()

      .domain([d3.min(data, d => d[globalColorChoice]), d3.max(data, d => d[globalColorChoice])])
      .interpolator(d3.interpolateRdBu);
  }
  else {
    // If origin is selected, we will need categorical color map
    var myColor = d3.scaleOrdinal(data.map(d => d.Origin), d3.schemeSet2);
  }


  ////////////////////////////////////////////////////////////////////////////////////////
  ///////////////On moise point over a scatter point [And] Scatter plot main///////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  // PLot a scatter point for bmw that is always zoomed in 
  console.log(globalBmwBarColor);
  svg.selectAll("circlebmw")
    .data(bmw2002Data)
    .enter().append("circle")
    .attr("cx", function (d) { return (x(d.pca1)); })
    .attr("cy", function (d) { return (y(d.pca2)); })
    .attr("r", radiusZoom)
    .attr("fill", function (d) { return (myColor(d[globalColorChoice])); })
    .attr("fill-opacity", 1.0);

  svg.selectAll("circle")
    .data(data).enter().append("circle")
    .attr("cx", function (d) { return (x(d.pca1)); })
    .attr("cy", function (d) { return (y(d.pca2)); })
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

      if(d.Model!= bmw2002Data.Model){
      // Declare the text to be displayed when not bmw
      var mpg = d.MPG - bmw2002Data[0].MPG;
      var cylinders = d.Cylinders - bmw2002Data[0].Cylinders;
      var displacement = d.Displacement - bmw2002Data[0].Displacement;
      var horsepower = d.Horsepower - bmw2002Data[0].Horsepower;
      var weight = d.Weight - bmw2002Data[0].Weight;
      var acceleration = d.Acceleration - bmw2002Data[0].Acceleration;
      var year = d.Year - bmw2002Data[0].Year;
      var origin = d.Origin;
      }
      else{
        // Declare the text to be displayed when hover over bmw
      var mpg = d.MPG - bmw2002Data[0].MPG;
      var cylinders = d.Cylinders - bmw2002Data[0].Cylinders;
      var displacement = d.Displacement - bmw2002Data[0].Displacement;
      var horsepower = d.Horsepower - bmw2002Data[0].Horsepower;
      var weight = d.Weight - bmw2002Data[0].Weight;
      var acceleration = d.Acceleration - bmw2002Data[0].Acceleration;
      var year = d.Year - bmw2002Data[0].Year;
      var origin = d.Origin;
      }
      var textToDisplay = "Name: " + d.Model +
        "|    MPG: " + floatFormat(mpg, 1) +
        "|    Cylinders: " + floatFormat(cylinders, 1) +
        "|    Displacement: " + floatFormat(displacement, 1) +
        "|    Horsepower: " + floatFormat(horsepower, 1) +
        "|    Weight: " + floatFormat(weight, 1) +
        "|    Acceleration: " + floatFormat(acceleration, 1) +
        "|    Year: " + floatFormat(year, 1) +
        "|    Origin: " + origin;
      
      // Finally, once the mouse is hovered, the stats are displayed
      descriptionTooltip.style("display", "inline")
        .attr("transform", "translate(" + 25 + "," + 240 + ")");
      descriptionTooltip.select("text")
        .text(textToDisplay)
        .style("fill", "#fbcf66");

      var Fdata = data;
      var target = d.Model;
      Fdata = Fdata.filter((dd, ii) => {
        return ((dd.Model == target) || (dd.Model == bmw2002Data[0].Model));
      });
console.log(bmw2002Data);
      //Set bar colors here
      var notBmw = Fdata.filter((dd, ii) => { return (dd.Model == target); });

      // if (globalColorChoice != "Origin") {
      //   // Assign the relative color value here
      //   globalBarColorChoice = myColor(notBmw[globalColorChoice] - bmw2002Data[globalColorChoice]);
      //   globalBmwBarColor = myColor(bmw2002Data[globalColorChoice]);
      //   console.log(globalBarColorChoice);
      // }
      // else {
      //   globalBarColorChoice = myColor(notBmw[globalColorChoice]);
      //   globalBmwBarColor = myColor(bmw2002Data[globalColorChoice]);
      // }
      // globalMyColor = myColor;

      // Now render each of the bar plots
      renderBarChart(Fdata, "Acceleration");
      renderBarChart(Fdata, "MPG");
      renderBarChart(Fdata, "Cylinders");
      renderBarChart(Fdata, "Displacement");
      renderBarChart(Fdata, "Horsepower");
      renderBarChart(Fdata, "Weight");
      renderBarChart(Fdata, "Year");
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
    .text("Principal Component Analysis (values shown on mouse over are relative to bmw 2002 model, absolute values shown in barchart)");

    // legend :(
    svg.append("text")
    .attr("x", (width- 100))
    .attr("y", (height - 250))
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style('fill', '#a9ab93')
    .text("Other Categories: Red(min) Blue(Max)");

    svg.append("text")
    .attr("x", (width- 100))
    .attr("y", (height - 275))
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style('fill', '#a9ab93')
    .text("Origin: Green(US) Blue(Europe) Orange(Japan)");

}



///////////////////////////////////////////////////////////////
/////////////Bar chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////
function renderBarChart(data, divname) {

  // define shape for bar plot
  var margin = { top: 20, right: 30, bottom: 60, left: 120 },
    width = 350 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // Define an svg element for each block of bar plot
  var svg = d3.select("#" + divname)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  // Define linear x axis for barplot (horizontal bar plot)
  var x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[divname])])
    .range([0, width]);


  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    //translate does not work for some reason, [check later]
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // scale band for barplot on Y axis (horizontal plot)
  var y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(function (d) { return d.Model; }))
    .padding(.1);

  svg.append("g")
    .call(d3.axisLeft(y));


  //PLot the rectangles in bar plot
  svg.selectAll("Rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) { return y(d.Model); })
    .attr("width", function (d) { return x(d[divname]);})
    .attr("height", y.bandwidth())
    // .attr("fill", function(d) {return(globalMyColor(d[divname]))});
    .attr("fill", function (d) { return (d.Model == "bmw 2002" ? "#d53e4f" : "#3288bd"); });


  // Add the barplot description below the plot    
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (height + (16 * 3)))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .style('fill', '#ff8544')
    .text(divname);

}



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Main Section/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// A bunch of url's each with slightly differnt meanings, (no time to add a selection tool for loading data)
// jitter: applying small noise to x and y values so that there is no overlap of points

// Original dataset (no pca is computed here)
//const url ="https://raw.githubusercontent.com/ReDevVerse/carsData/main/cars.csv"

// PCA was computed without considering countries (origin) without jittering scatter points
const url = "https://raw.githubusercontent.com/ReDevVerse/carsData/main/pca_cars_noOrigin.csv";


//  PCA was computed without considering countries (origin) with jitter
// const url = "https://raw.githubusercontent.com/ReDevVerse/carsData/main/pca_cars_noOriginJitter.csv";


// PCA was computed with considering countries (origin) with jitter
// const url = "https://raw.githubusercontent.com/ReDevVerse/carsData/main/pca_cars_Jitter.csv";


// PCA was computed without considering countries (origin) with no jitter
// const url = "https://raw.githubusercontent.com/ReDevVerse/carsData/main/pca_cars_noOrigin.csv";



// function to fetch the data from the github repo
const fetchText = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

// Once the data is fetched, convert the strings to integer/float
fetchText(url).then((textData) => {
  const AllData = d3.csvParse(textData);
  AllData.forEach(element => {
    element.Acceleration = +element.Acceleration;
    element.Cylinders = +element.Cylinders;
    element.Displacement = +element.Displacement;
    element.Horsepower = +element.Horsepower;
    element.MPG = +element.MPG;
    element.pca1 = +element.pca1;
    element.pca2 = +element.pca2;
    element.Weight = +element.Weight;
    element.Year = +element.Year;
  });

  // Declare the color choice selector here (will be displayed on the right corner of the screen) 
  var dataColumns = ["MPG", "Acceleration", "Cylinders", "Displacement", "Displacement", "Horsepower", "Weight", "Year", "Origin"];
  const colorList = d3.select("#choiceColor")
    .selectAll("myOptions")
    .data(dataColumns)
    .enter()
    .append("option")
    .text(function (d) { return (d); })
    .attr("value", function (d) { return (d); })
    ;
  renderScatterChart(AllData);

});


//////////////////////////////////////////////////////
/////////////Flow of program/////////////////////////
////////////////////////////////////////////////////

// First in the data loop, csv is fetched and a call is made to renderScatterPlot
// In the data loop, the selection button for the colors is also defined

// scatter function plots a scatter plot, and mouse over action is defined, 
// scatter plot then call renderBarplot based on the selections made in the scatter chart