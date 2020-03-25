import Entity from './entity';

const resolve = mongooseOperation => {
  const promise =
    mongooseOperation.constructor.name === 'Promise'
      ? mongooseOperation
      : mongooseOperation.exec();

  return promise.then(result => {
    if (result && Array.isArray(result) && result.length === 1) {
      result = result[0];
    }
    return result;
  });
};

export default class Persistence {
  constructor(type) {
    if (!(type.prototype.constructor.name === 'model')) {
      throw new Error('Controller accepts only mongoose models as types');
    }
    this.type = type;
  }

  find(query, extras) {
    let mongooseQuery;
    if (extras) {
      mongooseQuery = this.type.paginate(query, extras);

      // console.timeEnd('paginate');
    } else {
      mongooseQuery = this.type.paginate(query);
    }
    return mongooseQuery;
  }

  findOne(query, lean = true) {
    if (lean) {
      return this.type.findOne(query).lean();
    } else {
      return this.type.findOne(query);
    }
  }

  findByIdAndUpdate(id, query, lean = true) {
    return this.type.findByIdAndUpdate(id, query, { lean: lean });
  }

  save(attributes) {
    const entity = new this.type();
    Entity.populate(entity, attributes);
    console.log('entity ', entity);
    return resolve(entity.save());
  }

  update(query, attributes, options = {}) {
    return resolve(
      this.type.update(query, attributes, { new: true }) //...options
    );
  }

  updateMany(query, attributes) {
    return resolve(this.type.updateMany(query, attributes));
  }

  deleteOne(query) {
    return resolve(this.type.deleteOne(query));
  }
}

/* Simoes - Custom Exception for no results.
 * Useful for propagating non-generic errors up the stack
 */

function ZeroResultsException(message) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, ZeroResultsException);
  } else this.stack = new Error().stack;
}

ZeroResultsException.prototype = Object.create(Error.prototype);
ZeroResultsException.prototype.name = 'ZeroResultsException';
ZeroResultsException.prototype.constructor = ZeroResultsException;
