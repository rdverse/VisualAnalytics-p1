
// const width = 1000;
// const height = 600;

// const width = +svg.attr('width');
// const height = +svg.attr('height');

///////////////////////////////////////////////////////////////
/////////////Chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////
// chart rendering algorithm
const renderBarChart = (data, divname) => {
  var margin = {top: 20, right: 30, bottom: 60, left: 120},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

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
  console.log(divname);  
  console.log(data);

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
        // .text(divname);

        // .style("text-anchor", "middle")
        // .style('fill', 'darkOrange')
        // .style('font-size', '20px')
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

renderBarChart(AllData.filter((d,i)=>{return i<6}), "Acceleration");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"MPG");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Cylinders");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Displacement");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Horsepower");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Weight");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Year");
});



