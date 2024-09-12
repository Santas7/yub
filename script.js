const apiKey = 'AIzaSyAmkHj3pn9XWGJUNGsxTL37FIqBf-YEDXU';

document.getElementById('searchBtn').addEventListener('click', function() {
    const query = document.getElementById('search').value;
    if (query.trim()) {
        fetchVideos(query);
    } else {
        alert("Please enter a search query.");
    }
});

function fetchVideos(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${apiKey}&regionCode=GB`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const videos = data.items;
            const videosContainer = document.getElementById('videos');
            videosContainer.innerHTML = '';

            if (videos && videos.length > 0) {
                videos.forEach(video => {
                    const videoId = video.id.videoId;
                    const videoElement = document.createElement('div');
                    videoElement.classList.add('video');
                    videoElement.innerHTML = `
                        <img src="${video.snippet.thumbnails.medium.url}" alt="Thumbnail" class="thumbnail" data-video-id="${videoId}">
                        <div class="video-info">
                            <h3 class="title">${video.snippet.title}</h3>
                            <p class="description">${video.snippet.description.substring(0, 100)}...</p>
                        </div>
                    `;
                    videoElement.addEventListener('click', () => {
                        showVideoDetails(videoId);
                    });
                    videosContainer.appendChild(videoElement);
                });
            }
        })
        .catch(error => console.error('Error fetching videos:', error));
}

function showVideoDetails(videoId) {
    const playerContainer = document.getElementById('videoPlayerContainer');
    const player = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const viewCount = document.getElementById('viewCount');
    const videoDescription = document.getElementById('videoDescription');
    const toggleDescription = document.getElementById('toggleDescription');
    const relatedVideosContainer = document.getElementById('relatedVideos');

    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    playerContainer.classList.add('show');
    document.getElementById('videos').style.display = 'none';

    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}&regionCode=GB`)
        .then(response => response.json())
        .then(data => {
            const videoData = data.items[0];
            videoTitle.textContent = videoData.snippet.title;
            viewCount.textContent = formatNumber(videoData.statistics.viewCount) + ' views';
            videoDescription.textContent = videoData.snippet.description.substring(0, 200) + '...';

            toggleDescription.onclick = () => {
                if (videoDescription.style.maxHeight === 'none') {
                    videoDescription.style.maxHeight = '100px';
                    toggleDescription.innerHTML = '<i class="fas fa-chevron-down"></i> Show More';
                    toggleDescription.classList.remove('expanded');
                } else {
                    videoDescription.style.maxHeight = 'none';
                    toggleDescription.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
                    toggleDescription.classList.add('expanded');
                }
            };

            // Fetch related videos
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=20&key=${apiKey}&regionCode=GB`)
                .then(response => response.json())
                .then(relatedData => {
                    const relatedVideos = relatedData.items;
                    relatedVideosContainer.innerHTML = '';

                    relatedVideos.forEach(video => {
                        const relatedVideoId = video.id.videoId;
                        const relatedVideoElement = document.createElement('div');
                        relatedVideoElement.classList.add('video');
                        relatedVideoElement.innerHTML = `
                            <img src="${video.snippet.thumbnails.medium.url}" alt="Thumbnail" class="thumbnail">
                            <div class="video-info">
                                <h3 class="title">${video.snippet.title}</h3>
                            </div>
                        `;
                        relatedVideoElement.addEventListener('click', () => {
                            showVideoDetails(relatedVideoId);
                        });
                        relatedVideosContainer.appendChild(relatedVideoElement);
                    });
                })
                .catch(error => console.error('Error fetching related videos:', error));
        })
        .catch(error => console.error('Error fetching video details:', error));
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('videoPlayerContainer').classList.remove('show');
    document.getElementById('videoPlayerContainer').classList.add('hide');
    document.getElementById('videos').style.display = 'flex';
});

document.getElementById('videoPlayerContainer').addEventListener('click', (event) => {
    if (event.target === document.getElementById('videoPlayerContainer')) {
        document.getElementById('videoPlayerContainer').classList.remove('show');
        document.getElementById('videoPlayerContainer').classList.add('hide');
        document.getElementById('videos').style.display = 'flex';
    }
});
