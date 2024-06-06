import { documentId } from 'firebase/firestore';
import '../css/styles.css';
import { onAuthStateChanged } from 'firebase/auth';
import { login, logout, signup, getAllUsers } from './auth';

// initialize firebase auth
import { getAuth } from 'firebase/auth';
const auth = getAuth();

// getting elements from the dom

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');
    const signupRedirection = document.querySelector('.signup-redirection');
    const landingPage = document.querySelector('.landing-page-container');
    const logoutButton = document.querySelector('.header-logout-button');
    const loginRedirection = document.querySelector('.login-redirection');
    const landingUserDisplay = document.querySelector('.landing-user-display');


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
            displayLandingUsers();
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
        } else {
            document.querySelector('.landing-header-namedisplay').textContent = '';

            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        }
    });

    // function to diplay users in its own table
    async function displayLandingUsers() {
        try {
            const users = await getAllUsers();
            landingUserDisplay.innerHTML = '';

            users.forEach(user => {
                const userSpan = document.createElement('span');
                userSpan.textContent = `${user.firstName} ${user.lastName} (${user.email})`;
                landingUserDisplay.appendChild(userSpan);
            });
        } catch (error) {
            console.error('Error fetching users.', error);
        }
    }
});


