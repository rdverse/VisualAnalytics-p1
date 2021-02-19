
// const width = 1000;
// const height = 600;
var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select('#my')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// const width = +svg.attr('width');
// const height = +svg.attr('height');

///////////////////////////////////////////////////////////////
/////////////Chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////
// chart rendering algorithm
const renderChart = data => {
    
      // Add X axis
  var x = d3.scaleLinear()
  .domain([0, 100])
  .range([ 0, width]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data.map(function(d) { return d.Model; }))
  .padding(.1);
  
svg.append("g")
  .call(d3.axisLeft(y));
    console.log(data);
 //Bars
 svg.selectAll("myRect")
 .data(data)
 .enter()
 .append("rect")
 .attr("x", x(0) )
 .attr("y", function(d) { return y(d.Model); })
 .attr("width", function(d) { return x(d.Acceleration); })
 .attr("height", y.bandwidth() )
 .attr("fill", "#69b3a2")
    
        // .attr('width', d => xScale(xValue(d)))
        // .attr('heigth', yScale.bandwidth());
    
    };



const url ="https://raw.githubusercontent.com/ReDevVerse/carsData/main/cars.csv"
 
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
    element.Origin = +element.Origin;
    element.Weight = +element.Weight;
    element.Year = +element.Year;
});
// console.log(AllData);

const DUMMY_DATA = [
    {id: 'd1', val: 10, reg: 'USA'},
    {id: 'd2', val: 30, reg: 'Canada'},
    {id: 'd3', val: 20, reg: 'India'},
    {id: 'd4', val: 11, reg: 'China'}];
renderChart(AllData);
});

