const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

///////////////////////////////////////////////////////////////
/////////////Chart Renderer///////////////////////////////////
/////////////////////////////////////////////////////////////
// chart rendering algorithm
const renderChart = data => {

    
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', 300)
        .attr('heigth', 300);
    
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
renderChart(DUMMY_DATA);
});

