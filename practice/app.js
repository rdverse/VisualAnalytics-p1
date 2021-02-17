
// Get data from some source
const DUMMY_DATA = [
{id: 'd1', val: 10, reg: 'USA'},
{id: 'd2', val: 30, reg: 'Canada'},
{id: 'd3', val: 20, reg: 'India'},
{id: 'd4', val: 11, reg: 'China'}];

// example bar chart


// save this variable so that we can use this later on
const container = d3.select('div')
    // takes two elements
    .classed('container', true)    
    // for specifying the inline style of dom elemets (dor css is it classed)    
    .style('border', '5px solid blue');

// to add some elements
const bars = container
    // .div will include container as well. so use .bar
    .selectAll('.bar')
    .data(DUMMY_DATA)
    .enter()
    // for every missing element
    .append('div')
    .classed('bar', true)
    .style('width', '50px')
    .style('height', data => (data.val * 15) + 'px');




// Hello world example
// to select class- .some-class , with id - #some-id 
// d3.select('div')
//     //select everything inside the div
//     // select all paragraph elements
//     .selectAll('p')
//     //to bind the selection with the data (can do in advance without data)
//     .data([1,2,3])
//     // tell which paragraphs are missing
//     .enter()
//     // add missing paragraphs to the data
//     .append('p')
//     // add a text node inside of the paragraph element
//     .text(data => data);