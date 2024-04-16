var margin = {top: 10, right: 30, bottom: 50, left: 70}, 
    width = 500 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#bubblechart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read the data from tech.csv
d3.csv("tech.csv").then(function(data) {

  data.forEach(function(d) {
    d.pe_ratio = +d.pe_ratio;
    d.pfcf_ratio = +d.pfcf_ratio;
    d.return_on_equity = +d.return_on_equity;
  });

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.pe_ratio; })])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.pfcf_ratio; })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([0, d3.max(data, function(d) { return d.return_on_equity; })])
    .range([2, 30]); // Bubble size

  // Add a tooltip div. Invisible by default.
  var tooltip = d3.select("#bubblechart")
    .append("div")
    .attr("class", "tooltip");

  // Add bubbles
  svg.selectAll(".bubble")
    .data(data)
    .enter().append("circle")
    .attr("class", "bubble")
    .attr("cx", function(d) { return x(d.pe_ratio); })
    .attr("cy", function(d) { return y(d.pfcf_ratio); })
    .attr("r", function(d) { return z(d.return_on_equity); }) 
    .style("fill", "#69b3a2")
    .on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html("Ticker: " + d.Ticker + "<br/>PE Ratio: " + d.pe_ratio + "<br/>P/FCF Ratio: " + d.pfcf_ratio + "<br/>ROE: " + d.return_on_equity)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

    function createLegend() {
      // Example ROE values to show in the legend
      var exampleROEValues = [25, 50, 100];
  
      // Create a group for the legend
      var legend = svg.append("g")
        .attr("transform", "translate(" + (width - 70) + ", 30)"); // Position the legend
  
      // Append circles to legend
      legend.selectAll("legendCircles")
        .data(exampleROEValues)
        .enter()
        .append("circle")
          .attr("cy", function(d, i) { return i * 45; }) 
          .attr("r", function(d) { return z(d); }) 
          .style("fill", "none")
          .style("stroke", "#555");
  
      // Append text to legend
      legend.selectAll("legendLabels")
        .data(exampleROEValues)
        .enter()
        .append("text")
          .attr("y", function(d, i) { return i * 40; })
          .attr("x", function(d) { return z(d) + 10; }) 
          .text(function(d) { return d + "% ROE"; }) 
          .style("font-size", "12px")
          .attr("alignment-baseline", "middle");
  }
  
  createLegend();

  // Labels for the x-axis and y-axis
  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("PE Ratio");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("PFCF Ratio");
}).catch(function(error){
  console.error('Error loading the CSV file', error);
});

