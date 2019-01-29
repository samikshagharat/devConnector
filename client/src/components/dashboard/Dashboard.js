import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Proptypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentProfile} from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';


class Dashboard extends Component {
componentDidMount() {
    this.props.getCurrentProfile();
}
render(){
    const {user} = this.props.auth;
    const {profile , loading} = this.props.profile;
    let dashboardContent;

    if (profile === null|| loading) {
        dashboardContent = < Spinner />
    }
    else{
        // check if logged in user has a profile data
        if(Object.keys(profile).length > 0) {
            dashboardContent = (
                <div> 
                    <p className ="lead text-muted"> Welcome <Link to={`/profile/${profile.handle}`}> {user.name} </Link></p>
                    <ProfileActions />
                </div>
            );
        }
        else
        {
            // User is log in but has no profile data
            dashboardContent = (
                <div>
                    <p className ="lead text-muted"> Welcome {user.name} </p>
                    <p> you have not yet setup profile, plesae add some info</p>
                    <Link to="/create-profile" className="btn btn-lg btn-info"> 
                    Create Profile
                    </Link>
                </div>   
            )
        }
    }
    return (

        <div className="dashboard">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="display-4"> dashboard</h1>
                        {dashboardContent}
                    </div>
                </div>
            </div>
         </div>
    );
  }
}

Dashboard.proptypes = {
    getCurrentProfile : Proptypes.func.isRequired,
    auth:Proptypes.object.isRequired,
    profile: Proptypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});
export default connect(mapStateToProps, {getCurrentProfile})(Dashboard);