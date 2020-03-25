const populate = function(entity, attributes, validate = false) {
  for (const att in attributes) {
    if (attributes[att] !== null && typeof attributes[att] !== undefined) {
      entity[att] = attributes[att];
    }
  }
  if (validate) {
    const missing = emptyFields(entity);
    if (missing.length > 0) {
      throw new Error(
        'populate(): Attributes missing: ' + JSON.stringify(missing)
      );
    }
  }
};

const emptyFields = entity => {
  const missing = [];
  for (const att in entity) {
    if (empty(entity[att])) {
      const attr = {};
      attr[att] = entity[att];
      missing.push(attr);
    }
  }
  return missing;
};

const empty = obj => {
  return typeof obj === undefined || obj === null || obj === '';
};

const Entity = { populate, emptyFields };

export default Entity;
module.exports = Entity;
