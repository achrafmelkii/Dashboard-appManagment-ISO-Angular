// models/userModel.js
const admin = require('firebase-admin');

class AdminModel {
  async getAllAdmins() {
    //console.log("hello");
    const snapshot = await admin.firestore().collection('admins').get();
    return snapshot.docs.map(doc => doc.data());
  }


  async getAdminById(userId) {
    const userDoc = await admin.firestore().collection('admins').doc(userId).get();
    return userDoc.exists ? userDoc.data() : null;
  }

  async createAdmin(newUser) {
    try {
    const docRef = await admin.firestore().collection('admins').doc(newUser.ID);
    await docRef.set(newUser);
    // newUser.ID = docRef.id;
    // await docRef.update({ ID: docRef.id });
    return docRef.id;  
    } catch (error) {
        throw error;
      }
  }

  async updateAdmin(userId, updatedUser) {
    await admin.firestore().collection('admins').doc(userId).set(updatedUser, { merge: true });
  }

  async deleteAdmin(userId) {

    await admin.firestore().collection('admins').doc(userId).delete();
  }

  async getAllUsers() {
    const userList = [];
    const listUsersResult =  await admin.auth().listUsers();
    listUsersResult.users.forEach(userRecord => {
        userList.push(userRecord.toJSON());
    });
    console.log(userList);
    return userList;
  }
  async getAllNonAdminUsers() {
    const nonAdminUsers = [];
    
    // Get all admins
    const adminsSnapshot = await admin.firestore().collection('admins').get();
    const adminEmails = adminsSnapshot.docs.map(doc => doc.data().email);
    
    // Get all users
    const listUsersResult =  await admin.auth().listUsers();
    listUsersResult.users.forEach(userRecord => {
        const userData = userRecord.toJSON();
        // Check if the user's email is not in the list of admin emails
        if (!adminEmails.includes(userData.email)) {
            nonAdminUsers.push(userData);
        }
    });
    
    //console.log(nonAdminUsers);
    return nonAdminUsers;
}




}

module.exports = new AdminModel();
