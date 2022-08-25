import React from "react";
import './UserPage.scss';
import {getRepos} from '../../API/GitHub';
import {UserProfile} from '../../Util/Types/UserProfile';
import {Repo} from '../../Util/Types/Repo';

interface IProps {
  userProfile: UserProfile
}

interface IState {
  searchQuery: string,
  repos: Repo[],
}

export default class UserPage extends React.Component<IProps, IState> {
  state = {
    searchQuery: '',
    repos: [],
  }

  getUserRepos(login: string, query: string = '') {
    const response = getRepos(login,query);
    console.log(this.props.userProfile.repos_url);
    response.then(
      data => {
        return data.json();
      }
    ).then(
      dataJSON => {
        if(dataJSON.message = "API rate limit exceeded for user ID 92029462.") {
          alert(dataJSON.message);
        }
        const array: Array<Repo> = dataJSON.items;
        this.setState({repos: array});
      }
    ).catch(alert);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({searchQuery: e.target.value});
    this.getUserRepos(this.props.userProfile.login, e.target.value);
  }

  componentDidMount() {
    this.getUserRepos(this.props.userProfile.login);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.userProfile.login !== this.props.userProfile.login) {
      this.getUserRepos(this.props.userProfile.login);
    }
  }

  render(): React.ReactNode {
    const {userProfile} = this.props;
    const date = new Date(userProfile.created_at);
    return(
      <div className="user-page">
        <div className="user-page__title">
          GitHub Searcher
        </div>
        <div className="user-page__profile">
          <div className="profile__image" style={{backgroundImage: userProfile.avatar_url ? `url(${userProfile.avatar_url})` : 'none'}}></div>
          <div className="profile__info">
            <div className="profile__info--name info-text">
              {userProfile.login}
            </div>
            <div className="profile__info--email info-text">
              {userProfile.email ? userProfile.email : "Unspecified email"}
            </div>
            <div className="profile__info--location info-text">
              {userProfile.location ? userProfile.location : "Unspecified location"}
            </div>
            <div className="profile__info--date info-text">
              Join date: {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
            </div>
            <div className="profile__info--followers info-text">
              {userProfile.followers} Followers
            </div>
            <div className="profile__info--following info-text">
              Following {userProfile.following}
            </div>
          </div>
        </div>
        <div className="user-page__bio">
          {userProfile.bio ? userProfile.bio : "No Bio"}
        </div>
        <input
          type="search"
          className="user-page__search-bar"
          value={this.state.searchQuery}
          onChange={(e) => this.handleChange(e)}
        />
        <div className="user-page__repo-list">
          {
            this.state.repos.map((item: Repo) => {
              return <div className="repo">
                <div className="repo__name">{item.name}</div>
                <div className="repo__statistics">
                  <div className="forks">{item.forks} Forks</div>
                  <div className="stars">{item.stargazers_count} Stars</div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    )
  }
}