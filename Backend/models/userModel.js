// models/userModel.js
const admin = require('firebase-admin');

class UserModel {
  async getAllUsers() {
    const snapshot = await admin.firestore().collection('users').get();
    return snapshot.docs.map(doc => doc.data());
  }
  async getAllUsersWithToken() {
    const snapshot = await admin.firestore().collection('users').where('token', '!=', null).get();
    const usersWithToken = [];

    snapshot.forEach(doc => {
      const userData = doc.data();
      // Ensure the 'token' field exists in the user data
      if (userData.token) {
        usersWithToken.push(userData.token);
      }
    });

    return usersWithToken;
  }
  async getAllUsersWithTokenv2() {
    const snapshot = await admin.firestore().collection('users').where('token', '!=', null).get();
    const usersWithToken = [];
    const firestoreUsers = snapshot.docs.map(doc => {
      const data = doc.data();
      data.source = 'firestore'; // Adding a source field to differentiate users from Firestore
      return data;
  });

    snapshot.forEach(doc => {
      const userData = doc.data();
      // Ensure the 'token' field exists in the user data
      if (userData.token && !usersWithToken.includes(userData.token)) {
        usersWithToken.push(userData.token);
      }
    });
    const authListUsersResult = await admin.auth().listUsers();
    const authUsers = authListUsersResult.users.map(userRecord => {
        const data = userRecord.toJSON();
        data.source = 'auth'; // Adding a source field to differentiate users from Authentication
        return data;
    });
    const joinedUsers = [];
    firestoreUsers.forEach(firestoreUser => {
        authUsers.forEach(authUser => {
            if (firestoreUser.ID === authUser.uid) {
              console.log(authUser);
                joinedUsers.push({
                    ...firestoreUser,
                    email: authUser.email,
                    source: 'both' // Marking users present in both sources
                });
            }
        });
    });
    return usersWithToken;
  }
  async getUserById(userId) {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    return userDoc.exists ? userDoc.data() : null;
  }

  async createUser(newUser) {
    try {
    const docRef = await admin.firestore().collection('users').add(newUser);
    newUser.ID = docRef.id;
    await docRef.update({ ID: docRef.id });
    return docRef.id;  
    } catch (error) {
        throw error;
      }
  }

  async updateUser(userId, updatedUser) {
    if (updatedUser.email) {
      delete updatedUser.email;
      delete updatedUser.source;
    }
    await admin.firestore().collection('users').doc(userId).set(updatedUser, { merge: true });
  }

  async deleteUser(userId) {
    try {
      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      if (!userDoc.exists) {
        console.log(`User with ID ${userId} does not exist.`);
        return false; 
      }
 
      await userDoc.ref.delete();
      console.log(`User with ID ${userId} successfully deleted.`);
      return true; // Return true if the deletion is successful
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      return false; // Return false if there's an error during deletion
    }
  }

 async getAllUsersWithAuth() {
    try {
        // Fetch users from Firestore
        const firestoreSnapshot = await admin.firestore().collection('users').get();
        const firestoreUsers = firestoreSnapshot.docs.map(doc => {
            const data = doc.data();
            data.source = 'firestore'; // Adding a source field to differentiate users from Firestore
            return data;
        });

        // Fetch users from Firebase Authentication
        const authListUsersResult = await admin.auth().listUsers();
        const authUsers = authListUsersResult.users.map(userRecord => {
            const data = userRecord.toJSON();
            data.source = 'auth'; // Adding a source field to differentiate users from Authentication
            return data;
        });

        // Perform join based on common fields ID and uid
        const joinedUsers = [];
        firestoreUsers.forEach(firestoreUser => {
            authUsers.forEach(authUser => {
                if (firestoreUser.ID === authUser.uid) {
                    joinedUsers.push({
                        ...firestoreUser,
                        email: authUser.email,
                        source: 'both' // Marking users present in both sources
                    });
                }
            });
        });

        return joinedUsers;
    } catch (error) {
        throw error;
    }
}
}

module.exports = new UserModel();
