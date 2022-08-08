# Around Us

- Succeeding from scratch as a small restaurant is not easy. Gaining visibility, trust and even receiving feedback from customers to improve your experience is complicated when the market is strongly established for the big food companies. In addition, you would have to face current challenges, like the COVID-19 pandemic that led to a total of 90,000 restaurants to close temporarily and permanently by Spring 2021, according to the NRA[1]. 
- On the other hand, we have the users with this Adventurer feeling, who are tired of being trapped in a routine and are looking for new Experiences around them, but unsure on where to find it.
- Around Us was created to connect those Experience Makers and Adventurers. It is a space meant to (re)discover your surroundings, while recognizing the local restaurants’ proposals and letting them know their improvement areas, as well as promoting a fair environment competition.
- [Project Plan Document](https://docs.google.com/document/d/1uUZzp-iKbGCbkrfX4Z5I4MD7ms0q6sgkXTo00Y5b0jo/edit#heading=h.thee55jba086)

# Requirements

.env files:
- /capstone-kickoff/back
  NODE_ENV_ID_PROJECT = "ID_ON_DB"
  NODE_ENV_PROJECT_KEY = "ID_ON_DB"
  NODE_ENV_GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API"
  
- /capstone-kickoff/capstone
  ESLINT_NO_DEV_ERRORS = true
  REACT_APP_USER_KEY = "current_user_id"
  REACT_APP_BASE_URL = "http://localhost:3001"
  REACT_APP_GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API"

# Install and rund
```
git clone https://github.com/carlosvegap/capstone-kickoff.git
```

```
cd capstone-kickoff
npm install
```

Two terminals are required, one for capstone and one for the backend
```
cd capstone-kickoff/back
npm install
npm start
```

```
cd capstone-kickoff/capstone
npm install
npm start
```

# References:
[1] Carman, T. [June 21, 2022] How many restaurants closed from the pandemic? Here’s our best estimate. Retrieved on August 2nd, 2022 from The Washington Post: https://www.washingtonpost.com/food/2022/06/21/covid-restaurant-closures/
