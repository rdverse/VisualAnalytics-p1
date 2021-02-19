

function update(){
  carname = svg.select("#DisplayStats");
    
  circles.enter()
      .append("circle")
      .attr("class", "dot");
  
  circles.exit().remove();
  
  // "update" mode
  circles.attr("cx", function(d) {
          return x(d.pca1);
      })
      .attr("cy", function(d) {
          return y(d.pca2);
      })
      .style("fill", function(d) {
          return color(d.Origin);
      })
      .attr("r", 5);
  
  circles.on("mouseover", function(d) {
          d3.select(this)
              .transition()
              .duration(10)
              .attr("r", 8);
          carname.text("Name of selected car: " + d.Model);
      })
      .on("mouseout", function() {
          d3.select(this)
              .transition()
              .duration(10)
              .attr("r", 5);
          carname.text("Name of selected car: ____");
  
      })

}




///////////////////////////////////////////////////////////////
/////////////Scatter Chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////
// chart rendering algorithm
const renderScatterChart = (data) => {
  var margin = {top: 20, right: 30, bottom: 60, left: 40},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  radius = 3, 
  radiusZoom =12;


var svg = d3.select("#PCAscatter")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
  
///////////////////////////////

  // Add X axis
  var x = d3.scaleLinear()
  .domain([d3.min(data, d=>d.pca1), d3.max(data, d=>d.pca1)])
  .range([0,width]);

  // console.log(x);
  
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  //translate does not work for some reason, [check later]
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleLinear()
  .range([ 0, height])
  .domain([d3.min(data, d=>d.pca1), d3.max(data, d=>d.pca1)]);
  
svg.append("g")
  .call(d3.axisLeft(y));
///////////////////////
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
 
 ///////define tooltip for mouse hovering
 
 //points
 svg.selectAll("circle")
    .data(data).enter().append("circle")
    // a
    .attr("cx", function(d){return(x(d.pca1));})
    .attr("cy", function(d) { return(y(d.pca2));})
    // .attr("width", function(d) { return x(d[divname]);})
    .attr("r", radius)
    .attr("fill", "#081d58")
    .attr("fill-opacity", 0.4)
    .on('mouseover', function (i, d) {
      d3.select(this).transition()
          .duration('100')
          .attr("r", radiusZoom);
      var xCoord = d3.mouse(this)[0] + 20;
      var yCoord = d3.mouse(this)[0] - 10;
      console.log(xCoord);
      console.log(yCoord);

      // div.transition()
      //     .duration(100)
      //     .style("opacity", 1);
          
      // div.html("$" + d3.format(".2f")(d.Model))
      //     .style("left", (d3.event.pageX + 10) + "px")
      //     .style("top", (d3.event.pageY - 15) + "px");
  })
  .on('mouseout', function (d, i) {
      d3.select(this).transition()
          .duration('300')
          .attr("r", radius);
      // div.transition()
      //     .duration('300')
      //     .style("opacity", 0);
  });




    console.log(data.filter((d,i)=>{return d.Model=="bmw 2002"}));
    svg.selectAll("circlebmw")
    .data(data.filter((d,i)=>{return d.Model=="bmw 2002"}))
    .enter().append("circle")
    .attr("cx", function(d){return(x(d.pca1));})
    .attr("cy", function(d) { return(y(d.pca2));})
    // .attr("width", function(d) { return x(d[divname]);})
    .attr("r", radius)
    .attr("fill", "red")
    .attr("fill-opacity", 1.0);
    

    // var circles = svg.selectAll(".dot")
    // .data(data);
  //   d3.selectAll('select').on('change', function() {
  //     update();
  // });


  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", (height+(16*3)))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")
    .style('fill', 'blue')  
    .text("Principal Component Analysis");  

  //   svg.append("g")
  //   .attr("fill", "none")
  //   .attr("pointer-events", "all")
  // .selectAll("rect")
  // .data(d3.pairs(data))
  // .join("rect")
  //   .attr("x", ([a, b]) => x(a.date))
  //   .attr("height", height)
  //   .attr("width", ([a, b]) => x(b.date) - x(a.date))
  //   .on("mouseover", (event, [a]) => tooltip.show(a))
  //   .on("mouseout", () => tooltip.hide());

// svg.append(() => tooltip.node);

// return svg.node();


  
  
  
  
  
  };





///////////////////////////////////////////////////////////////
/////////////Bar chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////
// chart rendering algorithm
const renderBarChart = (data, divname) => {
  var margin = {top: 20, right: 30, bottom: 60, left: 120},
  width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

var svg = d3.select("#" + divname)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
  


  // Add X axis
  var x = d3.scaleLinear()
  .domain([0, d3.max(data, d=>d[divname])])
  .range([0,width]);

  // console.log(x);
  
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  //translate does not work for some reason, [check later]
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data.map(function(d) { return d.Model; }))
  .padding(.1);
  
svg.append("g")
  .call(d3.axisLeft(y));


//     d3.select('select')
//     .on("change", function() {

//     key = this.selectedIndex;
// console.log(key);
//   });

 //Bars
 svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Model); })
    .attr("width", function(d) { return x(d[divname]); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#69b3a2");
        
  svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", (height+(16*3)))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")
    .style('fill', 'blue')  
    .text(divname);  
    };


//const url ="https://raw.githubusercontent.com/ReDevVerse/carsData/main/cars.csv"
const url = "https://raw.githubusercontent.com/ReDevVerse/carsData/main/pca_cars_noOrigin.csv";
// function to fetch the data from the github repo
const fetchText = async(url) => {
    const response = await fetch(url);
    return await response.text();
};


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
// console.log(AllData);

const DUMMY_DATA = [
    {id: 'd1', val: 10, reg: 'USA'},
    {id: 'd2', val: 30, reg: 'Canada'},
    {id: 'd3', val: 20, reg: 'India'},
    {id: 'd4', val: 11, reg: 'China'}];
renderScatterChart(AllData);
renderBarChart(AllData.filter((d,i)=>{return i<6}), "Acceleration");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"MPG");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Cylinders");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Displacement");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Horsepower");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Weight");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Year");
// update();
});



