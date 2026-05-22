const API_URL = '/api/generate';  // This will work on Vercel

document.getElementById('generateBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    
    if (!inputText.trim()) {
        alert('Please enter some content first!');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('outputSection').style.display = 'none';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: inputText })
        });
        
        const data = await response.json();
        
        // Display results
        displayCaptions(data.captions);
        displayHashtags(data.hashtags);
        
        document.getElementById('outputSection').style.display = 'block';
    } catch (error) {
        alert('Error: ' + error.message + '\nMake sure your API key is set up correctly.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

function displayCaptions(captions) {
    const container = document.getElementById('captions');
    container.innerHTML = '';
    captions.forEach(caption => {
        const div = document.createElement('div');
        div.className = 'caption-item';
        div.textContent = caption;
        container.appendChild(div);
    });
}

function displayHashtags(hashtags) {
    const container = document.getElementById('hashtags');
    container.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'hashtag-item';
    div.textContent = hashtags.join(' ');
    container.appendChild(div);
}

document.getElementById('copyBtn').addEventListener('click', () => {
    const captions = Array.from(document.querySelectorAll('.caption-item')).map(el => el.textContent);
    const hashtags = document.querySelector('.hashtag-item')?.textContent || '';
    const allText = captions.join('\n\n') + '\n\n' + hashtags;
    
    navigator.clipboard.writeText(allText);
    alert('Copied to clipboard! ✅');
});
