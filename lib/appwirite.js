import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
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
  .setEndpoint(config.endpoint)
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const database = new Databases(client);

// Register User
export const createUser = async (formData) => {
  try {
    const { email, password, username } = formData;
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    // .then(
    //   function (response) {
    //     console.log(response);
    //     return response;
    //   },
    //   function (error) {
    //     console.error("response error", error);
    //   }
    // );
    console.log(newAccount);
    if (!newAccount) {
      throw Error("user not found");
    }
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await database.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        userName: username,
        avatar: avatarUrl,
      }
    );
    console.log(newUser);
    return newUser;
  } catch (error) {
    console.error("create error", error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (err) {
    console.error("sign in error", err);
    throw new Error(err);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error;
    }

    const currentUser = await database.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) {
      throw Error;
    }

    return currentUser.documents[0]
  } catch (error) {
    console.error(error);
  }
};
