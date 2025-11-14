// App.js

export class App {
    constructor({
        name,
        rating,
        description,
        appType,
        imageName,
        subscription,
        users,
        isLGBTQ,
        releaseDate,
        owner,
        homepage,
        appleStore,
        googleStore
    }) {
        this.name = name;
        this.rating = rating;
        this.description = description;
        this.appType = appType;
        this.imageName = imageName;
        this.subscription = subscription;
        this.users = users;
        this.isLGBTQ = isLGBTQ;
        this.releaseDate = releaseDate;
        this.owner = owner;
        this.homepage = homepage;
        this.appleStore = appleStore;
        this.googleStore = googleStore;
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