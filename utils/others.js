/**
 * goal function: built text search by arr fields name
 * @fields {array[String]} array fields name
 * @q {string} param
 */
function buildTextSearch(fields = [], q = '') {
  const query = {
    $or: [],
  };

  if (!fields.length || q === '') {
    return query;
  }

  fields.forEach((field) => {
    query.$or.push(
      {
        [field]: new RegExp(q, 'i'),
      },
    );
  });
  return query;
}

module.exports = {
  buildTextSearch,
};
