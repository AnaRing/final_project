import { onAuthStateChanged } from 'firebase/auth';
import { login, logout, signup } from './auth';
import '../css/styles.css';

// Initialize Firebase auth
import { getAuth } from 'firebase/auth';
const auth = getAuth();

// API URLs
const QUOTE_API_URL = 'https://zenquotes.io/api/quotes';
const QUOTE_TODAY_URL = 'https://zenquotes.io/api/today';

// Fetch quotes by author
async function fetchQuotesByAuthor(author) {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(QUOTE_API_URL)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch quotes.');
        }
        const data = await response.json();
        const quotes = JSON.parse(data.contents);
        console.log('Fetched quotes:', quotes); // Debugging line

        // Filter quotes by author, case insensitive
        const filteredQuotes = quotes.filter(quote => quote.a.toLowerCase().includes(author.toLowerCase()));
        console.log('Filtered quotes:', filteredQuotes); // Debugging line
        return filteredQuotes;
    } catch (error) {
        console.error('Error fetching quotes by author.', error);
        return [];
    }
}

// Display quotes in UI
function displayQuotes(quotes) {
    const quotesContainer = document.querySelector('.quote-display-container');
    if (!quotesContainer) {
        console.error('Quotes container not found.');
        return;
    }
    quotesContainer.innerHTML = '';
    if (quotes && quotes.length > 0) {
        quotes.forEach(quoteObj => {
            const quoteElement = document.createElement('div');
            quoteElement.textContent = `${quoteObj.q} - ${quoteObj.a}`;
            quotesContainer.appendChild(quoteElement);
        });
    } else {
        quotesContainer.textContent = 'No quotes found!';
    }
}

// Display today's quote
async function displayTodayQuote() {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(QUOTE_TODAY_URL)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch today\'s quote.');
        }
        const data = await response.json();
        const quoteData = JSON.parse(data.contents);
        console.log('Today\'s quote:', quoteData); // Debugging line
        displayQuotes(quoteData);
    } catch (error) {
        console.error('Error displaying today\'s quote.', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');
    const signupRedirection = document.querySelector('.signup-redirection');
    const landingPage = document.querySelector('.landing-page-container');
    const logoutButton = document.querySelector('.logout-button');
    const loginRedirection = document.querySelector('.login-redirection');
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');

    loginContainer.style.display = 'block';
    signupContainer.style.display = 'none';
    landingPage.style.display = 'none';

    // Add event listeners
    signupRedirection.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        landingPage.style.display = 'none';
        signupContainer.style.display = 'block';
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const firstname = document.querySelector('#firstname-input').value;
        const lastname = document.querySelector('#lastname-input').value;
        const email = document.querySelector('#email-signup-input').value;
        const password = document.querySelector('#password-signup-input').value;

        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format.');
            return;
        }

        try {
            await signup(firstname, lastname, email, password);
            signupForm.reset();
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        } catch (error) {
            alert('Error signing up: ' + error.message);
        }
    });

    loginRedirection.addEventListener('click', () => {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.querySelector('#email-login-input').value;
        const password = document.querySelector('#password-login-input').value;

        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format.');
            return;
        }

        try {
            await login(email, password);
            loginForm.reset();
            loginContainer.style.display = 'none';
            landingPage.style.display = 'block';
            await displayTodayQuote();
        } catch (error) {
            alert('Error logging in: ' + error.message);
        }
    });

    logoutButton.addEventListener('click', async () => {
        try {
            await logout();
            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        } catch (error) {
            alert('Error logging out: ' + error.message);
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const displayName = user.displayName || 'User';
            document.querySelector('.landing-header-namedisplay').textContent = displayName;
            loginContainer.style.display = 'none';
            landingPage.style.display = 'block';
            displayTodayQuote();
        } else {
            document.querySelector('.landing-header-namedisplay').textContent = '';
            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        }
    });

    searchButton.addEventListener('click', async () => {
        const searchTerm = searchInput.value;
        console.log('Searching for author:', searchTerm); // Debugging line
        const searchResults = await fetchQuotesByAuthor(searchTerm);
        displayQuotes(searchResults);
    });
});
