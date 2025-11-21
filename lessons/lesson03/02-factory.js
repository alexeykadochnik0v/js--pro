const createUser = (username) => {
  return {
    username,
    showUsername() {
      console.log(`My name is ${username}`);
    },
  };
};

const user1 = createUser("nik");

user1.showUsername();

class User {
  static async make() {
    // await

    return new User(username, dbDefaultValues);
  }

  // Не асинхрорнный
  constructor(username, dbDefaultValues) {
    this.username = username;
    // await
  }

  async init() {
    // await
  }

  showUsername() {
    console.log(`My name is ${this.username}`);
  }
}

const user2 = new User("nik2");
user2.showUsername();
