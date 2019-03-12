import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
  constructor(){
      super();
      this.state = {
          name: '',
          email: '',
          password: '',
          password2: '',
          errors: {}
      };
  }
onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
}

onSubmit = (event) => {
    event.preventDefault();

    const newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2
    }
    
    axios.get('http://localhost:5000/api/users/test' ).then(result => console.log(result.data))
         .catch(error => console.log(error));
}

  render() {
    return (
        <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form onSubmit={this.onSubmit} >
                <div className="form-group">
                  <input value={this.state.name} onChange={this.onChange} type="text" className="form-control form-control-lg" placeholder="Name" name="name" required />
                </div>
                <div className="form-group">
                  <input value={this.state.email} onChange={this.onChange} type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" />
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <input value={this.state.password} onChange={this.onChange} type="password" className="form-control form-control-lg" placeholder="Password" name="password" />
                </div>
                <div className="form-group">
                  <input value={this.state.password2} onChange={this.onChange} type="password" className="form-control form-control-lg" placeholder="Confirm Password" name="password2" />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Register;
