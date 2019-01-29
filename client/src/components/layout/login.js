import React, { Component} from 'react';


class Registration extends Component {
  render() {
    return (
      <div  className="App Login-component"  >
    
      <h1 className="design"> Login Form </h1>
      
      <form onsubmit={this.handle} >

        <div className="design ">
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  </div>

<div  className="design" >
<label > 

    EmailId:
    <input type="text" name="EmailId" />
    </label>
    </div>

    <div className="design">
    <label> Address: </label>
    <textarea>       </textarea>
</div>

<div className="design">
<label >
    CITY:
     </label> 
  <select className= "Liststyle">  
  <option value="">Select city</option>
  <option value="Mumbai">Mumbai</option>
  <option value="Pune">pune</option>
  <option  value="delhi">delhi</option>
  <option value="banglore">banglore</option>
</select>
</div>  

<div className="design">
  <label>
  Password:
<input type="Password" name="Password" />
</label>
</div>

<div className="buttonStyle">
  <button type="submit" > submit</button>
  </div>

</form>
  </div>


    );
  }
}

export default Registration;
