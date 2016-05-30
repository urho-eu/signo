/**
 *
 * Display activity chart using dummy data: steps.csv
 */
jQuery(document).ready(function()
{
  d3.csv("js/data/steps.csv", function(data) {

    var chartSelector = ".chart.activity";
    var height = 200;
    var padding = 50;
    var margin = { top: 10, right: 10, bottom: 10, left: 10 };

    width = parseInt(d3.select(chartSelector).style("width"));
    //height = parseInt(d3.select(chartSelector).style("height"));

    var maxSteps = d3.max(data, function(d) {
      return Number(d.Steps);
    });
    console.log('w x h', width + ' x ' + height);

    var minDate = new Date(data[0].Timestamp * 1000);
    var maxDate = new Date(data[data.length - 1].Timestamp * 1000);
    console.log("min - max date" + minDate + " -> " + maxDate);

    // create an svg container
    var vis = d3.select(chartSelector)
      .append("svg")
          .attr("class", "steps")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      //~ .append("g")
          //~ .attr("transform",
                //~ "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.time.scale()
      .domain([minDate, maxDate])
      .range([padding, width]);

    var yScale = d3.scale.linear()
      .domain([0, maxSteps])
      .range([height - padding, padding]);

    var yAxis = d3.svg.axis()
      .orient("left")
      .scale(yScale)
      .ticks(5);

    var xAxis = d3.svg.axis()
      .orient("bottom")
      .scale(xScale);

    var steps = d3.svg.line()
      .x(function(d) {
        return xScale(d.Timestamp * 1000);
      })
      .y(function(d) {
        return yScale(d.Steps);
      });

    vis.append("path")
      .attr("class", "line steps")
      .attr("d", steps(data));

    vis.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);

    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (height - padding) + ")")
      .call(xAxis);

    vis.selectAll(".x.axis text")
      .attr("transform", function(d) {
      return "translate(" + this.getBBox().height + ", " + this.getBBox().height + ") rotate(45)";
      });

    // legend
    vis.append("svg:rect")
      .attr("class", "legend bar steps")
      .attr("x", 10)
      .attr("y", 20)
      .attr("height", 2)
      .attr("width", 40);

    vis.append("svg:text")
      .attr("x", 60)
      .attr("y", 25)
      .text("Step counts");

    // chart resizing
    //d3.select(window).on('resize', chartResize);

    /**
     * Chart resizing
     */
    function chartResize() {

      var chartSelector = ".chart.activity";
      /* Find the new window dimensions */
      var width = parseInt(d3.select(chartSelector).style("width")) - margin.right * 2;
      var height = parseInt(d3.select(chartSelector).style("height")) - margin.top * 2;

      console.log('d3 resize w x h: ' + width + ' x ' + height);

      xScale.domain([minDate, maxDate])
        .range([0, width - padding * 2]);

      yScale.range([height, 0]).nice();

      /* Update the axis with the new scale */
      vis.select('.x.axis')
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

      vis.select('.y.axis')
        .attr("transform", "translate(" + 10 + ", 0)")
        .call(yAxis);

      vis.selectAll(".x.axis text")
        .attr("transform", function(d) {
        return "translate(0," + 30 + ") rotate(45)";
        });

      vis.selectAll('.line.steps')
        .attr("d", steps(data));
    }

  });
});
