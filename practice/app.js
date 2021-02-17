// Get data from some source
const DUMMY_DATA = [
{id: 'd1', val: 10, reg: 'USA'},
{id: 'd2', val: 30, reg: 'Canada'},
{id: 'd3', val: 20, reg: 'India'},
{id: 'd4', val: 11, reg: 'China'}];

// example bar chart

// for scaling the bars
// they give information about x and y axes
// values where the data should be positioned
const xScale = d3.scaleBand()
    .domain(DUMMY_DATA.map(dataPoint =>dataPoint.reg))
    .rangeRound([0, 250])
    .padding(0.3);
const yScale = d3.scaleLinear().domain([0, 35]).range([750, 0]);
 
//svg uses coordinate systems / moving from css
// save this variable so that we can use this later on
const container = d3.select('svg').append("g")
    // takes two elements
    .classed('container', true);    
    // for specifying the inline style of dom elemets (dor css is it classed)    
    // moved this to index.js
    // .style('border', '5px solid blue');

// to add some elements
 bars = container
    // .div will include container as well. so use .bar
    .selectAll('.bar')
    .data(DUMMY_DATA)
    .enter()
    // for every missing element
    .append('rect')
    .classed('bar', true)
    .attr('width', xScale.bandwidth())
    .attr('height', (data) => 750 - yScale(data.val))
    .attr('x', data => xScale(data.reg))
    .attr('y', data => yScale(data.val));



function xAxis()


// bars.selectAll("text")
//     .data(DUMMY_DATA)
//     .enter()
//     .append("text")
    
//     .text((data) => data.reg)
//     .attr("x", data => {return xScale(data.reg);
//     })

//     .attr("y", (data) => 750 - yScale(data.val) + 14)

//     .attr("font-family" , "sans-serif")

//     .attr("font-size" , "11px")

//     .attr("fill" , "white")

//    .attr("text-anchor", "middle");

// bars.append("text")
//         .text((DUMMY_DATA) => DUMMY_DATA.reg)
//         .attr("x", (data)=> {console.logxScale(data.reg) +15})
//         .attr("y", (data)=> yScale(data.val) - 5)
//         .attr("font-family" , "sans-serif")
//         .attr("font-size" , "14px")
//         .attr("fill" , "black")
//         .attr("text-anchor", "middle");

    //exit is opposite of enter, it tells which elements is too much and 
    // have to be removed
    // setTimeout(() =>{
    //     bars.data(DUMMY_DATA.slice(0,2)).exit().remove();
    // }, 2000)
    // setTimeout(() =>{
    //     bars.data(DUMMY_DATA.slice(0,2)).exit().remove();
    // }, 2000)