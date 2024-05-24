// Function to read flight info from CSV file
function readFlightInfo(filePath) {
    return fetch(filePath) // Add return here
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n').slice(1); // Skip header line
            const flights = lines.map(line => {
                if (line.trim()) { // Ensure the line is not empty
                    // Parse economy, premium, and business as integers
                    const [flightNumber, departure, arrival, date, time, economy, premium, business] = line.split(',');
                    const economyInt = parseInt(economy, 10);
                    const premiumInt = parseInt(premium, 10);
                    const businessInt = parseInt(business, 10);
                    return { flightNumber, departure, arrival, date, time, economy: economyInt, premium: premiumInt, business: businessInt };
                }
            }).filter(flight => flight !== undefined); // Filter out undefined values (empty lines)
            // console.log('Flight info:');
            // console.log(flights);
            // displayFlightInfo(flights); // Call the display function
            return flights;
        })
        .catch(error => console.error('Error reading flight info:', error));
}

// Function to display flight info in HTML
function displayFlightInfo(flights) {
    const resultsDiv = document.getElementById('results');
    let html = '<h2>Flight Information</h2>';
    html += '<ul>';
    flights.forEach(flight => {
        html += `<li>Flight Number: ${flight.flightNumber}, Departure: ${flight.departure}, Arrival: ${flight.arrival} Date: ${flight.date}, Time: ${flight.time}, Econ: ${flight.economy}, Prem: ${flight.premium}, Busi: ${flight.business}</li>`;
    });
    html += '</ul>';
    resultsDiv.innerHTML = html;
}


function getFlights(date, time, departure, arrival, allFlights) {
    // Filter flights based on search criteria
    const filteredFlights = allFlights.filter(flight => {
        // Check if flight matches all search criteria
        return flight.date === date &&
               flight.time === time &&
               flight.departure === departure &&
               flight.arrival === arrival; 
    });

    return filteredFlights[0]
}

function searchFlights(searchData, allFlights) {
    // Filter flights based on search criteria
    const filteredFlights = getFlights(searchData.date, 
                                       searchData.time, 
                                       searchData.departure, 
                                       searchData.arrival, 
                                       allFlights);

    // Here you can use the filteredFlights array to display the search results
    const searchResultsDiv = document.getElementById('search-results');

    // Generate HTML for the search criteria
    let html = `<h2>Search Criteria</h2>
                <p>Date: ${searchData.date}</p>
                <p>Time: ${searchData.time}</p>
                <p>Departure: ${searchData.departure}</p>
                <p>Arrival: ${searchData.arrival}</p>`;

    // If there are matching flights, generate HTML for them
    if (filteredFlights.length > 0) {
        html += `<h2>Found Flights</h2>
                 <ul>`;
        filteredFlights.forEach(flight => {
            html += `<li>Flight Number: ${flight.flightNumber}, Departure: ${flight.departure}, Arrival: ${flight.arrival} Date: ${flight.date}, Time: ${flight.time}, Econ: ${flight.economy}, Prem: ${flight.premium}, Busi: ${flight.business}</li>`;
    });
        html += `</ul>`;
    } else {
        html += `<p>No flights found for the selected criteria.</p>`;
    }

    // Set the generated HTML to the searchResultsDiv
    searchResultsDiv.innerHTML = html;
}





function bookSeat(flightNumber, seatType, allFlights) {

    for (flight in allFlights) {
        if (flight.flightNumber == flightNumber) {
            switch (seatType) {
                case 0:
                    flight.economy -= 1;
                    break;
                case 1:
                    flight.premium -= 1;
                    break;
                case 2:
                    flight.business -= 1;
                    break;
                default:
                    console.log("Error in calling bookSeat function")
                    break;
            }
            break;
        }
    }
}


// Function to get query parameters from URL
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}
 

function writeFlightInfo(filePath, flights) {
    // Define the header
    const header = 'Flight Number,Departure,Arrival,Date,Time,Economy,Premium,Business\n';
    
    // Convert flights array to CSV string
    const flightLines = flights.map(flight => {
        return `${flight.flightNumber},${flight.departure},${flight.arrival},${flight.date},${flight.time},${flight.economy},${flight.premium},${flight.business}`;
    });
    
    // Join the header and flight lines
    const csvContent = header + flightLines.join('\n') + '\n';

    // Create the request payload
    const payload = {
        filePath: filePath,
        content: csvContent
    };

    // Send the CSV content to the server
    return fetch('/write-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Flight info successfully written to', filePath);
        } else {
            console.error('Error writing flight info:', data.error);
        }
    })
    .catch(error => console.error('Error writing flight info:', error));
}