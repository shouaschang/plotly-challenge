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
  //  console.log(sample);
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(function ([key, value]) {
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var row = sample_metadata.append("p");
      row.text(`${key}: {value}`);
    });
  }
)};

// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var labels = sampleData[0]['otu_ids'].map(function(item) {
    return otuData[item]
  });

    // Bubble Chart using the sample data
    // Defining Bubble Chart layout area
    var bubbleArea = {
      margin: {t:0},
      hovermode: 'closest',
      xaxis: {title: 'OTU IDs'}
    };
    // Defining Bubble Chart dataset using OTU
    var bubbleData = [{
      x: sampleData[0]['otu_ids'],
      y: sampleData[0]['sample_values'],
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sampleData[0]['sample_values'],
        color: sampleData[0]['otd_ids'],
        colorscale: "Earth"
      }
    }];
    // Placing Bubble Chart in index.html file where bubble is specified
    var bubbleChart = document.getElementById('bubble');
    plotly.plot(bubbleChart, bubbleData, bubbleArea);




    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(data) {
      var pieValues = data.sample_values.slice(0,10);
      var pieLabels = data.otu_ids.slice(0,10);
      var pieHover = data.otu_labels.slice(0,10);

}

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
