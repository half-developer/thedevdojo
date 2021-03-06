import { Injectable, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { useAnimation } from '@angular/core/src/animation/dsl';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { EventEmitter } from '@angular/core';

@Injectable()
export class AuthService {
  authToken:any;
  user:any;

  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  constructor(private http:Http){}

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'Application/json');
    return this.http.post(environment.apiUrl + 'users/register', user, {headers: headers})
    .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'Application/json');
    return this.http.post(environment.apiUrl +'users/authenticate', user, {headers: headers})
    .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Content-Type', 'Application/json');
    headers.append('Authorization', this.authToken);
    return this.http.get(environment.apiUrl + 'users/profile', {headers: headers})
    .map(res => res.json());

  }

  storeUserData(token, user){    
    //Angular JWT looks for 'id_token' within localStorage by default
    localStorage.setItem('id_token', token);

    //Stringify because localStorage can only store strings, not objects
    localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;  
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn(){    
    if(tokenNotExpired('id_token')){
      const userName = JSON.parse(localStorage.getItem('user')).name || '';
      this.getLoggedInName.emit(userName);
    }
    return tokenNotExpired('id_token');
  }

  isAdmin(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user){
      return false;
    }
    else{
      if(user.isAdmin){
          return true
      }
      else{
        return false;
      }
    }

  }  

  getUsersName(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user){
      return "";
    }
    else{
      if(user.name){
          return user.name
      }
      else{
        return "";
      }
    }
  }

}