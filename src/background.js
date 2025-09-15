// The player data you provided
const playerData = [
    {
        "player_id": "4689256",
        "player_name": "flr",
        "playstyle_keyboard": "kddk",
        "playstyle_fingers": 2,
        "playstyle_alt": "100-full-alternate",
        "screen_resolutions": ["1280x960"],
        "screen_hz": 144,
        "last_update": "2025-09-14"
    },
    {
        "player_id": "3174184",
        "player_name": "shinchikuhome",
        "playstyle_keyboard": "kddk",
        "playstyle_fingers": 4,
        "playstyle_alt": "full-alternate",
        "screen_resolutions": ["1360x768", "1600x768"],
        "screen_hz": 60,
        "last_update": "2025-09-14"
    },
    {
        "player_id": "3044264",
        "player_name": "Skid",
        "playstyle_keyboard": "kddk",
        "playstyle_fingers": 4,
        "playstyle_alt": "cross-tap",
        "screen_resolutions": null,
        "screen_hz": null,
        "last_update": "2025-09-14"
    }
];

// When the extension is installed, save this data to chrome.storage
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ osuTaikoPlaystyles: playerData }, () => {
        console.log('Player playstyle data saved.');
    });
});