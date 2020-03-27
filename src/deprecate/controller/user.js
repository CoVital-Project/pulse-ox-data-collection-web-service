//import Persistence from "./persistence";
import User from '../model/user';

export default class UserController {
  constructor() {
    // this.userPersistence = new Persistence(User);
  }

  async find(query, extras = null) {
    //query or extras not used yet
    if (!extras) {
      extras = {};
    }

    return await User.find({})
      .lean()
      .exec();
  }

  async save(userData, extras = null) {
    //create user
    console.log('here!');
    // extras not used yet
    if (!extras) {
      extras = {};
    }
    var newUser = new User(userData);

    try {
      return newUser.save(userData);
    } catch (err) {
      return err;
    }
  }
}
