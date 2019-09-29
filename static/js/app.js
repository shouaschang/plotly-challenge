//  index.html ID tags needed for D3.js 'document.getElementById("__");'
//  selDataset
//  panel, sample-metadata
//  pie chart, pie
//  bubble chart, bubble
//  gauge chart, gauge

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sample) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]) {
      var row = panel.append("p").text(`${key}: ${value}`);
  });
  }
)};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/sample/${sample}`;
  d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    // Getting sample data
    var xValues = data.otu_ids;
    var yValues = data.sample_values;
    var tValues = data.otu_labels;
    var mSize = data.sample_values;
    var mColor = data.otu_ids;

    // Bubble look and feel
    var bubbleData = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        color: mColors,
        size: mSize
      }
    };

    var bubbleLayout = {
      xaxis: {
        title: 'Operational Taxonomic Unit (OTU) IDs',
      };
    }
    var BUBBLE = document.getElementById('bubble');
    Plotly.newPlot(BUBBLE, bubbleData, bubbleLayout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(data) {
      var pieSample = data.sample_values.slice(0,10);
      var pieLabels = data.otu_ids.slice(0,10);
      var pieHover = data.otu_labels.slice(0,10);

      var pieData = [{
        type: 'pie',
        labels: pieLabels,
        values: pieSample,
        hovertext: pieHover
      }];

      var pieLayout = {
        margin: {
          t: 0,
          l: 0
        }
      };
      var PIE = document.getElementById("#pie");
      Plotly.Plot(pie, pieData, pieLayout);
    };

// TESTING UPDATE CODE //
    function updateCharts(sampleData, otuData) {
        var sampleValues = sampleData[0]['sample_values'];
        var otuIDs = sampleData[0]['otu_ids'];
        // Return the OTU Description for each otuID in the dataset
        var labels = otuIDs.map(function(item) {
            return otuData[item]
        });
        // Update the Bubble Chart with the new data
        var BUBBLE = document.getElementById('bubble');
        Plotly.restyle(BUBBLE, 'x', [otuIDs]);
        Plotly.restyle(BUBBLE, 'y', [sampleValues]);
        Plotly.restyle(BUBBLE, 'text', [labels]);
        Plotly.restyle(BUBBLE, 'marker.size', [sampleValues]);
        Plotly.restyle(BUBBLE, 'marker.color', [otuIDs]);
        // Update the Pie Chart with the new data
        // Use slice to select only the top 10 OTUs for the pie chart
        var PIE = document.getElementById('pie');
        var pieUpdate = {
            values: [sampleValues.slice(0, 10)],
            labels: [otuIDs.slice(0, 10)],
            hovertext: [labels.slice(0, 10)],
            hoverinfo: 'hovertext',
            type: 'pie'
        };
        Plotly.restyle(PIE, pieUpdate);
}

// END TESTING
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
