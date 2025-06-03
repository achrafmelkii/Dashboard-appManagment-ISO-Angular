const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

class AuthController {
  async register(req, res) {
    const { email, password } = req.body;
  
    try {

      const adminUser = await admin.firestore().collection('admins').where('email', '==', email).get();
      if (!adminUser.empty) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      // const userRecord = await admin.auth().createUser({
      //   email,
      //   password,
      // });
     
      await admin.firestore().collection('admins').doc(userRecord.uid).set({
        email : email,
        isSuperAdmin : false
      });

      // Create a JWT for the user using the secret key from environment variables
      const token = jwt.sign({ userId: userRecord.uid }, process.env.SECRET_KEY, { expiresIn: '1m' });

      return res.json({ uid: userRecord.uid, idToken:token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    const { email, password ,displayName} = req.body;
    if(!email || !password || !displayName ) {
      res.status(400).json({ success: false, error: 'Bad Request' });
      return;
    }
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      

      const adminSnapshot = await admin.firestore().collection('admins').doc(userRecord.uid).get();
      console.log(adminSnapshot);
      const userSnapshot = await admin.firestore().collection('users').doc(userRecord.uid).get();

      if(!adminSnapshot.exists && !userSnapshot.exists)
      {
        await admin.auth().deleteUser(userRecord.uid);
        res.status(403).json({ error: 'Unauthorized !' });
        return;
      }



      if (!adminSnapshot.exists){
        console.log("no admin");
        return res.status(403).json({ error: 'Unauthorized no admin' });
      
      }
      const name = adminSnapshot.data().name;
      if(!name){
          await admin.firestore().collection('admins').doc(userRecord.uid).set({
            name : displayName,
          }, { merge: true });
      }
      // You can check the password here or use Firebase Authentication features
      const isSuperAdmin = adminSnapshot.data().isSuperAdmin;
      //console.log(isSuperAdmin);
      // Create a JWT for the user using the secret key from environment variables
      const token = jwt.sign({ userId: userRecord.uid }, process.env.SECRET_KEY, { expiresIn: '1h' });

      res.json({ uid: userRecord.uid, idToken:token,isSuper:isSuperAdmin });
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async checkSuperAdmin(req, res) {
  
    const uid = req.body.uid;
    if(!uid) {
      return res.status(400).json({ success: false, error: 'Bad Request' });
   
    }
    try {
      // Verify the JWT using the secret key from environment variables
      const adminSnapshot = await admin.firestore().collection('admins').doc(uid).get();

      if (!adminSnapshot.exists){
        console.log("no admin");
        return res.status(403).json({ error: 'Unauthorized no admin' });

      }
      const isSuperAdmin = adminSnapshot.data().isSuperAdmin;

      //console.log(isSuperAdmin);
      res.json({ isSuperAdmin: isSuperAdmin });
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  async checkAuth(req, res) {
  
    const token = req.body.token;
    if(!token) {
      return res.status(400).json({ success: false, error: 'Bad Request' });
    }
    try {
      // Verify the JWT using the secret key from environment variables
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Extract information from the decoded token as needed
      const uid = decodedToken.userId;

      res.json({ idToken: uid });
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  async getuidFromToken(req){
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      console.log("no authorizationHeader");
      return;
    }
  
    const [scheme, token] = authorizationHeader.split(' ');
  
    if (!token || !scheme) {
      console.log("no token");
      return;
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Extract information from the decoded token as needed
    const uid = decodedToken.userId;
    const adminSnapshot = await admin.firestore().collection('admins').doc(uid).get();
    if (!adminSnapshot.exists){
      console.log("no admin");
      return;

    }
    return adminSnapshot.data().name;
  }
  logout(req, res) {
    // Perform any necessary logout operations
    res.json({ message: 'Logout successful' });
  }
}

module.exports = new AuthController();
