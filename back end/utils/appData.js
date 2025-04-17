class appData{
    constructor(){
    }
    createData(message,user){
        this.status= 'success';
        this.message=message;
        this.user=user;
        this.code=200;
        return this;
    }
}
module.exports=new appData()