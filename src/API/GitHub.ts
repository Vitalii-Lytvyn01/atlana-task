const BASE_URL = "https://api.github.com/";
const key = process.env.REACT_APP_KEY;
const TOKEN = "Bearer " + key;

async function searchUsers(name: string) {
  return await fetch(BASE_URL + `search/users?q=${name}&sort=repositories&per_page=100`, {
    method: "GET",
    headers: {
      "Connection": "keep-alive",
      "Authorization": TOKEN,
      "Accept": "application/vnd.github.v3+json",
    }
  }); 
}

async function getUserInfo(url: string) {
  return await fetch(url, {
    method: "GET",
    headers: {
      "Connection": "keep-alive",
      "Authorization": TOKEN,
      "Accept": "application/vnd.github.v3+json",
    }
  }); 
}

async function getRepos(login: string, query: string) {
  return await fetch(`https://api.github.com/search/repositories?q=user:${login} ${query} in:name&per_page=100`, {
    method: "GET",
    headers: {
      "Connection": "keep-alive",
      "Authorization": TOKEN,
      "Accept": "application/vnd.github.v3+json",
    }
  }); 
}

export {searchUsers, getUserInfo, getRepos}