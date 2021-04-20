  function drawChord(){
  
  // create the svg area
  var svg = d3.select("#chordRow")
    .append("svg")
      .attr("width", 600)
      .attr("height", 600)
    .append("g")
      .attr("transform", "translate(300,300)")

  // create a matrix
  var matrix = [
    [0,  5871, 8916, 2868],
    [ 1951, 0, 2060, 6171],
    [ 8010, 16145, 0, 8045],
    [ 1013,   990,  940, 0]
  ];

  var matrix = [[0,20,11],
                [20,0,40],
                [15,25,0]
  ];
  var fill = d3.scaleOrdinal()
    .range(colorbrewer.Spectral[6]);

  // 4 groups, so create a vector of 4 colors
  var colors = [ "#440154ff", "#31668dff", "#37b578ff", "#fde725ff"]

  // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
  var res = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)
      (matrix);

  // add the groups on the outer part of the circle
  svg
    .datum(res)
    .append("g")
    .selectAll("g")
    .data(function(d) { 
      //console.log(d.groups);
      return d.groups; })
    .enter()
    .append("g")
    .append("path")
      .style("fill", function(d,i){ return fill(i) })
      .style("stroke", "black")
      .attr("d", d3.arc()
        .innerRadius(200)
        .outerRadius(220)
      )

  // Add the links between groups
  svg
    .datum(res)
    .append("g")
    .selectAll("path")
    .data(function(d) { return d; })
    .enter()
    .append("path")
      .attr("d", d3.ribbon()
        .radius(200)
      )
      .attr("class","arc")
      .style("fill", function(d){ return(fill(d.source.index)) }) // colors depend on the source group. Change to target otherwise.
      .style("stroke", "black")
          .attr("id",function(d,i){return "group"+i;});


      svg.selectAll('labs')
      .data(res.groups)
      .enter()
      .append("text")
      //.each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr("dx", 5)
      .attr("dy", 35)
      .attr("transform", d => `
      rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
      translate(${200 + 5})
      ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}
    `)
      .attr("text-anchor", d => (d.startAngle + d.endAngle) / 2 > Math.PI ? "end" : null)
      .text(d => "srv" + d.index);
    }

