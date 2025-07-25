const notFound = (req, res, next) => {
    return res.status(404).json("route not found")
}

export default notFound