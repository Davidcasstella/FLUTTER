const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const startButton = document.getElementById('startCapture');
const context = canvas.getContext('2d');
let photoCount = 0;

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing the camera:', err);
    }
}

async function loadModels() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/models');
        console.log("Modelos cargados correctamente");
        startButton.disabled = false; // Habilitar botón solo después de cargar los modelos
    } catch (err) {
        console.error("Error al cargar los modelos:", err);
    }
}


async function detectFaces() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    console.log("Detecciones:", detections); // Para confirmar si detecta rostros

    if (detections.length > 0) {
        console.log("Rostro detectado, comenzando a capturar imágenes...");
        for (let i = 0; i < 5; i++) {
            captureImage();
            await new Promise(resolve => setTimeout(resolve, 200)); // Pausa entre capturas
        }
    } else {
        alert('No se detectó ningún rostro. Por favor, intenta de nuevo.');
    }
}


function captureImage() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    downloadImage(dataURL, `photo_${photoCount + 1}.png`);
    photoCount++;
    console.log("Imagen capturada:", `photo_${photoCount}`);
}


function downloadImage(dataURL, filename) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

startButton.addEventListener('click', detectFaces);

// Initialize the app
startCamera();
loadModels();
