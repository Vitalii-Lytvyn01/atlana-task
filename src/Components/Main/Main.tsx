import React from 'react';
import './Main.scss';
import { User } from '../../Util/Types/User';
import {UserProfile} from '../../Util/Types/UserProfile';
import { searchUsers, getUserInfo } from '../../API/GitHub';
import UserPage from '../UserPage/UserPage';
import { Octokit } from "octokit";


interface IProps {
}

interface IState {
  searchQuery: string,
  users: Array<User>,
  isProfileVisible: boolean,
  userURL: string,
  userProfile: UserProfile,
}

export default class MainPage extends React.Component<IProps, IState> {

  state = {
    searchQuery: '',
    users: [],
    isProfileVisible: false,
    userURL: '',
    userProfile: {
      login: '',
      avatar_url: '',
      created_at: '',
      followers: 0,
      following: 0,
      bio: '',
      email: '',
      html_url: '',
      repos_url: '',
      location: '',
    }
  }

  searchUsersF(name: string = this.state.searchQuery):void {
    const response = searchUsers(name);
    response.then(
      data => {
        return data.json();
      }
    ).then(
      dataJSON => {
        console.log(dataJSON);
        if (dataJSON.message === "Validation Failed" || dataJSON.message.includes('API rate limit exceeded')) {
          alert("API rate limit exceeded")
          this.setState({users: []});
          return;
        }
        const array: Array<User> = dataJSON.items;
        this.setState({users: array});
      }
    ).catch(alert);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({searchQuery: e.target.value});
    this.searchUsersF(e.target.value);
  }

  getUserProfile(url: string) {
    const response = getUserInfo(url);
    response.then(
      data => {
        return data.json()
      }
    ).then(
      dataJSON => {
        this.setState({
          userProfile: dataJSON,
          isProfileVisible: true,
        });
      }
    ).catch(alert);
  }

  render(): React.ReactNode {
    return(
      <div className="main-page">
        <div className="container">
          <div className="users-search">
            <div className="users-search__title">GitHub Searcher</div>
            <input
              type="search"
              className='users-search__search-bar'
              value={this.state.searchQuery}
              onChange={(e) => this.handleChange(e)}
            />
            <div className="users-search__list">
              {
                this.state.users.map((item: User) => {
                  return <div
                            className="list-item"
                            onClick={() => {this.getUserProfile(item.url)}}
                          >
                          <div className="list-item__image" style={{backgroundImage: `url(${item.avatar_url})`}}></div>
                          <div className="list-item__name">{item.login}</div>
                        </div>
                })
              }
            </div>
          </div>
          {
            this.state.isProfileVisible
          ? <UserPage userProfile={this.state.userProfile}/>
          : ""
          }
        </div>
      </div>
    )
  }
}
