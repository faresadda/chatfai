class appError extends Error{
    constructor(){
        super()
    }
    createError(code,message){
        this.status= code === 404 ? 'error' : 'fail';
        this.message=message;
        this.code=code;
        return this;
    }
}
module.exports=new appError()
