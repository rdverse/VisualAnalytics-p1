

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
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  radius = 3, 
  radiusZoom =12;

var bmw2002Data = data.filter((d,i)=>{return d.Model=="bmw 2002"});
console.log(bmw2002Data);
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
 

//  var descriptionTooltip = d3.select("#PCAscatter")
//   .append("svg")
//   .attr("width", 500)
//   .attr("height", 50)
//   .attr("x",0)
//   .attr("y",0)
//   .append("g")
//   .attr("transform",
//     "translate(" + 10 + "," + 10 + ")");

  var descriptionTooltip = svg.append("g")
                .attr("class", "tooltip")
                .style("display", "inline");

//  var descriptionTooltip = d3.select("#DisplatStats").append("svg")
//  .append("g")
//  .attr("class", "tooltip")
//  .style("display", "inline");
 
        
//  descriptionTooltip.append("g:rect")
//  .attr("width", 250)
//  .attr("height", 100)
//  .attr("x", 30)
//  .attr("y", "1.2em")
//  .attr("fill", "red")
//  .style("opacity", 0.5);


 descriptionTooltip.append("g:text")
        .attr("x", 30)
        .attr("y", "1.2em")
        .style("text-anchor", "left")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
        
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
    .on('pointerover', function (p, d) {
      d3.select(this).transition()
          .duration('100')
          .attr("r", radiusZoom);
      
  
      descriptionTooltip.style("display", "inline")
          .attr("transform", "translate(" + 25 + "," + 400 + ")");
    
        var floatFormat = d3.format(".1f");
    
    var mpg = d.MPG - bmw2002Data[0].MPG;
    var cylinders = d.Cylinders - bmw2002Data[0].Cylinders;
    var displacement = d.Displacement - bmw2002Data[0].Displacement;
    var horsepower = d.Horsepower - bmw2002Data[0].Horsepower;
    var weight = d.Weight - bmw2002Data[0].Weight;
    var acceleration = d.Acceleration - bmw2002Data[0].Acceleration;
    var year = d.Year - bmw2002Data[0].Year;
    var origin = d.Origin - bmw2002Data[0].Origin;

// console.log(d.Weight);

    var textToDisplay = "Name: " + d.Model + 
                  " MPG: " + floatFormat(mpg,1) +
                  " Cylinders: " + floatFormat(cylinders,1)+
                  " Displacement: " + floatFormat(displacement,1) +
                  " Horsepower: " + floatFormat(horsepower,1) +
                  " Weight: " + floatFormat(weight,1) +
                  " Acceleration: " + floatFormat(acceleration,1) +
                  " Year: " + floatFormat(year,1);
          descriptionTooltip.select("text")
      .text(textToDisplay);

      // .enter()
      // .append("text")
      // .text(function(d){return(d.name);});
      // var xCoord = d3.pointer(Event)[0] + 20;
      // var yCoord = d3.pointer(Event)[0] - 10;
      // var xCoord = d3.event.pageX;
      // var yCoord = d3.event.pageY;
      
      // console.log(p.x);
      // console.log(p.y);

      // div.transition()
      //     .duration(100)
      //     .style("opacity", 1);
          
      // div.html("$" + d3.format(".2f")(d.Model))
      //     .style("left", (d3.event.pageX + 10) + "px")
      //     .style("top", (d3.event.pageY - 15) + "px");
  })
  .on('pointerout', function (d, i) {
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
    
  d3.select("#choice1").on("change", function(d){
    selectedGroup = this.value;
    console.log(selectedGroup);
  })

  
  };



    
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////Main Section/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

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


renderScatterChart(AllData);

//add selection criteria here
// Once the user makes a choise, 
// all graphs will be updated with that value

d3.select("#choice1")
  .selectAll('myOptions')
  .data(AllData).enter()
  .append("option")
  .text(function(d){return(d.Model)})
  .attr("value", function(d){return d;})





renderBarChart(AllData.filter((d,i)=>{return i<6}), "Acceleration");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"MPG");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Cylinders");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Displacement");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Horsepower");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Weight");
renderBarChart(AllData.filter((d,i)=>{return i<8}),"Year");


// update();
});



