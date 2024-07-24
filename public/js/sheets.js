const CLIENT_ID = '225666706679-o0h7mbmlam4j5ep25d44gc7ig6sjrqbg.apps.googleusercontent.com';
const API_KEY = '';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

document.getElementById('trip-form').addEventListener('submit', function(event) {
    event.preventDefault();
    handleAuthClick();
});

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        sendDataToGoogleSheet();
    }
}

async function sendDataToGoogleSheet() {
    const pickupLocation = document.getElementById('pickup-location').value;
    const dropoffLocation = document.getElementById('dropoff-location').value;
    const fare = document.getElementById('fare').value;
    const pickupDate = document.getElementById('pickup-date').value;
    const dropoffDate = document.getElementById('dropoff-date').value;
    const pickupTime = document.getElementById('pickup-time').value;

    const sheetId = '1SeAnX56530ye_DUhMzaEIOkOD_n9-_PkquYETs9aifI/'; 
    const range = 'Sheet1!A1:F1'; 
    const values = [[pickupLocation, dropoffLocation, fare, pickupDate, dropoffDate, pickupTime]];

    const params = {
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS'
    };

    const valueRangeBody = {
        majorDimension: "ROWS",
        values: values
    };

    try {
        const response = await gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        console.log(response.result);
    } catch (error) {
        console.error('Error: ', error.result.error.message);
    }
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
