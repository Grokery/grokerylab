import merge from 'lodash/merge'

let files = require.context('./', true, /\.js$/).keys()
files.forEach(function(f){
    if (f !== "./index.js"){
         module.exports = merge(module.exports, require(f))
    }
})
