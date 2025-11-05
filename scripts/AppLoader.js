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
            this.displayApps(apps);
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
                <h4>Subscription: $${app.subscription}</h4>
                <p>${app["release-date"]}</p>
            `;

            this.container.appendChild(div);
        })
    }
}