////////////////////////////////////////////////////////////////////////////////////
/////////////////////Global variables to be used in most functions//////////////////
////////////////////////////////////////////////////////////////////////////////////
var sqDim  = 25;
var offset = 200;
// attribute the mouse hovered over
var hoverOnAttribute;
var hoverOnData;


var globalRowChoice;
var globalColChoice;

var allValues = new Array();


jsonData = jsonData["documents"]["document"];

function wrap(text, width) {
   text.each(function () {
       var text = d3.select(this),
           words = text.text().split(/\s+/).reverse(),
           word,
           line = [],
           lineNumber = 0,
           lineHeight = 1.1, // ems
           x = text.attr("x"),
           y = text.attr("y"),
           dy = 0, //parseFloat(text.attr("dy")),
           tspan = text.text(null)
                       .append("tspan")
                       .attr("x", x)
                       .attr("y", y)
                       .attr("dy", dy + "em");
       while (word = words.pop()) {
           line.push(word);
           tspan.text(line.join(" "));
           if (tspan.node().getComputedTextLength() > width) {
               line.pop();
               tspan.text(line.join(" "));
               line = [word];
               tspan = text.append("tspan")
                           .attr("x", x)
                           .attr("y", y)
                           .attr("dy", ++lineNumber * lineHeight + dy + "em")
                           .text(word);
           }
       }
   });
}


// function to fetch the data from the github repo
const fetchText = async (url) => {
   const response = await fetch(url);
   return await response.text();
 };

var gData;
/////////////////////////////////////////////////////////////////////
/////////////////////////getData////////////////////////////////////
/////////////////Function to get the array data/////////////////////
////////////////////////////////////////////////////////////////////
function getData() {
   var data = new Array();
   var url = 'https://raw.githubusercontent.com/ReDevVerse/carsData/main/matrix.csv';
      // Once the data is fetched, convert the strings to integer/float
fetchText(url).then((textData) => {
   const AllData = d3.csvParse(textData);
   //console.log(AllData);
   //console.log(d3.max(AllData.map(function(d){return(d[0].value);})));
   
   var xpos = offset;
   var ypos = offset;
   
   for(let i=0;i<AllData.length;i++){
      
     // data.push( new Array() );
      var j=0;
      var indexRow='';
      data.push(new Array());

      //allValues.push(new Array());
      for (const [key, value] of Object.entries(AllData[i])) {
         if(key==0){
            indexRow = value;
         }
         
         else{
         data[i].push({
            "indexRow": indexRow,
               "indexCol": key,
               "i" : i,
               "j":j,
               "value" : +value,
               "x" : xpos,
               "y" :ypos,
               "r": (i/5)*255,
               "g": (j/4)*255,
   				"width": sqDim,
				   "height": sqDim,
               "clicked":false
         }); 
      }  
      allValues.push(+value);
      xpos+=sqDim; 
      j++;
       }
       xpos=offset;
       ypos+=sqDim;
   }   
//   gridData = data;
drawGrid(data);
});
//console.log(data);
}


////////////////////////////////////////////////////////////////////////
/////////////////////////displayDocs////////////////////////////////////
/////////////////Function to display docs associated with selection/////
///////////////////////////////////////////////////////////////////////
function displayDocs(){

   var filteredDocNames = new Array();
   for(let i=0;i<jsonData.length;i++){

      if(jsonData[i].hasOwnProperty(hoverOnAttribute)){
         //console.log(jsonData[i][hoverOnAttribute].length);
      for(let j=0;j<jsonData[i][hoverOnAttribute].length;j++){
    {  
       if(jsonData[i][hoverOnAttribute][j]==hoverOnData){
         filteredDocNames.push(jsonData[i].docID);
       }
      }
   } 
   }

}
docChoice(filteredDocNames);
}

function docChoice(filteredDocNames){

    d3.select("#availableDocs").selectAll("svg").remove();

   var svg = d3.select("#availableDocs")
    	.append("svg")
        	.attr("width","600")
        	.attr("height","60");

   var text = svg.selectAll('docTextChoice')
   .data(filteredDocNames)
  .enter().append('text')
   .attr("x", function(d,i){return(10 + i*60)})
   .attr("y", function(d,i){return 50})
   .attr("fill", "#000")
   .text(function(d){return d})
   .on('click', function(d) {
      
      var docToShow = d.path[0].__data__;
      displayDocText(docToShow);   
   });
}

function displayDocText(docToShow){
var selectDocText =  jsonData.filter((dd, ii) => {
   return (dd.docID == docToShow);
 });
 //selectDocText = selectDocText[0];
 console.log(selectDocText);

 d3.select("#docViewer").selectAll("svg").remove();

 var svg = d3.select("#docViewer")
     .append("svg")
         .attr("width","1000")
         .attr("height","1000");

 var text = svg.selectAll('docText')
 .data(selectDocText)
.enter().append('text')
.attr("class", "docText")
 .attr("x", function(d,i){return(10)})
 .attr("y", function(d,i){return 50})
 .attr("fill", "#000")
 .text(function(d){console.log(d.docText);return d.docText})
 .call(wrap,500);

//  d3plus.textwrap()
//  .container(d3.select('#docViewer'))
//  .draw();
}

   

/////////////////////////////////////////////////////////////////////
/////////////////////////drawGrid////////////////////////////////////
/////////////////Function to draw the grid/////////////////////
////////////////////////////////////////////////////////////////////

function drawGrid(gridData) {
gData = gridData;
   //d3.selectAll("svg").remove();
   //console.log(gridData);

// var rowNames =  d3.scaleLinear()
// .domain([0, d3.max(data, d => d.x)])
// .range([0, width]);
//var colNames

   var grid = d3.select("#grid")
	.append("svg")
	.attr("width","1400")
	.attr("height","1400");
	
// First draw rows
var row = grid.selectAll("row")
   .data(gridData)
	.enter()
    .append("g")
	.attr("class", "row");
	
   var color1 = d3.scaleLinear()
   .domain([0, d3.max(allValues)])
   .range(['white', 'blue'])
   .interpolate(d3.interpolateHcl);
//console.log(d3.max(allValues));

// draw columns on top of the rows
var column = row.selectAll("square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
   //.style("fill", function(d){return("rgb(" + 100 + "," + 100 + ",255)");})
	//.style("fill", function(d){return("rgb(" + 250 + "," + 250 + ","+ d.value*100 +")");})
   .style("fill", function(d){return(color1(d.value));})
   .style("stroke", "rgb(255,255,255)")
   .on('click', function(d) {


      var dataPoint;
      for(let i=0;i<gridData.length;i++){

         for(let j=0;j<gridData[i].length;j++){
         if((gridData[i][j].x==d.path[0].__data__.x)&(gridData[i][j].y==d.path[0].__data__.y)){
            dataPoint=gridData[i][j];
         }
      } 
   }  
   
  // displayDocs(dataPoint);

   //console.log(dataPoint);  
      if(gridData[dataPoint.i][dataPoint.j].clicked){
         d3.select(this).transition().duration('400').style("fill",color1(dataPoint.value));
         
         gridData[dataPoint.i][dataPoint.j].clicked=false;
         //console.log(this);
      }

      else{
         d3.select(this).transition().duration('400').style("fill","rgb(90,90,90)");
         gridData[dataPoint.i][dataPoint.j].clicked=true;
      }
         
   });

 


var dataCols = new Array();
var dataRows = new Array(); 

for(let i=0;i<gridData.length;i++){
//console.log(gridData[i].length);
     for(let j=0;j<gridData[i].length;j++){
   if(j==0){
      dataRows.push(gridData[i][j]);
   }
   if(i==0){
      dataCols.push(gridData[i][j]);
   }
   }
}

//console.log(dataRows[0].indexRow);
//console.log(dataRows[0].indexRow);

  // Define linear x axis for barplot (horizontal bar plot)
  var rowText = d3.scaleBand()
    .domain(dataRows.map(function(d){return d.indexRow}))
    .range([offset, d3.max(dataRows, d => d.y)+sqDim]);


  row.append("g")
//    .attr("transform", "translate(0," + 90 + ")")
    .call(d3.axisLeft(rowText))
    .selectAll("text")
    //translate to push the names towards right and rotate the labels
    .attr("transform", "translate(" +offset+",0)rotate(0)")
    .style("text-anchor", "end") .on('mouseover', function(d) {
      //console.log("this"); 
      //console.log(this);
      //console.log("d");
      hoverOnData = d.path[0].__data__;
      hoverOnAttribute = globalRowChoice;
      displayDocs();
      
         
   });


    var colText = d3.scaleBand()
    .domain(dataCols.map(function(d){return d.indexCol}))
    .range([offset+sqDim+sqDim/2, d3.max(dataCols, d => d.x)+sqDim+sqDim/2]);


  row.append("g")
//    .attr("transform", "translate(0," + 90 + ")")
    .call(d3.axisTop(colText))
    .selectAll("text")
    //translate to push the names towards right and rotate the labels
    .attr("transform", "translate(0,"+offset+")rotate(-90)")
    .style("text-anchor", "start");

}

// reset to default when the reset button is clicked
function resetState(){
	gridData = getData();
	//drawGrid();
	}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////choice buttons//////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
  // Declare the color choice selector here (will be displayed on the right corner of the screen) 
  var dataColumns = ["Person", "Location", "Phone", "Date", "Organization"];
  const choiceRow = d3.select("#choiceRow")
    .selectAll("optionsRow")
    .data(dataColumns)
    .enter()
    .append("option")
    .text(function (d) { return (d); })
    .attr("value", function (d) { return (d); })
    ;

    const choiceCol = d3.select("#choiceCol")
    .selectAll("optionsCol")
    .data(dataColumns)
    .enter()
    .append("option")
    .text(function (d) { return (d); })
    .attr("value", function (d) { return (d); })
    ;

    d3.select("#choiceRow")
    .on("change", function (d) {
      //  console.log("choiseeeeeeeeeeee");
      globalRowChoice = d3.select(this).property("value");
      console.log(globalRowChoice);
      //d3.selectAll("svg").remove();
     // renderScatterChart(data);
    });
    d3.select("#choiceCol")
    .on("change", function (d) {
      globalColChoice = d3.select(this).property("value");
     // d3.selectAll("svg").remove();
     // renderScatterChart(data);
    });



// var jsonTest;
// console.log("fesfa");
// d3.json('https://raw.githubusercontent.com/ReDevVerse/carsData/main/testJson.json', function(error,dat){
// console.log(error);
// console.log(dat);
// console.log('sdf');
// });
// get initial data
getData();
//drawGrid(gridData);
drawChord()