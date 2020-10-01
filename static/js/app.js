const selector = d3.select("#selDataset");

  function optionChanged() {

  //Grab the JSON object

  d3.json("/data/samples.json").then((importedData) => {
  
  //create data variables
  var metaData = importedData.metadata;
  var data = importedData.samples;
  var name = importedData.names;

  var select = d3.select("select").on("change", optionChanged);
  
  var options = select
    .selectAll("option")
    .data(name)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    });

    selectValue = d3.select("select").property("value");

    var result = metaData.filter(
      (meta) => meta.id.toString() === selectValue
    )[0];
    // data into the demo panel in the html
    var demoInfo = d3.select("#sample-metadata");
    demoInfo.html("");

    // append the info to the panel html
    Object.entries(result).forEach((i) => {
      demoInfo.append("h5").text(i[0].toUpperCase() + ": " + i[1] + "\n");
    });

    //get patient data based on patient id
    var newData = data.filter((sample) => sample.id.toString() === selectValue);
  
    //create variables bar chart
    var sampleValues = newData.map((sample) => sample.sample_values)
    var otuLabels = newData.map((sample) => sample.otu_labels)
    var id = newData.map((sample) => sample.otu_ids)
    var ids = newData[0]['otu_ids'].map(elem => `OTU ${elem.toString()}`)

    //Create a trace
    var trace = {
      x: sampleValues[0].slice(0,10).reverse(),
      y: ids.slice(0,10),
      text: otuLabels[0].slice(0,10),
      type: "bar",
      orientation: "h"

    };
    var chart = [trace]
    var layout = {
      yaxis: {
      type: 'category'},
      xaxis: {title: "Sample Volume"}

    };

    Plotly.newPlot("bar", chart, layout);
   
    //Create variable for bubble type chart
    var markersize = 10

    var trace2 = {
      x: id[0],
      y: sampleValues[0],
      mode: "markers",
      text: otuLabels[0],
      marker: {
        size: sampleValues[0],
        color: id[0],
        sizeref: 2.0 * Math.max(0.2) / (markersize),
        sizemode: 'area'
      }
    }
  var bubbleData = [trace2]
  var bubbleLayout = {
    xaxis : {title: "OTU ID"},
    yaxis: {title: "Sample Volume"}
  }
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  })}
  selector.on('change', optionChanged(this.value))