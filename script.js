//setting dimensions and margins
var margin = {top: 10, right: 30, bottom: 50, left: 70}, 
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//load csv file
d3.csv("aggregated_2022.csv").then(function(data) {

    //add svg object
    var svg = d3.select("#scatterplot").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    

    //add x axis
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return +d.pe_ratio; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    //text label for x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("PE Ratio");

    //add y axis
    var y = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return +d.pfcf_ratio; }))
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    //text label for y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("PFCF Ratio");  

    //making tooltip
    var tooltip = d3.select("body").append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    var mouseover = function(event, d) {
      tooltip
        .style("opacity", 1);
    };

    var mousemove = function(event, d) {
      tooltip
        .html("Ticker: " + d.Ticker + "<br>PE Ratio: " + d.pe_ratio + "<br>PFCF Ratio: " + d.pfcf_ratio)
        .style("left", (event.x) + "px")
        .style("top", (event.y) + "px");
    };

    var mouseleave = function(event, d) {
      tooltip
        .style("opacity", 0);
    };

   //adding dots and labels
svg.append('g')
.selectAll("dot")
.data(data)
.enter()
.append("circle")
  .attr("cx", function (d) { return x(+d.pe_ratio); })
  .attr("cy", function (d) { return y(+d.pfcf_ratio); })
  .attr("r", 6) 
  .style("fill", "blue")
  .style("opacity", 0.7)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

//adding labels for each dot
svg.append('g')
.selectAll("text")
.data(data)
.enter()
.append("text")
  .attr("x", function(d) { return x(+d.pe_ratio); })
  .attr("y", function(d) { return y(+d.pfcf_ratio); })
  .attr("dx", 8) // to position the text a bit to the right of the dot
  .attr("dy", -10) // to position the text a bit above the dot
  .text(function(d) { return d.Ticker; })
  .attr("font-size", "10px")
  .attr("fill", "black");

}).catch(function(error){
    console.error('Error loading the CSV file', error);
});