const Validator= require('validator');
const isEmpty=require('./is-empty');


module.exports= function validateEducationInput(data){
    let errors={};
    
    data.School= !isEmpty(data.School) ?data.School :'';
    data.degree= !isEmpty(data.degree) ?data.degree :'';
    data.fildofstudy= !isEmpty(data.fildofstudy) ?data.fildofstudy :'';
    data.from= !isEmpty(data.from) ?data.from :'';
    data.to= !isEmpty(data.to) ?data.to :'';
    
   
    
    if( Validator.isEmpty(data.School)){
        errors.School='School field is required';
    } 
    
    if( Validator.isEmpty(data.degree)){
        errors.degree='degree field is required';
    }

    if( Validator.isEmpty(data.degree)){
        errors.degree='degree field is required';
    }


    if( Validator.isEmpty(data.from)){
        errors.from='from date field is required';
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}