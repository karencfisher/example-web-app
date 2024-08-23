// Get elements from the page
const yearList = document.getElementById("year");
const monthList = document.getElementById("month");

// On loading the page 
addEventListener("load", () => {
    // Query through the Flask app to get the list of years
    d3.json('/years').then(data => {
        data['years'].forEach(element => {
            // Add the Options tags with the year select element.
            // We create a new option element and add its parameters
            // for each year, and append each as a child within the 
            // select element
            const option = document.createElement("option");
            option.value = `${element}`;
            option.innerText = `${element}`;
            yearList.appendChild(option);
        });
    });

    const months = [
        "January", "February", "March", 
        "April", "May", "june",
        "July", "August", "September",
        "October", "November", "December"
    ];
    for (let i = 0; i < 12; i++) {
        // Same process with the list of the montths. The value of
        // each added option element with be i + 1 (so to run 1
        // to 12 inclusive)
        const option = document.createElement("option");
        option.value = `${i + 1}`;
        option.innerText = `${months[i]}`;
        monthList.appendChild(option);
    }

    // Initially display the choropleth map for the first year and
    // month
    d3.json('/search?month=1&year=1950').then(data =>{
        plotChoropleth(data, "January", "1950");
    })
});

// Function to query for the currently selected month and year
function queryMonthYear() {
    // Get the current selections from the dropdown lists
    const month = monthList.options[monthList.selectedIndex].value;
    const monthName = monthList.options[monthList.selectedIndex].innerText;
    const year = yearList.options[yearList.selectedIndex].value;

    // Construct the URL to make the query
    url = `/search?month=${month}&year=${year}`;
    d3.json(url).then(data => {
        plotChoropleth(data, monthName, year);
    });
}

// Function to actually plot the choropleth map
function plotChoropleth(data, month, year) {
    const states = data.map(item => item.code);
    const avgTemps = data.map(item => item.avg_temp);
    const hoverText = data.map(item => `${item.state}: ${item.avg_temp}°F`);

    const trace = {
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: states, // which state to apply value to
        z: avgTemps, // the value
        text: hoverText,  // mouse over to show state and avg. temp.
        hoverinfo: 'text',
        colorscale: 'Reds',
        autocolorscale: false,
        marker: {
            line: {
                color: 'rgb(255,255,255)',
                width: 2
            }
        },
        colorbar: {
            thickness: 10
        }
    };

    const layout = {
        title: {
            text:`Average Temperature by State - ${month} ${year}`,
            y: 0.9
        },
        geo: {
            scope: 'usa',
            projection: {
                type: 'albers usa'
            },
            showlakes: true,
            lakecolor: 'rgb(255,255,255)',
            lonaxis: {
                range: [-125, -67] // Adjust the longitude axis to zoom the map horizontally
            },
            lataxis: {
                range: [24, 50] // Adjust the latitude axis to zoom the map vertically
            }
        },
        margin: {
            l: 10,  // Left margin
            r: 10,  // Right margin
            t: 40,  // Top margin
            b: 10   // Bottom margin
        }
    };

    Plotly.newPlot('choropleth', [trace], layout);
}

monthList.addEventListener('change', () => {
    queryMonthYear();
});

yearList.addEventListener('change', () => {
    queryMonthYear();
});


