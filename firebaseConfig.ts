import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyD9P-Vj0v2Ux4dSFH_wmOHufkVDF7gN9bw",
	authDomain: "valo-lab.firebaseapp.com",
	projectId: "valo-lab",
	storageBucket: "valo-lab.appspot.com",
	messagingSenderId: "433476617958",
	appId: "1:433476617958:web:8867d9d209b651527add27",
	measurementId: "G-NHN9LLH2NC",
};

// Firebaseアプリの初期化
const firebaseApp = !getApps().length
	? initializeApp(firebaseConfig)
	: getApps()[0];

// Firebase Storageの取得
const storage = getStorage(firebaseApp);

export { storage };
