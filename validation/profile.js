const Validator= require('validator');
const isEmpty=require('./is-empty');


module.exports= function validateprofileInput(data){
    let errors={};
    
    data.handle= !isEmpty(data.handle) ?data.handle :'';
    data.status= !isEmpty(data.status) ?data.status :'';
    data.skills= !isEmpty(data.skills) ?data.skills :'';
    
   if(!Validator.isLength(data.handle,{min:2, max:40})) {
       errors.handle = 'Handles needs to between 2 to 40 characters';
   }
   if (Validator.isEmpty(data.handle)){
       errors.handle = 'profile handle is required';
   }

   if (Validator.isEmpty(data.status)){
    errors.status = ' status filed is required';
    }

    if (Validator.isEmpty(data.skills)){
        errors.skills = ' skills filed is requirs';
        }

    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = 'not a valied URL';
        }
    }
    
    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube = 'not a valied URL';
        }
    }

    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter = 'not a valied URL';
        }
    }

    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = 'not a valied URL';
        }
    }

    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin = 'not a valied URL';
        }
    }

    if(!isEmpty(data.instgram)){
        if(!Validator.isURL(data.instgram)){
            errors.instgram = 'not a valied URL';
        }
    }
    

    return {
        errors,
        isValid:isEmpty(errors)
    }
}