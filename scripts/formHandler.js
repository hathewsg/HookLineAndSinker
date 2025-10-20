/*
    File Name: formHandler.js
    Author: Ethan Weaver
    
    File Desc:
        A class meant to handle form submissions and enter data submitted into 
        its own apps.json entries.
*/

export class FormHandler {
    /*
        A parameterized constructor to initialize form and
        input elements and then run the initialize method.

        @param1 : formSelector - gets the form from the request.html page.
        @param2 : outputSelectors - list of all form inputs

        @return : none
    */
    constructor(formSelector, outputSelectors){
        this.form = document.querySelector(formSelector);
        this.appNameDisplay = document.getElementById(outputSelectors.name);
        this.appDescDisplay = document.getElementById(outputSelectors.desc);
        this.appRatingDisplay = document.getElementById(outputSelectors.rating);
        this.submittedSection = document.getElementById("submitted");

        this.initialize();
    }

    /* 
        Initialize adds an event listener to the submit button of the form that 
        triggers teh handleSubmit() method when executed.

        @param : none

        @return : none
    */
    initialize(){
        this.form.addEventListener("submit", (event) => this.handleSubmit(event));
    }

    /*
        Stops the form from refreshing the page, then loads all input values into
        their respective variables.  Afterwards, runs displayResults() method and
        clears the form.

        @param1 : event - The event initialized in the initialize() method

        @return : none
    */
    handleSubmit(event) {
        event.preventDefault();

        const appName = this.form.querySelector("input[name='app-name-input']").value;
        const appDesc = this.form.querySelector("input[name='app-desc-input']").value;
        const appRating = this.form.querySelector("input[name='app-rating-input']").value;

        this.displayResults(appName, appDesc, appRating);
        this.form.reset();
    }

    /*
        Displays values declared in handleSubmit into their respective html elemnts.

        @param1 : appName - Name of application
        @param2 : appDesc - Description of app
        @param3 : appRating - The rating of the app

        @return: none
    */
    displayResults(appName, appDesc, appRating) {
        this.appNameDisplay.textContent = `App Name: ${appName}`;
        this.appDescDisplay.textContent = `Description: ${appDesc}`;
        this.appRatingDisplay.textContent = `Rating: ${appRating}`;
        this.submittedSection.style.display = "block"; // optional
    }
}