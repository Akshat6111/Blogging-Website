const { validateToken } = require("../service/authentication");

function checkForAuthenticationCookie(cookieName){
  return(req,res,next) =>{
    const tokenCookieValue = req.cookies[cookieName];
    if(!tokenCookieValue){
        return next();
    }
    try{
    const userPayload = validateToken(tokenCookieValue);
    req.user = userPayload;
    req.locals.user = userpayload;
}
    catch(error){
    }
    return next();
  }
}

module.exports = checkForAuthenticationCookie;