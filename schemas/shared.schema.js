exports.boolean = {
  type: 'boolean'
}

exports.stringCanEmpty = {
  type: 'string',
  minLength: 0,
};

exports.stringNotEmpty = {
  type: 'string',
  minLength: 1,
};
 
exports.mongoObjectId = {
  type: 'string',
  minLength: 24,
  maxLength: 24,
  pattern: '^[0-9a-fA-F]{24}$'
}

exports.email = {
  type: 'string',
  minLength: 1,
  format: "email",
}

exports.numberPositive = {
  type: 'number',
  minimum: 0,
};

exports.integerPositive = {
  type: 'integer',
  minimum: 0,
};

exports.attributeHasName = {
  type: 'array',
  uniqueItems: true,
  items: {
    type: 'object',
    properties: {
      name: exports.stringNotEmpty,
    },
    required: ['name'],
  }
};

exports.attributeHasValue = {
  type: 'array',
  uniqueItems: true,
  items: {
    type: 'object',
    properties: {
      name: exports.stringNotEmpty,
      value: exports.stringNotEmpty,
    },
    required: ['name', 'value'],
  }
};

exports.metafields = {
  type: 'array',
  uniqueItems: true,
  items: {
    type: 'object',
    properties: {
      key: exports.stringNotEmpty,
      value: exports.stringNotEmpty,
    },
    required: ['key', 'value'],
  }
};

exports.arrayStrings = {
  type: 'array',
  uniqueItems: true,
  items: exports.stringNotEmpty
};

exports.numberPhone = {
  type: 'string',
  maxLength: 11,
  minLength: 9,
  pattern: '^0[0-9]{9,10}$'
};

exports.addresses = {
  type: 'object',
  properties: {
    address: exports.stringNotEmpty,
    province_code: exports.stringNotEmpty,
    district_code: exports.stringNotEmpty,
    ward_code: exports.stringNotEmpty,

    company: exports.stringNotEmpty,
    country: exports.stringNotEmpty,
    first_name: exports.stringNotEmpty,
    last_name: {
      type: 'string'
    },
    phone: exports.numberPhone,

    zip: exports.stringNotEmpty,
    default: exports.stringNotEmpty,

  },
  required: ['address', 'country', 'first_name'],
};

exports.birthday = {
  pattern: '^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$'
};

exports.getListSkip = {
  type: 'integer',
  minimum: 0,
  default: 0,
};

exports.dateTime = {
  type: 'string',
  format: 'date-time'
};

exports.getListSkip = {
  type: 'integer',
  minimum: 0,
  default: 0
};

exports.getListLimit = {
  type: 'integer',
  minimum: 1,
  default: 100
};

exports.dateTimeCanEmpty = {
  "anyOf": [ 
      { 
          type: 'string',
          format: 'date-time',
      }, 
      { 
          "type": ["string", "null"]
      } 
    ]
};

exports.emailCanEmpty = {
  "anyOf": [ 
      { 
          type: 'string',
          minLength: 1,
          format: 'email',
      }, 
      { 
          "type": ["string", "null"]
      } 
    ]
};
