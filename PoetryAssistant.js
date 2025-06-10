// Global variable to cache the rhyme map after first build
let rhymeMap = null;

/**
 * Precomputes a map of word endings to words for efficient rhyme lookup
 * Original algorithm: Groups words by multiple ending lengths (3-6 chars)
 * @param {string[]} words - Array of English words
 * @returns {Object} Mapping of endings to word sets
 */
function buildRhymeMap(words) {
    const map = {};
    // Process each word in the list
    words.forEach(word => {
        const cleanWord = word.trim().toLowerCase();
        if (!cleanWord) return;
        
        // Generate keys for endings of length 3 to 6
        for (let len = 3; len <= 6; len++) {
            if (cleanWord.length < len) continue;
            const ending = cleanWord.slice(-len);
            
            // Initialize ending group if needed
            if (!map[ending]) map[ending] = new Set();
            
            // Add word to ending group
            map[ending].add(cleanWord);
        }
    });
    return map;
}

/**
 * Finds rhyming words using precomputed rhyme map
 * Original algorithm: Checks multiple ending lengths for comprehensive matches
 * @param {string} userWord - Input word to find rhymes for
 * @param {Object} rhymeMap - Precomputed rhyme map
 * @returns {string[]} Array of rhyming words
 */
function findRhymingWords(userWord, rhymeMap) {
    userWord = userWord.trim().toLowerCase();
    const results = new Set();
    
    // Check endings of length 3 to 6 characters
    for (let len = 3; len <= 6; len++) {
        if (userWord.length < len) continue;
        const ending = userWord.slice(-len);
        const words = rhymeMap[ending] || [];
        
        // Add matches excluding input word
        words.forEach(word => {
            if (word !== userWord) results.add(word);
        });
    }
    
    return Array.from(results);
}

/**
 * Fetches word list and finds rhyming words
 * Improved with caching, loading states, and error handling
 */
function fetchAndFindRhymingWords() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput.trim()) {
        alert("Please enter a word");
        return;
    }

    // Show loading state
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '<div class="loading">Finding rhymes...</div>';
    document.getElementById('resultCount').textContent = "0 found";

    // Use cached rhyme map if available
    if (rhymeMap) {
        const rhymingWords = findRhymingWords(userInput, rhymeMap);
        displayRhymingWords(rhymingWords);
        return;
    }

    // Fetch word list
    fetch('./Assets/wordlist.txt')
        .then(response => response.text())
        .then(data => {
            const allWords = data.split('\n');
            
            // Build rhyme map on first run
            rhymeMap = buildRhymeMap(allWords);
            
            // Find and display rhymes
            const rhymingWords = findRhymingWords(userInput, rhymeMap);
            displayRhymingWords(rhymingWords);
        })
        .catch(error => {
            console.error('Error:', error);
            resultContainer.innerHTML = '<div class="error">Error loading word list</div>';
        });
}

/**
 * Displays rhyming words in the UI
 * @param {string[]} words - Array of rhyming words
 */
function displayRhymingWords(words) {
    const resultContainer = document.getElementById('result');
    const resultCount = document.getElementById('resultCount');
    
    // Update count
    resultCount.textContent = `${words.length} found`;
    
    // Clear previous results
    resultContainer.innerHTML = '';
    
    // Handle no results
    if (words.length === 0) {
        resultContainer.innerHTML = '<div class="no-results">No rhyming words found</div>';
        return;
    }
    
    // Display results
    words.forEach(word => {
        const element = document.createElement('div');
        element.className = 'rhyme-word';
        element.textContent = word;
        resultContainer.appendChild(element);
    });
}
