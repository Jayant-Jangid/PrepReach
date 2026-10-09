const parseQueryOptions = (query) => {
  const sort = query.sort ? query.sort.split(',').join(' ') : '-createdAt';
  const fields = query.fields ? query.fields.split(',').join(' ') : '-__v';
  return { sort, fields };
};

module.exports = { parseQueryOptions };
