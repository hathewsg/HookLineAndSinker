/*
    File Name: AppInfoLoader.js
    Author: Ethan Weaver

    Description:
        Dynamically loads information about a specific app from apps.json
        into appInfo.html using the query parameter "name".
*/

/**
 * Pulls the app name from the URL and then displays all of its information into the respective elements.
 * If the code fails to connect to apps.json, it just throws an error instead.
 * @returns Nothing to return, just does if the app doesn't successfully load
 */
async function loadAppInfo() {
    // Get the app name from URL
    const params = new URLSearchParams(window.location.search);
    const appName = params.get("name");

    // Elements for each section of the appInfo.html page
    const titleElement = document.getElementById("app-title");
    const imageElement = document.getElementById("app-image");
    const ratingElement = document.getElementById("star-rating");
    const priceElement = document.getElementById("price");
    const userElement = document.getElementById("users");
    const sitesElement = document.getElementById("sites-available");
    const companyElement = document.getElementById("developer-name");
    const appTypeElement = document.getElementById("app-type");
    const releaseElement = document.getElementById("release");
    const descElement = document.getElementById("description");

    // Handle Missing Parameter
    if (!appName) {
        titleElement.textContent = "App not found.";
        descElement.textContent = "Oops! No app was selected. Please return to the browse page.";
        return;
    }

    // Fill in the page elements
    try {
        // Connect to json file
        const response = await fetch("apps.json");
        const apps = await response.json();

        // Find the app by name
        const app = apps.find(a => a.name === appName);

        // Sends error if json file cannot be connected to
        if (!app) {
            titleElement.textContent = "App not found.";
            descElement.textContent = "The requested app could not be found in the database.";
            return;
        }

        // Filling in the page elements
        titleElement.innerHTML = `<a href="${app.homepage}">${app.name}</a>`;
        imageElement.src = `site_images/app_images/${app["image-name"]}`;
        imageElement.alt = `Image for ${app.name}`;
        ratingElement.textContent = app.rating ? `${app.rating} ★` : "No rating available";
        priceElement.textContent = app.subscription === 0 ? "Free" : `$${app.subscription}`;
        userElement.innerHTML = `User Count: ${app.users}`;
        companyElement.innerHTML = `<strong>Company: </strong>${app.owner}`;
        releaseElement.innerHTML = `<strong>Release Date: </strong>${app["release-date"]}`
        appTypeElement.innerHTML = `<strong>App Type: </strong>${app["app-type"]}`;
        
        if (app.appleStore != "") {
            sitesElement.innerHTML += `<a href="${app.appleStore}"><img src="site_images/appleStore.png" alt="Apple Play Store Logo" class="site-image"></a>`;
        }
        if (app.googleStore != "") {
            sitesElement.innerHTML +=  `<a href="${app.googleStore}"><img src="site_images/googlePlay.png" alt="Google Play Store Logo" class="site-image"></a>`
        }
        
        descElement.textContent = app.description || "No description available.";
        

    } catch (error) {
        console.error("Error loading app info:", error);
        titleElement.textContent = "Error loading app data.";
        descElement.textContent = "Please try again later.";
    }
}

loadAppInfo();