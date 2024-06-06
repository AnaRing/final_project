// https://www.w3schools.com/jsref/jsref_search.asp

// https://www.w3schools.com/js/js_array_sort.asp

// https://www.w3schools.com/jsref/jsref_filter.asp


import { documentId } from 'firebase/firestore';
import '../css/styles.css';
import { onAuthStateChanged } from 'firebase/auth';
import { login, logout, signup } from './auth';

// initialize firebase auth
import { getAuth } from 'firebase/auth';
const auth = getAuth();

// fetch the api

const QUOTE_API_URL = 'https://zenquotes.io/api/today';

// getting elements from the dom

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');
    const signupRedirection = document.querySelector('.signup-redirection');
    const landingPage = document.querySelector('.landing-page-container');
    const logoutButton = document.querySelector('.logout-button');
    const loginRedirection = document.querySelector('.login-redirection');
    


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
            alert('Invalid email format.')
            return;
        }
        
        try {
            await signup(firstname, lastname, email, password);
                signupForm.reset();
                signupContainer.style.display = 'none';
                landingPage.style.display = 'none';
                loginContainer.style.display = 'block';
                /* alert('Sign-up successful!'); */
            }
            catch (error) {
                console.log('Error signing up.', error.message);
                alert('Error signing up.')
            };
        });
    
        loginRedirection.addEventListener ('click', () => {
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
            alert('Invalid email format.')
            return;
        }

        try {
            await login(email, password);
            loginForm.reset();
            loginContainer.style.display = 'none';
            landingPage.style.display = 'block';
            displayLandingQuoteAndSearch();
        } catch (error) {
            console.error('Error logging in.', error.message);
            alert('Error logging in.')
        }
    });

    

    logoutButton.addEventListener('click', async () => {
        try {
            await logout();
            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        } catch(error) {
            console.log('Error logging out.', error.message);
            alert('Error logging out.')
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const displayName = user.displayName;
            document.querySelector('.landing-header-namedisplay').textContent = displayName;

            loginContainer.style.display = 'none';
            landingPage.style.display = 'block';
            displayLandingQuoteAndSearch();
        } else {
            document.querySelector('.landing-header-namedisplay').textContent = '';

            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        }
    });

});



// function to get todays quote

async function fetchTodaysQuote() {
    try {
        const response = await fetch(QUOTE_API_URL);
        if(!response.ok) {
            throw new Error('Failed to fetch quote.');
        }
        const data = await response.json();
        return data[0].q;
    } catch (error) {
        console.error('Error fetching todays quote.', error);
        return 'Failed to fetch todays quote.';
    }
}

// function to store quotes

async function storeTodayQuote() {
    const todayQuote = await fetchTodaysQuote();
    const today = new Date().toISOString().split('T')[0];
    let quotes = JSON.parse(localStorage.getItem('quotes')) || {};
    quotes[today] = todayQuote;
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// function to get quotes for the last week

function getPastWeekQuotes() {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || {};
    const pastWeekQuotes = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        if (quotes[dateString]) {
            pastWeekQuotes.push({ date: dateString, quote: quotes[dateString] });
        }
    }
    return pastWeekQuotes;
}

// function to search for quotes

function searchPastQuotes(searchTerm) {
    const pastWeekQuotes = getPastWeekQuotes();
    return pastWeekQuotes.filter(entry => entry.quote.toLowerCase().includes(searchTerm.toLowerCase()));
}

// display quotes in ui 

function displayQuotes(quotes) {
    const quotesContainer = document.querySelector('.quote-display-container')
    quotesContainer.innerHTML = '';
    quotes.forEach(entry => {
        const quoteElement = document.createElement('div');
        quoteElement.textContent = `${entry.date}: ${entry.quote}`;
        quotesContainer.appendChild(quoteElement);
    });
}

// function to display todays quote and search function

async function displayQuoteAndSearch() {
    try {
        await storeTodayQuote();
        const todayQuote = await fetchTodaysQuote();

        const quoteDisplay = document.querySelector('.quote-display-container');
        quoteDisplay.innerHTML = '';

        const todayQuoteElement = document.createElement('div');
        todayQuoteElement.textContent = `${todayQuote}`;
        quoteDisplay.appendChild(todayQuoteElement);

        const searchInput = document.createElement('input');
        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search Quotes';

        quoteDisplay.appendChild(searchInput);      
        quoteDisplay.appendChild(searchButton);   
        
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value;
            const searchResults = searchPastQuotes(searchTerm);
            displayQuotes(searchResults);
        });
    } catch (error) {
        console.error('Error displaying quote.');
    }
}