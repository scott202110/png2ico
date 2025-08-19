import { PngIcoConverter } from './png2ico.js';

const pngFile = document.getElementById('png-file');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');

convertBtn.addEventListener('click', async () => {
    if (pngFile.files.length === 0) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Please select a PNG file.</div>';
        return;
    }

    const file = pngFile.files[0];
    if (file.type !== 'image/png') {
        resultDiv.innerHTML = '<div class="alert alert-danger">Please select a valid PNG file.</div>';
        return;
    }

    try {
        resultDiv.innerHTML = '<div class="alert alert-info">Converting...</div>';

        const converter = new PngIcoConverter();
        const inputs = [{ png: file, ignoreSize: true }];
        const blob = await converter.convertToBlobAsync(inputs);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favicon.ico';
        a.className = 'btn btn-success';
        a.innerText = 'Download ICO';
        resultDiv.innerHTML = '';
        resultDiv.appendChild(a);
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<div class="alert alert-danger">An error occurred during conversion: ${error.message}</div>`;
    }
});
