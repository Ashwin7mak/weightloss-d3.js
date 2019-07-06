var width = 700 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
//Create date parser
var ParseDate = d3.time.format("%d-%b-%y").parse;
//Create x and y scale to scale inputs
var xScale = d3.time.scale().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);

//Create x and y axes
var xAxis = d3.svg.axis().scale(xScale)
    .orient("bottom")
    .ticks(5);
var yAxis = d3.svg.axis().scale(yScale)
    .orient("left")
    .ticks(5);

//Create a line generator
var valueline = d3.svg.line()
    .x(function (d) {
        return xScale(d.date);
    })

    .y(function (d) {
        return yScale(d.close);
    });

//Create an SVG element and append it to the DOM
var svgElement = d3.select("body").append("svg")
    .attr({ "width": width + margin.left + margin.right, "height": height + margin.top + margin.bottom })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read TSV file
d3.csv("weight.csv", function (data) {
    //Parse Data into useable format
    data.forEach(function (d) {
        d.date = ParseDate(d.date);
        d.close = +d.close;
        //the + sign converts string automagically to number
    });

    //Set the domains of our scales
    xScale.domain(d3.extent(data, function (d) { return d.date; }));
    yScale.domain([0, d3.max(data, function (d) { return d.close; })]);

    //append the svg path
    var path = svgElement.append("path")
        .attr("d", valueline(data));

    //Add X Axis
    var x = svgElement.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    //Add Y Axis
    var y = svgElement.append("g")
        .call(yAxis);

    //Add label to y axis
    y.append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");
});