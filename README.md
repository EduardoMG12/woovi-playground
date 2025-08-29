<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/entria/woovi-playground">
    <img src="https://user-images.githubusercontent.com/70105678/236887308-8ad0ccb7-2fc6-4269-8725-da71c547f54a.png" alt="Logo">
  </a>

  <h3 align="center">Woovi Playground</h3>

  <p align="center">
    <a href="https://github.com/entria/woovi-playground/issues">Report Bug</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

### Built With

[![Next][next.js]][next-url]
[![React][react.js]][react-url]
[![Node][node.js]][node-url]
[![GraphQL][graphql]][graphql-url]
[![MongoDB][mongodb]][mongodb-url]
[![Koa][koa]][koa-url]

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- Node.js

  ```sh
  https://nodejs.org/en/download/
  ```

- PNPM

  ```sh
  npm install pnpm -g
  ```

- Docker

  ```sh
  https://www.docker.com/get-started/
  ```

## Installation

Clone the repo

```sh
git clone https://github.com/entria/woovi-playground.git
```

1. Install packages

   ```sh
   pnpm install
   ```

2. Run the container(or stop it, if necessary):
  
   ```sh
   pnpm compose:up
   ```

3. Setup Configuration

   ```sh
   pnpm config:local
   ```

4. Run the relay

    ```sh
    pnpm relay
    ```

5. Run the Project or use step 6

   ```sh
   pnpm dev
   ```

6. Or just build with docker

```sh
docker-compose up --build
```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat(amazing-feature): my feature is awesome'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/entria/woovi-playground](https://github.com/entria/woovi-playground)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[node.js]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[graphql]: https://img.shields.io/badge/Graphql-E10098?style=for-the-badge&logo=graphql&logoColor=white
[graphql-url]: https://graphql.org/
[mongodb]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://mongodb.com
[koa]: https://img.shields.io/badge/Koa-F9F9F9?style=for-the-badge&logo=koa&logoColor=33333D
[koa-url]: https://koajs.com

---

GraphQL Documentation for Postman
The woovi-playground project's GraphQL API uses a single endpoint for all queries and mutations.
Endpoint: http://38.242.140.118:4000/graphql
All requests must be of type POST and the request body must be application/json.
Accounts
Create an Account
Description: Creates a new account.
Mutation:



```json

mutation AddAccount($input: AccountAddInput!) {
  AccountAdd(input: $input) {
    account {
      id
      ownerName
      balance
    }
    error
  }
}
```

Variables (example):



```json

{
  "input": {
    "ownerName": "John Doe"
  }
}

```
Deposit to an Account
Description: Deposits a specified amount into an existing account.
Mutation:



```json

mutation DepositToAccount($input: AccountDepositInput!) {
  AccountDeposit(input: $input) {
    account {
      id
      ownerName
      balance
    }
    error
  }
}

```


Variables (example):



```json


{
  "input": {
    "id": "QWNjb3VudDoy",
    "amount": 10000
  }
}

```

List Accounts
Description: Fetches a list of all accounts.
Query:



```json


query AllAccounts {
  accounts(first: 10) {
    edges {
      node {
        id
        ownerName
        balance
      }
    }
  }
}

```

Transactions
Add a Transaction
Description: Creates a transaction between two accounts, debiting from one and crediting the other.
Mutation:



```json

mutation AddTransaction($input: TransactionAddInput!) {
  TransactionAdd(input: $input) {
    transaction {
      id
      amount
      type
      account {
        id
        ownerName
      }
    }
  }
}

```

Variables (example):



```json


{
  "input": {
    "fromAccountId": "QWNjb3VudDox",
    "toAccountId": "QWNjb3VudDoy",
    "amount": 5000
  }
}

```

List Transactions
Description: Returns a list of all transactions.
Query:



```json

query AllTransactions {
  transactions(first: 10) {
    edges {
      node {
        id
        amount
        type
        account {
          id
          ownerName
        }
        pair {
          id
        }
      }
    }
  }
}

```
#### postman url: https://planetary-water-186042.postman.co/workspace/my_projects~91c0d67c-574f-4e9b-afa4-02d37cc1f93f/collection/68b0a01fbc88542b2e04c9b0?action=share&creator=33756963
