// App.js

export class App {
    constructor({name, rating, description, appType, imageName}) {
        this.name = name;
        this.rating = rating;
        this.description = description;
        this.appType = appType;
        this.imageName = imageName;
    }

    // Internal Helper method to help search in AppLoader.js
    matchesSearch(term) {
        const lower = term.toLowerCase();
        return (
            this.name.toLowerCase().includes(lower) ||
            this.description.toLowerCase().includes(lower)
        );
    }
}