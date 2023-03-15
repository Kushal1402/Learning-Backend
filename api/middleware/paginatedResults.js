module.exports = function paginatedRes(data) {
    return (req, res, next) => {

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        // console.log(limit, "limit")

        const startIndex = (page - 1) * limit;
        // console.log(startIndex, "startIndex")
        const endIndex = page * limit;
        // console.log(endIndex, "endIndex")

        const result = data.slice(startIndex, endIndex);
        // console.log(result.length, "result length")

        const totalDocs = result.length > 0 ? data.length : 0;
        // console.log(totalDocs, "totalDocs length")

        const nextPage = result.length >= limit ? (Number(page) + 1) : null;
        // console.log(nextPage, "nextPage")
        const prevPage = page === 1 ? null : null || result.length <= limit ? (Number(page) - 1) : null;

        const hasNextPage = endIndex < data.length ? true : false;
        const hasPrevPage = startIndex >= 1 ? true : false;

        res.paginatedResults = result;
        res.hasNextPage = hasNextPage;
        res.hasPrevPage = hasPrevPage;
        res.nextPage = nextPage;
        res.prevPage = prevPage;
        res.totalDocs = totalDocs;
        res.limit = limit;
        res.page = page;

        next();
    }
}