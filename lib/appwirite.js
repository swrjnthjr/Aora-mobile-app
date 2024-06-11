import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const appWriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "666575a7003d05cf0c77",
  databaseId: "666576f30036850a238f",
  userCollectionId: "666577160024638af44a",
  videoCollectionId: "66657750000bb05ee15a",
  storageId: "66674a70003ddc0c4c2f",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appWriteConfig.endpoint)
  .setProject(appWriteConfig.projectId) // Your project ID
  .setPlatform(appWriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatar = new Avatars(client);
const database = new Databases(client);

export const createUser = async (formData) => {
  try {
    const { email, password, username } = formData;
    const newAccount = await account
      .create(ID.unique(), email, password, username)
      .then(
        function (response) {
          console.log(response);
        },
        function (error) {
          console.error('response error',error);
        }
      );
    console.log(newAccount)
    if (!newAccount) {
      throw Error("user not found");
    }
    const avatarUrl = avatar.getInitials(username);
    await signIn(email, password);
    const newUser = await database.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique,
      {
        accountId: newAccount.$id,
        email: email,
        username,
        avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.error("create error",error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (err) {
    console.error("sign in error",err);
    throw new Error(err);
  }
};
// Register User
