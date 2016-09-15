function Pagination(page, limit) {
    this.page = page > 0 ? page : 1;
    this.page--;
    this.limit = limit ? limit : 20;
    this.offset = this.page * this.limit;
};

module.exports = Pagination;