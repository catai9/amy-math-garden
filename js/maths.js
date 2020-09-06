/**
 * Loads a new question by randomly choosing numbers between 0-4 and 0-5.
 * Sets the answer class variable to the new sum (configured to be less than 9).
 */
function loadNewQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    const n2 = Math.ceil(Math.random() * 5);

    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;

    answer = n1 + n2;
}

/**
 * Checks the answer given by the user against the correct answer.
 * If correct, adds 1 to the score.
 *  If the score is less than 6, adds a new background image.
 *  Else, resets the score and displays an alert to the user to restart.
 * If incorrect, subtracts 1 from the score, displays an alert, and removes a background image after 1 second (if any exist).
 */
function checkAnswer() {
    const prediction = predictImage();

    if (prediction == answer) {
        score++;

        if (score <= 6) { 
            backgroundImages.push(`url('images/background${score}.svg')`);
        } else {
            alert('Well done! Your math garden is in full bloom! Want to start again?');
            resetScore();
        }
        
        document.body.style.backgroundImage = backgroundImages;
    } else {
        if (score != 0) score--;

        alert('Oops! Check your calculations and try writing the number neater next time!');

        setTimeout(function() {
            backgroundImages.pop();
            document.body.style.backgroundImage = backgroundImages;
        }, 1000);
    }

}

/**
 * Resets the score to 0 and resets the background image array to an empty array.
 */
function resetScore() {
    score = 0;
    backgroundImages = [];
}