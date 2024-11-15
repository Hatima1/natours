class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    // console.log(this.queryString);

    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    // console.log(this.query);
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBY = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBY);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      fields = this.queryString.fields.split(',').join(' ');
      this.query = query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
