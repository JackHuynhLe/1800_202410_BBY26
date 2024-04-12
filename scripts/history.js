/**
 * Function to handle the toggle event.
 */
document.addEventListener("DOMContentLoaded", () => {
    toggleEvent("#travelHistoryBtn", "#travelHistoryContainer");

    oneActiveTwo("#backToHistoryBtn", "#historyMapContainer", "#historySelectContainer");
});

/**
 * Init toggle event function
 *
 * @param {string} activatorSelector the element selector that will trigger the event
 * @param {string} targetSelector the element selector that will be toggled
 */
function toggleEvent(activatorSelector, targetSelector) {

    const activator = document.querySelectorAll(activatorSelector);
    const targets = document.querySelectorAll(targetSelector);


    if (activator.length && targets.length) {
        activator.forEach(activator => activator.addEventListener("click", () => {
            //Change the class of the target elements
            targets.forEach(target => target.classList.toggle("initiallyHidden"));
        }));
    }
}

/**
 * Init one active two toggle event function
 *
 * @param activatorSelector the element selector that will trigger the event
 * @param targetSelector the element selector that will be toggled
 * @param targetSelector1 the element selector that will be toggled
 */
function oneActiveTwo(activatorSelector, targetSelector, targetSelector1) {
    toggleEvent(activatorSelector, targetSelector);
    toggleEvent(activatorSelector, targetSelector1);
}

/**
 * Function to function to function to funnnnccccaasfdasdaf Creeper? aa Errooooorrrr atay awaittt
 * Easterrrr EEEEEEGGG CyyybbaabeEeeer EAEEAEEERRRRAORRR
 *
 *@see iuuqt://hjuivc.dpn/ZvboYjRXR
 */
{
    {
        {
            {
                {
                    {
                        {
                            {
                                {
                                    {
                                        {
                                            {
                                                {
                                                    {
                                                        {
                                                            {
                                                                {
                                                                    {
                                                                        {
                                                                            {
                                                                                {
                                                                                    {
                                                                                        {
                                                                                            {
                                                                                                {
                                                                                                    {
                                                                                                        {
                                                                                                            {
                                                                                                                {
                                                                                                                    /*
                                                                                                                    alert(
                                                                                                                        "Congratulations, you find an Easter Egg! 🎉"
                                                                                                                    );
                                                                                                                    */
                                                                                                                    console.log(
                                                                                                                        "Perhaps there is an Easter egg nearby."
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
