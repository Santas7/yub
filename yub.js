const apiKey = 'AIzaSyBpqQI4hGax3ycRBcxxbzAgXebQQ29iTh8'; 

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|watch\?v=|v\/|.+\?v=)?([^"&?\/\s]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}

async function fetchVideoInfo(videoId, apiKey) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            throw new Error('No video information found');
        }

        return data.items[0].snippet;
    } catch (error) {
        console.error('Failed to fetch video information', error);
        throw error;
    }
}

async function loadVideo() {
    const url = document.getElementById('video-url').value;
    const videoId = extractVideoId(url);

    if (!videoId) {
        alert('Invalid YouTube URL');
        return;
    }

    try {
        const snippet = await fetchVideoInfo(videoId, apiKey);
        document.getElementById('video-frame').src = `https://www.youtube.com/embed/${videoId}`;
        document.getElementById('video-title').textContent = snippet.title;
        document.getElementById('video-description').textContent = snippet.description;
    } catch (error) {
        document.getElementById('video-title').textContent = 'Failed to load video information';
    }
}