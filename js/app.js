import { documentId } from 'firebase/firestore';
import '../css/styles.css';
import { onAuthStateChanged } from 'firebase/auth';
import { login, logout, signup } from './auth';

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
    /* const signupButton = document.querySelector('.signup-button'); */
    const landingPage = document.querySelector('.landing-page-container');
    const logoutButton = document.querySelector('.logout-button');


    // adding event listeners

    signupRedirection.addEventListener('click', () => {
        console.log('Signup button clicked.');
        loginContainer.style.display = 'none';
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
                loginContainer.style.display = 'block';
                alert('Sign-up successful!');
            }
            catch (error) {
                console.log('Error signing up.', error.message);
                alert('Error signing up.')
            };
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
            loginForm.style.display = 'none';
            landingPage.style.display = 'block';
        } catch (error) {
            console.error('Error logging in.', error.message);
            alert('Error logging in.')
        }
    });

    

    logoutButton.addEventListener('click', async () => {
        try {
            await logout();
            loginForm.style.display = 'block';
            landingPage.style.display = 'none';
        } catch(error) {
            console.log('Error logging out.', error.message);
            alert('Error logging out.')
        }
    });
        /* logout()
        .then(() => {
            loginForm.style.display = 'block';
            landingPage.style.display = 'none';
        })
        .catch((error) => {
            console.log('Error logging out.', error.message);
        });
    });
 */
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginContainer.style.display = 'none';
            landingPage.style.display = 'block';
        } else {
            loginContainer.style.display = 'block';
            landingPage.style.display = 'none';
        }
    });
});
