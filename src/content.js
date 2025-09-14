const ELEMENT_ID = 'osu-playstyle-div';
let lastUrl = ''; // Used to track the URL and run only when it changes

// This is the main function that does all the work
const runProfilePlaystyle = () => {

    lastUrl = location.href; // Update the last seen URL

    // 1. First, always remove any old div to prevent duplicates
    document.getElementById(ELEMENT_ID)?.remove();

    // 2. Check if we are on a user profile page. If not, do nothing.
    if (!window.location.pathname.startsWith('/users/')) return;

    // 3. Get the user ID from the page URL
    const pathSegments = window.location.pathname.split('/');

    // 4. Retrieve the stored playstyle data
    chrome.storage.local.get(['osuTaikoPlaystyles'], (result) => {
        const players = result.osuTaikoPlaystyles;
        if (!players) return; // Exit if no data is found

        // 5. Find the player whose profile is being viewed
        const currentPlayer = players.find((player) => pathSegments.includes(player.player_id));

        // 6. If we found the player, create and inject the display element
        if (currentPlayer) {
            const displayDiv = document.createElement('div');
            displayDiv.id = ELEMENT_ID; // Assign the unique ID
            displayDiv.textContent = `Playstyle: ${currentPlayer.playstyle_keyboard.toUpperCase()}`;

            // Apply all the necessary styling
            displayDiv.style.position = 'fixed';
            displayDiv.style.top = '80px';
            displayDiv.style.right = '20px';
            displayDiv.style.padding = '10px 15px';
            displayDiv.style.backgroundColor = '#2a2a2a';
            displayDiv.style.color = 'white';
            displayDiv.style.border = '2px solid #ff66aa';
            displayDiv.style.borderRadius = '8px';
            displayDiv.style.zIndex = '9999';
            displayDiv.style.fontFamily = 'sans-serif';
            displayDiv.style.fontSize = '16px';

            // Add the div to the page's body
            document.body.appendChild(displayDiv);
        }
    });
};

const handleScoreboard = () => {
        console.log("window.location.pathname", window.location.pathname)
    // 1. Only run on beatmap pages
    if (!window.location.pathname.startsWith('/beatmapsets/')) return;

    chrome.storage.local.get(['osuTaikoPlaystyles'], (result) => {
        const players = result.osuTaikoPlaystyles;
        if (!players) return;

        // 2. Select all player links in the scoreboard that we haven't processed yet
        const playerLinks = document.querySelectorAll('.js-usercard:not(.playstyle-checked)');

        console.log("playerLinks", playerLinks)

        playerLinks.forEach(link => {
            // 3. Mark this link as processed immediately to prevent infinite loops
            link.classList.add('playstyle-checked');

            // 4. Extract the user ID from the link's href
            const href = link.getAttribute('href');
            if (!href) return;

            // 5. Find the player's data
            const currentPlayer = players.find((player) => href.includes(player.player_id));

            // 6. If found, create and inject the playstyle span
            if (currentPlayer) {
                const playstyleSpan = document.createElement('span');
                playstyleSpan.textContent = `(${currentPlayer.playstyle_keyboard.toUpperCase()})`;
                
                // Style the span to be visible but not intrusive
                playstyleSpan.style.color = '#ff66aa'; // Use a consistent color
                playstyleSpan.style.fontSize = '0.9em';
                playstyleSpan.style.marginLeft = '4px';
                playstyleSpan.style.fontWeight = 'bold';

                // Inject the span right after the player's name link
                link.insertAdjacentElement('afterend', playstyleSpan);
            }
        });
    });
};


const checkToRun = () => {

    console.log("efaoijnuhhuiefuhifaehiuaefhiue")
    if (location.href !== lastUrl || document.getElementById(ELEMENT_ID) == null) {
        runProfilePlaystyle();
    }

    handleScoreboard();
}

// Create an observer to watch for page changes
const observer = new MutationObserver(checkToRun);

// Start observing the <html> element for changes, which is persistent
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

// Run the check once for the initial page load
runProfilePlaystyle();