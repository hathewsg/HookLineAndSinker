/*
    File Name: AppLoader.js
    Author: Ethan Weaver
    
    File Desc:
        A class that loads apps from the "apps.json" storage file into the webpage.
*/

// Imports
import { App } from "./App.js";

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
        this.allApps = []; // Store all app objects (NOT RAW JSON)
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

        const appsData = await response.json();

        // Convert plain JSON objects to App Instances
        this.allApps = appsData.map(raw => new App({
            name: raw.name,
            rating: raw.rating,
            description: raw.description,
            appType: raw["app-type"],
            imageName: raw["image-name"],
            subscription: raw.subscription,
            users: raw.users,
            isLGBTQ: raw["is-lgbtq"],
            releaseDate: raw["release-date"],
            owner: raw.owner,
            homepage: raw.homepage,
            appleStore: raw.appleStore,
            googleStore: raw.googleStore
        }));

        this.displayApps(this.allApps);
        return this.allApps; // Add this line to return the promise

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
    displayApps(appList) {
        // Clear any previous content first
        this.container.innerHTML = "";

        appList.forEach(app => {
            const div = document.createElement("div");
            div.className = "app-card";
            div.innerHTML = `
                <h2>${app.name}</h2>
                <img src="site_images/app_images/${app.imageName}" alt="${app.name}" />
                <h4>Rating: ${app.rating}★</h4>
                <p style="font-weight: bold;">${app.appType}</p>
            `;

            // When clicked, goes to appInfo and passes the app name
            div.addEventListener("click", () => {
                window.location.href = `appInfo.html?name=${encodeURIComponent(app.name)}`;
            });

            this.container.appendChild(div);
        })
    }

    /**
     * A switch case that only returns apps that fit the currently active filters.
     * @param  app - Each app object
     * @param  filters - The array of filters
     * @returns 
     */
    matchesFilters(app, filters) {
        return filters.every(f => {
            switch (f) {
                case "free":
                    return app.subscription === 0;
                case "lgbtq":
                    return app.isLGBTQ === true;
                case "dating":
                    return app.appType === "Dating App";
                case "relationship":
                    return app.appType === "Relationship App";
                case "star4":
                    return app.rating >= 4;
                
                default:
                    return true;
            }
        });
    }

    /**
     * Similar to the filter method, but only allows for one sort option to be active at a time.
     * @param apps - Each app object
     * @param sortOption - The currently active sort option
     * @returns 
     */
    applySort(apps, sortOption) {
        const sorted = [...apps];

        switch (sortOption) {
            case "alpha":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "rating":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case "users":
                sorted.sort((a, b) => b.users - a.users);
                break;
        }

        return sorted;
    }


    /**
     * Calls display apps after getting only the filtered apps in the correctly sorted order.
     */
    applyFiltersAndSort() {
        let filtered = [...this.allApps];

        // Collect Filters
        const selectedFilters = Array.from(
            document.querySelectorAll("input[name='filter']:checked")
        ).map(i => i.value);

        // Apply Filters
        if (selectedFilters.length > 0) {
            filtered = filtered.filter(app => 
                this.matchesFilters(app, selectedFilters)
            );
        }

        // Collect sorting choice
        const sortOption = document.querySelector("input[name='sortOption']:checked")?.value;

        // Apply Sorting
        if (sortOption) {
            filtered = this.applySort(filtered, sortOption);
        }

        // Display processed list
        this.displayApps(filtered);
    }

    /*
        Filters and displays apps based on a search query.
        Searches both the app name and description.

        @param1 : query - The search term entered by the user

        @return : none
    */
    searchApps(query) {
        // Convert query to lowercase for case-insensitive search
        const search = query.toLowerCase().trim();

        // If search is empty, show all apps
        if (search === "") {
            this.displayApps(this.allApps);
            return;
        }

        // Filter apps that match the search term in name or description
        const filtered = this.allApps.filter(app => app.matchesSearch(search));

        // Display Filtered Results
        this.displayApps(filtered);
    }
}