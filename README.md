GraphQL Sample Using json-server as data store
=========================



Project Overview
------------

We have two objects, User and Company, we show the relationship between the two. We also show how to use relay connections to page through the results of the queries

The [json-server](https://github.com/typicode/json-server) is running also on a seperate instance of glitch since you cannot utilize multiple ports on one instance in glitch. See information here [lets-react-starter-json-server1 readme](https://glitch.com/edit/#!/lets-react-starter-json-server1?path=README.md:1:0)

#### Sample Queries

```json
  allUsers {
    id
    first_name
    last_name
    company {
      name
    }
  }
  allCompanies {
    id
    name
    users {
      edges {
        node {
          id
          first_name
          last_name
        }
      }
    }
  }
  user(id:3) {
    id
    email
    company {
      id
      name
    }
  }
```

A view of the GraphQL UI

![https://cdn.glitch.com/8e72cc99-58cf-4a13-8022-b834657ff5e3%2FScreenshot%202017-07-20%2008.46.59.png?1500554859323](https://cdn.glitch.com/8e72cc99-58cf-4a13-8022-b834657ff5e3%2FScreenshot%202017-07-20%2008.46.59.png?1500554859323)
-------------------

Click `Show` in the header to see your app live. Updates to your code will instantly deploy and update live.

Find out more [about Glitch](https://glitch.com/about).
