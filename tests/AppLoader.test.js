/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { AppLoader } from "../scripts/AppLoader.js";

describe("AppLoader class", () => {
  let container;

  beforeEach(() => {
    // Set up a fake DOM container
    document.body.innerHTML = '<div id="appContainer"></div>';
    container = document.getElementById("appContainer");
  });

  test("displayApps() correctly renders app cards", () => {
    const loader = new AppLoader("apps.json", "appContainer");
    const mockApps = [
      { name: "TestApp1", "image-name": "img1.png", subscription: 5, "release-date": "2025" },
      { name: "TestApp2", "image-name": "img2.png", subscription: 0, "release-date": "2023" }
    ];

    loader.displayApps(mockApps);

    const cards = container.querySelectorAll(".app-card");
    expect(cards.length).toBe(2);
    expect(cards[0].querySelector("h2").textContent).toBe("TestApp1");
  });

  test("loadApps() populates apps when fetch succeeds", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { name: "AppOne", "image-name": "img.png", subscription: 10, "release-date": "2025" }
        ])
      })
    );

    const loader = new AppLoader("apps.json", "appContainer");
    await loader.loadApps();

    const card = container.querySelector(".app-card");
    expect(card).not.toBeNull();
    expect(card.querySelector("h2").textContent).toBe("AppOne");
  });

  test("loadApps() displays error when fetch fails", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    const loader = new AppLoader("bad.json", "appContainer");
    await loader.loadApps();

    expect(container.innerHTML).toContain("Error: Failed to load app data");
  });
});
