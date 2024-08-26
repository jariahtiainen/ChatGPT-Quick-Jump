// ==UserScript==
// @name         ChatGPT Quick Jump Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Tampermonkey script that automatically generates a sidebar with quick links to each section of long ChatGPT conversations, allowing for easy navigation between different parts of the discussion.
// @author       ChatGPT, prompted by JA
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to sanitize text for use in an ID attribute
    function sanitizeText(text) {
        return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    }

    // Function to update the sidebar
    function updateSidebar() {
        // Step 1: Create a new div element if it doesn't already exist
        let sidebarDiv = document.getElementById('custom-sidebar');
        if (!sidebarDiv) {
            sidebarDiv = document.createElement('div');
            sidebarDiv.id = 'custom-sidebar';
            sidebarDiv.style.position = 'fixed';
            sidebarDiv.style.top = '70px';
            sidebarDiv.style.right = '70px'; // Set this to e.g. 1270px to move the sidebar to left side
            sidebarDiv.style.width = '270px';
            sidebarDiv.style.padding = '10px';
            sidebarDiv.style.backgroundColor = '#222222';
            sidebarDiv.style.border = '1px solid #333';
            sidebarDiv.style.borderRadius = '5px';
            sidebarDiv.style.zIndex = '9999';
            sidebarDiv.style.overflowY = 'auto';
            sidebarDiv.style.maxHeight = '80vh';
            document.body.appendChild(sidebarDiv); // Insert the sidebar into the body
        }

        // Clear existing content in the sidebar
        sidebarDiv.innerHTML = '';

        // Step 2: Gather all div.whitespace-pre-wrap elements
        const uniqueDivs = document.querySelectorAll('div.whitespace-pre-wrap');

        // Step 3: Loop over each div and create sidebar links
        uniqueDivs.forEach((uniqueDiv, index) => {
            const uniqueText = uniqueDiv.textContent || uniqueDiv.innerText;

            if (uniqueText) {
                // Sanitize the text to create a valid ID
                const sanitizedId = sanitizeText(uniqueText);

                // Assign the sanitized ID to the div
                uniqueDiv.id = sanitizedId;

                // Create a link element for the sidebar
                const link = document.createElement('a');
                link.href = '#' + sanitizedId;
                link.textContent = uniqueText.substring(0, 55) + (uniqueText.length > 55 ? '...' : ''); // Truncate the text if it's too long
                link.style.display = 'block';
                link.style.marginBottom = '5px';
                link.style.fontSize = '16px'; // Change link font size here
                link.style.color = '#007bff'; // Change link text color here
                link.style.textDecoration = 'none';

                // Append the link to the sidebar div
                sidebarDiv.appendChild(link);
            }
        });
    }

    // Debounce function to limit the rate of calling updateSidebar
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    window.onload = function() {
        updateSidebar();

        const hFullElement = document.querySelector('.h-full');

        if (!hFullElement) return;

        const observer = new MutationObserver(debounce(mutations => {
            let shouldUpdate = false;

            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });

            if (shouldUpdate) {
                updateSidebar();
            }
        }, 300));

        observer.observe(hFullElement, {
            childList: true,
            subtree: true,
        });
    };

})();
