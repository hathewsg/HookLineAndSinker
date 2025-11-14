/**
 * Tests for AppInfoLoader.js (FINAL, working)
 */

import { jest } from "@jest/globals";
import { loadAppInfo } from "../scripts/AppInfoLoader.js";

/* ---------------------------------------------------------
   Mock URLSearchParams instead of window.location
   --------------------------------------------------------- */
function mockQuery(paramString) {
    jest.spyOn(window, "URLSearchParams").mockImplementation(() => {
        return {
            get: (key) => {
                const params = new Map(
                    paramString
                        .replace(/^\?/, "")
                        .split("&")
                        .filter(Boolean)
                        .map(p => p.split("="))
                );
                return params.get(key) || null;
            }
        };
    });
}

beforeEach(() => {
    document.body.innerHTML = `
        <h1 id="app-title"></h1>
        <img id="app-image">
        <p id="star-rating"></p>
        <p id="price"></p>
        <p id="users"></p>
        <div id="sites-available"></div>
        <p id="developer-name"></p>
        <p id="app-type"></p>
        <p id="release"></p>
        <p id="description"></p>
    `;

    jest.restoreAllMocks();
});


/* ---------------------------------------------------------
   TEST 1 — Missing ?name
   --------------------------------------------------------- */
test("shows 'App not found' when no ?name parameter is present", async () => {
    mockQuery(""); // No URL params

    await loadAppInfo();

    expect(document.getElementById("app-title").textContent)
        .toBe("App not found.");
});


/* ---------------------------------------------------------
   TEST 2 — App missing from JSON
   --------------------------------------------------------- */
test("shows error when app is not found in JSON", async () => {
    mockQuery("?name=UnknownApp");

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([{ name: "OtherApp" }])
        })
    );

    await loadAppInfo();

    expect(document.getElementById("app-title").textContent)
        .toBe("App not found.");
});


/* ---------------------------------------------------------
   TEST 3 — Valid app loads normally
   --------------------------------------------------------- */
test("populates fields correctly for a valid app", async () => {
    mockQuery("?name=TestApp");

    const FAKE_APP = {
        name: "TestApp",
        homepage: "https://test.com",
        "image-name": "image.png",
        rating: 4.5,
        subscription: 0,
        users: 2000,
        owner: "My Corp",
        "release-date": "2023-01-01",
        "app-type": "Utility",
        appleStore: "",
        googleStore: "",
        description: "Cool test app"
    };

    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([FAKE_APP])
        })
    );

    await loadAppInfo();

    expect(document.getElementById("description").textContent)
        .toBe("Cool test app");
});


/* ---------------------------------------------------------
   TEST 4 — Fetch failure
   --------------------------------------------------------- */
test("handles fetch failure gracefully", async () => {
    mockQuery("?name=Whatever");

    jest.spyOn(console, "error").mockImplementation(() => {});

    global.fetch = jest.fn(() => Promise.reject("fetch broke"));

    await loadAppInfo();

    expect(document.getElementById("app-title").textContent)
        .toBe("Error loading app data.");
});
