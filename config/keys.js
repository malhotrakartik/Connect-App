if(process.env.NODE_ENV === "production"){
    module.exports = require('./prod')                                //production data should be protected
}else{
    module.exports = require('./dev')

}

// module.exports = require('./dev')