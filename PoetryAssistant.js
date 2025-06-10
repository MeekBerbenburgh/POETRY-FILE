// Function to find rhyming words
function findRhymingWords(userWord, allWords) {
    var rhymingWords = [];

    // Trim user input
    userWord = userWord.trim();

    // Iterate through all words
    for (var i = 0; i < allWords.length; i++) {
        var currentWord = allWords[i].trim();

        // Check if the last two characters of the current word match the user's input
        if (currentWord.slice(-3) == userWord.slice(-3)) {
            rhymingWords.push(currentWord);
        }
    }

    // Return the array of rhyming words
    return rhymingWords;
}

// Function to fetch word list and find rhyming words
function fetchAndFindRhymingWords() {
    var userInput = document.getElementById('userInput').value;

    // Fetch word list from a remote file
    fetch('./Assets/wordlist.txt')
        .then(response => response.text())
        .then(data => {
            // Convert the string of words to an array
            var allWords = data.split("\n");

            // Find rhyming words using the function
            var rhymingWords = findRhymingWords(userInput, allWords);

            // Store the result in a variable
            displayRhymingWords(rhymingWords);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to display rhyming words
function displayRhymingWords(words) {
    var resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    for (let i = 0; i < words.length; i++) {
        var word = words[i];
        var paragraph = document.createElement('p');
        paragraph.textContent = word;
        resultContainer.appendChild(paragraph);
    }
}