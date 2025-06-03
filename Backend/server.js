const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = 3000;



app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK with your Firebase service account key
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mobileunity-bf7b4-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "mobileunity-bf7b4.appspot.com",
  messagingSenderId: "198837751387",
});


const Routes = require('./routes/mainRoutes');



app.use('/api', Routes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});