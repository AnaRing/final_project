import { documentId } from 'firebase/firestore';
import '../css/styles.css';
import { onAuthStateChanged } from 'firebase/auth';
import { login, logout, signup } from './auth';

// initialize firebase auth
import { getAuth } from 'firebase/auth';
const auth = getAuth();

// fetch the API using a CORS proxy
const QUOTE_API_URL = 'https://zenquotes.io/api/quotes';
/* const QUOTE_TODAY_URL = 'https://zenquotes.io/api/today'; */

async function fetchQuotesByAuthor(author) {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(QUOTE_API_URL)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch quotes.');
        }
        const data = await response.json();
        const quotes = JSON.parse(data.contents);
        // Filter quotes by the given author
        const authorQuotes = quotes.filter(quote => quote.a.toLowerCase().includes(author.toLowerCase()));
        return authorQuotes;
    } catch (error) {
        console.error('Error fetching quotes by author.', error);
        return [];
    }
}

// function to search for quotes by author
async function searchQuotesByAuthor(author) {
    return await fetchQuotesByAuthor(author);
}

// display quotes in UI
function displayQuotes(quotes) {
    console.log('Quotes:', quotes); 

    const quotesContainer = document.querySelector('.quote-display-container');
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

async function displayQuoteAndSearch() {
    try {
        const response = await fetch(QUOTE_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch quotes.');
        }
        const data = await response.json();
    
        const today = new Date().toISOString().slice(0, 10);
        const todayQuote = data.find(quote => quote.date.slice(0, 10) === today);

        if (!todayQuote) {
            throw new Error('Today\'s quote not found.');
        }

        const quoteDisplay = document.querySelector('.quote-display-container');
        quoteDisplay.innerHTML = '';

        const todayQuoteElement = document.createElement('div');
        todayQuoteElement.textContent = `"${todayQuote.quote}" - ${todayQuote.author}`;
        quoteDisplay.appendChild(todayQuoteElement);

    } catch (error) {
        console.error('Error displaying quote.', error);
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

    // adding event listeners
    signupRedirection.addEventListener('click', () => {
        console.log('Signup button clicked.');
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

        // check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            console.error('Invalid email format.');
            alert('Invalid email format.');
            return;
        }
        
        try {
            await signup(firstname, lastname, email, password);
            signupForm.reset();
            signupContainer.style.display = 'none';
            landingPage.style.display = 'none';
            loginContainer.style.display = 'block';
        } catch (error) {
            console.log('Error signing up.', error.message);
            alert('Error signing up.');
        }
    });
    
    loginRedirection.addEventListener('click', () => {
        signupContainer.style.display = 'none';
        landingPage.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = event.target.querySelector('#email-login-input').value;
        const password = event.target.querySelector('#password-login-input').value;

        // check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            console.error('Invalid email format.');
            alert('Invalid email format.');
            return;
        }

        try {
            await login(email, password);
            loginForm.reset();
            loginContainer.style.display = 'none';
            landingPage.style.display = 'block';
            displayQuotes([]);
        } catch (error) {
            console.error('Error logging in.', error.message);
            alert('Error logging in.');
        }
    });

    logoutButton.addEventListener('click', async () => {
        try {
            await logout();
            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        } catch (error) {
            console.log('Error logging out.', error.message);
            alert('Error logging out.');
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const displayName = user.displayName;
            document.querySelector('.landing-header-namedisplay').textContent = displayName;

            loginContainer.style.display = 'none';
            landingPage.style.display = 'block';
        } else {
            document.querySelector('.landing-header-namedisplay').textContent = '';

            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        }
    });

    searchButton.addEventListener('click', async () => {
        const searchTerm = searchInput.value;
        const searchResults = await searchQuotesByAuthor(searchTerm);
        displayQuotes(searchResults);
        displayQuoteAndSearch(searchResults);
    });
});
