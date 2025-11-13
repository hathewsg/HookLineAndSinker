/*
    File Name: AppLoader.js
    Author: Ethan Weaver
    
    File Desc:
        A class that loads apps from the "apps.json" storage file into the webpage.
*/

export class AppLoader {

    /*
        A parameterized constructor to connect to the json file
        and parent HTML element.

        @param1 : jsonPath - File path to the .json file
        @param2 : containerId - The parent element for all apps to be loaded into

        @return : none
    */
    constructor(jsonPath, containerId) {
        this.jsonPath = jsonPath;
        this.container = document.getElementById(containerId);
        this.allApps = []; // Store all apps for filtering
    }

    /*
        Attempts connection to the json file and throws an error if it
        fails.  Otherwise, it will call displayApps() to begin loading
        every entry from apps.json.

        @return : none
    */
    async loadApps() {
    try {
        const response = await fetch(this.jsonPath);
        if (!response.ok) {
            throw new Error (`Failed to load ${this.jsonPath}`);
        }

        const apps = await response.json();
        this.allApps = apps; // Store for later filtering
        this.displayApps(apps);
        return apps; // Add this line to return the promise
    } catch (error) {
        console.error("Error loading data: ", error);
        this.container.innerHTML = `<p class="error">Error: Failed to load app data.</p>`;
    }
}

    /*
        This method loops through each of the entries in the apps.json
        file and displays them into the parent HTML element.

        @param1 : apps - A full connection to the apps.json file

        @return : none
    */
    displayApps(apps) {
        // Clear any previous content first
        this.container.innerHTML = "";

        apps.forEach(app => {
            const div = document.createElement("div");
            div.className = "app-card";
            div.innerHTML = `
                <h2>${app.name}</h2>
                <img src="site_images/app_images/${app["image-name"]}" alt="logo for ${app.name}" />
                <h4>Rating: ${app.rating}★</h4>
                <p style="font-weight: bold;">${app["app-type"]}</p>
            `;

            // When clicked, goes to appInfo and passes the app name
            div.addEventListener("click", () => {
                window.location.href = `appInfo.html?name=${encodeURIComponent(app.name)}`;
            });

            this.container.appendChild(div);
        })
    }

    /*
        Filters and displays apps based on a search query.
        Searches both the app name and description.

        @param1 : query - The search term entered by the user

        @return : none
    */
    searchApps(query) {
        // Convert query to lowercase for case-insensitive search
        const searchTerm = query.toLowerCase().trim();

        // If search is empty, show all apps
        if (searchTerm === "") {
            this.displayApps(this.allApps);
            return;
        }

        // Filter apps that match the search term in name or description
        const filteredApps = this.allApps.filter(app => {
            const nameMatch = app.name.toLowerCase().includes(searchTerm);
            const descriptionMatch = app.description.toLowerCase().includes(searchTerm);
            return nameMatch || descriptionMatch;
        });

        // Display the filtered results
        this.displayApps(filteredApps);
    }
}