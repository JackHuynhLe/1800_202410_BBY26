/**
 * Initialise the pop-up modal for the login page.
 */
document.addEventListener('DOMContentLoaded', function () {

    const modals = document.querySelectorAll('.modal')
    M.Modal.init(modals);

    const items = document.querySelectorAll('.collapsible')
    M.Collapsible.init(items);

});

const guideList = document.querySelector('.guides');

/**
 * Function to set up guides.
 *
 * @param data - The data of the guides.
 */
export const setupGuides = (data) => {

    if (data.length) {

        let html = '';
        data.forEach(doc => {
            const guide = doc.data();
            const li = `
    <li>
        <div class='collapsible-header grey lighten-4'>${guide.title}</div>
        <div class='collapsible-body white'>${guide.content}</div>
    </li>
    `;
            html += li;
        })

        guideList.innerHTML = html;
    } else {
        guideList.innerHTML = '<h5 class="center-align">Login to view content</h5>';
    }

}

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

/**
 * Function to set up UI.
 *
 * @param user - The user.
 * @export to auth.js
 */
export const setupUI = (user) => {
    if (user) {
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}