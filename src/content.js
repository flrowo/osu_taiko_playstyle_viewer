const ELEMENT_ID = 'osu-playstyle-div';
let lastUrl = ''; // Used to track the URL and run only when it changes

const createColoredPlaystyleHtml = (playstyle) => {
    let coloredHtml = '';
    for (const char of playstyle) {
        if (char === 'k') {
            coloredHtml += `<span style="color: #3399ff;">K</span>`; // A nice blue for Kat
        } else if (char === 'd') {
            coloredHtml += `<span style="color: #ff4d4d;">D</span>`; // A nice red for Don
        }
    }
    return coloredHtml;
};

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

        // 6. If found the player, find the username element and inject the span
        if (currentPlayer) {
            const usernameElement = document.querySelector('.profile-info__name');

            // Proceed only if the element exists and we haven't already added the span
            if (usernameElement && !usernameElement.classList.contains('playstyle-profile-checked')) {
                // Mark it as processed to prevent duplicates
                usernameElement.classList.add('playstyle-profile-checked');

                const playstyleSpan = document.createElement('span');
                playstyleSpan.className = 'playstyle-profile-span'; // Add a class for easy cleanup

                // Append each letter for kats and dons with it's color
                currentPlayer.playstyle_keyboard.split('').forEach(key => {
                    const tempSpan = document.createElement('span');
                    if (key === 'k') tempSpan.style.color = '#6bb7ffff';
                    if (key === 'd') tempSpan.style.color = '#ff7c7cff';
                    tempSpan.textContent = key.toUpperCase();
                    playstyleSpan.appendChild(tempSpan);
                });

                // Style the span to look good next to the username
                playstyleSpan.style.fontSize = '0.8em';
                playstyleSpan.style.marginLeft = '8px';
                playstyleSpan.style.fontWeight = 'bold';
                playstyleSpan.style.verticalAlign = 'middle'; // Align it nicely with the username

                // Inject the span right after the username element
                usernameElement.appendChild(playstyleSpan);
            }
        }
    });
};

const handleScoreboard = () => {
    // 1. Only run on beatmap pages
    if (!window.location.pathname.startsWith('/beatmapsets/')) return;

    chrome.storage.local.get(['osuTaikoPlaystyles'], (result) => {
        const players = result.osuTaikoPlaystyles;
        if (!players) return;

        // 2. Select all player links in the scoreboard that we haven't processed yet
        const playerLinks = document.querySelectorAll('.js-usercard:not(.playstyle-checked)');

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

                // Append each letter for kats and dons with it's color
                currentPlayer.playstyle_keyboard.split('').forEach(key => {
                    const tempSpan = document.createElement('span');
                    if (key === 'k') tempSpan.style.color = '#6bb7ffff';
                    if (key === 'd') tempSpan.style.color = '#ff7c7cff';
                    tempSpan.textContent = key.toUpperCase();
                    playstyleSpan.appendChild(tempSpan);
                });

                // Style the span to be visible but not intrusive
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