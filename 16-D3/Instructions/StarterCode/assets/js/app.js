// @TODO: YOUR CODE HERE!
// d3.csv("../StarterCode/assets/data/data.csv")
//   .then(function(stateData) {
//       console.log(stateData)
//   });

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("../StarterCode/assets/data/data.csv", function(err, stateData) {
     if (err) throw err;
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    // data.povertyMoe = parsefloat(data.povertyMoe);
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(stateData, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.income)])
      .range([height, 0]);

  //   // Step 2: Create scale functions
  //   // ==============================
  //   var xLinearScale = d3.scaleLinear()
  //   .domain([20, d3.max(stateData, d => d.age)])
  //   .range([0, width]);

  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(stateData, d => d.income)])
  //   .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(stateData).enter()
    var circ = circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5")

    // Step 6: Create State names in the Circles
    // ==============================
    circlesGroup
    .append("text")
    .attr("x", d => xLinearScale(d.age))
    .attr("y", d => yLinearScale(d.income))
    .attr("fill", "black")
    .attr("font-size", "7.5px")
    .text(d => d.abbr)
    
    // circlesGroup
    // .append("Text")
    // .attr("x", d => xLinearScale(d.age)-15/2)
    // .attr("y", d => yLinearScale(d.income)+15/2)
    // .attr("r", "15")
    // // .attr("fill", "black")
    // .attr("font-family", "sans-serif")
    // .attr("font-size", "10px")
    // .text(d=>d.abbr);
    // // .attr("opacity", ".5");
    
    

    // // Step 6: Initialize tool tip
    // // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Age: ${d.age}<br> Income: ${d.income}`);
      });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    circ.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    circ.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age");
  });
