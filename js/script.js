document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    const items = [];

    // Mock 100 image items with zero-padded filenames
    for (let i = 1; i <= 100; i++) {
        const padded = String(i).padStart(3, '0');
        items.push({
            type: 'image',
            src: `assets/images/image_${padded}.jpg`,
            title: `Artwork ${i}`
        });
    }

    // Mock 2 video items
    for (let i = 1; i <= 2; i++) {
        items.push({
            type: 'video',
            src: `assets/videos/video_${i}.mp4`,
            title: `Video Art ${i}`
        });
    }

    // Render items
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';

        const title = document.createElement('h3');
        title.textContent = item.title;
        div.appendChild(title);

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.title;
            div.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            div.appendChild(video);
        }

        const button = document.createElement('button');
        button.className = 'buy-button';
        button.textContent = 'Buy Now';
        button.onclick = () => alert('Purchase link TBD');
        div.appendChild(button);

        gallery.appendChild(div);
    });
});