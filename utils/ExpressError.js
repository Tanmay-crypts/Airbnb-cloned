// creating custom error
class ExpressError extends Error{
    constructor(status,msg){
        super();
        this.statusCode=status;
        this.message=msg;
    }
}
module.exports=ExpressError;