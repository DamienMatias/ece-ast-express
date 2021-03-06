(function() {
    var chartdata;
    chartdata = [];
  
    $(function() {
      var height, margin, svg, updateChart, valueline, width, x, y;
      $('#metric_datepicker').datepicker();
      margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 50
      };

      width = $('#metrics').width() - margin.left - margin.right;
      height = 400 - margin.top - margin.bottom;
      x = d3.scaleTime().range([0, width]);
      y = d3.scaleLinear().range([height, 0]);
      valueline = d3.line().x(function(d) {
        return x(d.timestamp);
      }).y(function(d) {
        return y(d.value);
      });

      svg = d3.select("#metrics").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      x.domain(d3.extent(chartdata, function(d) {
        return d.timestamp;
      }));

      y.domain([
        0, d3.max(chartdata, function(d) {
          return d.value;
        })
      ]);

      svg.append("path").data([chartdata]).attr("class", "line").attr("d", valueline);
      svg.append("g").attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d/%m/%Y"))).selectAll("text").style("text-anchor", "end").attr("dx", "-0.8em").attr("dy", '0.15em').attr('transform', 'rotate(-65)');
      svg.append("g").attr('class', 'y axis').call(d3.axisLeft(y));

      $('#show-metrics').click(function(e) {
        e.preventDefault();
        return $.getJSON("/metrics.json", {}, function(data) {
          var d, i, len;
          chartdata = [];
          for (i = 0, len = data.length; i < len; i++) {
            d = data[i];
            chartdata.push({
              timestamp: d.timestamp,
              value: d.value
            });
          }
          chartdata.sort(function(a, b) {
            return a.timestamp - b.timestamp;
          });
          return updateChart();
        });
      });

      $('#newMetric').submit(function(e) {
        var data, date, id, value;
        e.preventDefault();
        id = $("#metric_id").val();
        date = (new Date($("#metric_datepicker").val())).getTime();
        value = $("#metric_value").val();
        data = [
          {
            timestamp: date,
            value: value
          }
        ];

        return $.ajax({
          type: 'POST',
          url: "/metrics.json/" + id,
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify(data),
          success: function(data) {
            return alert('Metric saved into database');
          },
          error: function() {
            return alert('Error saving the metric');
          }
        });
      });

      return updateChart = function() {
        x.domain(d3.extent(chartdata, function(d) {
          return d.timestamp;
        }));
        y.domain([
          0, d3.max(chartdata, function(d) {
            return d.value;
          })
        ]);

        svg = d3.select("#metrics").transition();
        svg.select(".line").duration(750).attr("d", valueline(chartdata));
        svg.select(".x.axis").duration(750).call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d/%m/%Y"))).selectAll("text").style("text-anchor", "end").attr("dx", "-0.8em").attr("dy", '0.15em').attr('transform', 'rotate(-65)');
        
        return svg.select(".y.axis").duration(750).call(d3.axisLeft(y));
      };
    });
  }).call(this);