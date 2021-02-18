// Url for data


//fetch the promise text
//This is the main function body
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

///////////////////////////////////////////////////////////////
/////////////Chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////
// chart rendering algorithm
const renderChart = data => {

    // set the dimensions and margins of the graph
// var margin = {top: 30, right: 20, bottom: 30, left: 50},
//     width = 250 - margin.left - margin.right,
//     height = 250 - margin.top - margin.bottom;

    // const xValue = data.Model;
    // const yValue = data.Acceleration;

    
    // console.log(data => data.Acceleration);
    // console.log(xValue);
    // console.log(yValue);

    const xValue = d => d.Model;
    const yValue = d => d.Acceleration;

   
    console.log(width);
    console.log(height);
   
    const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, xValue)])
            .range([0, width]);
        // .range();
        // console.log(xScale.domain());
    const yScale = d3.scaleBand()
            .domain(data.map(yValue))
            .range([0, height]);
    console.log(data);

    console.log(xScale.range());

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('x', d => yScale(xValue(d)))
        .attr('width', 300)
        .attr('heigth', 300);
    
        // .attr('width', d => xScale(xValue(d)))
        // .attr('heigth', yScale.bandwidth());
    
    };


///////////////////////////////////////////////////////////////
/////////////Data Loading///////////////////////////////////
/////////////////////////////////////////////////////////////
// Data loading here

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

const newData = AllData.filter(function(d,i) {return(i<5);});
renderChart(newData);
});

