exports.role={
    owner:"owner",
    customer:"customer"
}

exports.getPaginationValue = (pageX, limitX) => {
    let page = parseInt(pageX) || 1
    let limit = parseInt(limitX) || 5
    let skip = (limit * (page - 1));
    return {
        page: page,
        limit: limit,
        skip: skip
    }
}