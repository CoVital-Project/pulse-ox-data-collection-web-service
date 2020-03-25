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
    console.log('before');

    let result = await User.find({})
      .lean()
      .exec();
    console.log('after: ', result);
    return result;
  }
}
