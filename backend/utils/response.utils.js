exports.successRes = ({ message, data }) => {
    return {
        status: "success",
        statusCode: "200",
        message: message,
        data: data?data:null
    }
}

exports.errorRes = ({ message, data }) => {
    return {
        status: "error",
        statusCode: "500",
        message: message,
        data: data?data:null
    }
}

