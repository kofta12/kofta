// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPCWGhr4xHz28Dr7e1ghMw6X-30uzAFoA",
  authDomain: "marim-7f946.firebaseapp.com",
  projectId: "marim-7f946",
  storageBucket: "marim-7f946.appspot.com",
  messagingSenderId: "431477675747",
  appId: "1:431477675747:web:312d6e51f77154546217d6",
  measurementId: "G-XEK9PMPGKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);  // Initialize the Firebase Realtime Database

// Function to record attendance in Firebase
function recordAttendance(studentId) {
  const attendanceRef = ref(database, 'attendance/' + studentId);
  set(attendanceRef, {
    timestamp: new Date().toISOString(),
    status: 'present'
  })
  .then(() => {
    console.log("Attendance recorded successfully!");
  })
  .catch((error) => {
    console.error("Error recording attendance: ", error);
  });
}

// Function to start QR Code scanner
function startScanner() {
  const html5QrCode = new Html5Qrcode("preview");

  html5QrCode.start(
    { facingMode: "environment" },  // Use the back camera of the device
    {
      fps: 10,    // Scans per second
      qrbox: 250  // The size of the box for scanning the QR code
    },
    (decodedText, decodedResult) => {
      // When a QR code is successfully scanned
      document.getElementById('status').innerHTML = `QR Code detected: ${decodedText}`;
      recordAttendance(decodedText);  // Record the student ID in Firebase
    },
    (errorMessage) => {
      // Handle errors or unsuccessful scans
      document.getElementById('status').innerHTML = "Scanning...";
    }
  ).catch(err => {
    console.error("Error starting QR Code scanner: ", err);
  });
}

// Function to generate QR Code for a student ID
function generateQrCode(studentId) {
  const qrContainer = document.getElementById('qrContainer');

  // Clear any existing QR Code
  qrContainer.innerHTML = '';

  // Generate a new QR Code
  QrCode.toCanvas(qrContainer, studentId, function (error) {
    if (error) console.error(error);
    console.log('QR Code generated for', studentId);
  });
}

// Start the scanner on page load
window.onload = () => {
  startScanner();

  // Example usage of QR Code generation
  generateQrCode('student123');  // Replace 'student123' with actual student ID
};
