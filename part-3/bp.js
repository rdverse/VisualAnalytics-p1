// Url for data
import {
    select,
    csv,
    scaleLinear,
    max,
    scaleBand,
    axisLeft,
    axisBottom,
    format
  } from 'd3';

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

////////////////////////////////////////////////////////////////
const render = data => {
    const xValue = d => d['Acceleration'];
    const yValue = d => d.Model;
    const margin = { top: 50, right: 40, bottom: 77, left: 180 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = scaleLinear()
      .domain([0, max(data, xValue)])
      .range([0, innerWidth]);
    
    const yScale = scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.1);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxisTickFormat = number =>
      format('.3s')(number)
        .replace('G', 'B');
    
    const xAxis = axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight);
    
    g.append('g')
      .call(axisLeft(yScale))
      .selectAll('.domain, .tick line')
        .remove();
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 65)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabelText);
    
    g.selectAll('rect').data(data)
      .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(titleText);
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
render(newData);
});

