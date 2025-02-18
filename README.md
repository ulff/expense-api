# expense-api

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/6koqDqLcxHb4FgvWvZbWyg/APHE29GUod9gKbvNWes2fV/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/6koqDqLcxHb4FgvWvZbWyg/APHE29GUod9gKbvNWes2fV/tree/main)

Simple RestAPI for collecting information about daily expenses.

---

## The hexagonal architecture concept

The application architecture was inspired by the concept of _Hexagonal Architecture_.
The whole application is structured into three layers of

- [domain](#the-domain)
- [infrastructure](#the-infrastructure)
- [application](#the-application)

![hexagonal-architecture.png](docs%2Fhexagonal-architecture.png)

### The domain

This is the core part of the application, that contains whole business logic. It consists of  
the entities, the validation, the general repositories interfaces for persisting the entities,
and all use cases provided by the application.

The domain is independent of the frameworks, databases and all infrastructure. Despite that,
it's fully functional and self-sustainable. It can be tested, and it's very easy-testable.
It's like a black box you could take out and plug in to another application.

The whole business logic is performed by the use cases. A use case is a class, that is
constructed with the relevant repositories and validators that every use case is requiring.

Every use case has the `execute` method, that is receiving an input data in the expected format.
These inputs are called _the commands_. The execute method is the actual place where the whole
business processes happen. It could validate the input, run the repository methods, or perform
any other calculations. It could run any operation, but it couldn't depend on any of the surrounding
layers of the application (infrastructure and application). The execute method should return its
result, when successful, or throw an exception otherwise.

### The infrastructure

The infrastructure is the implementation of the repositories interfaces defined in the domain.
This layer can use the domain objects, but it cannot reach outside to the application layer.
Its responsibility is persisting and reading the data from the database, memory, file systems,
or any other elements. This is the place where you should e.g. create the database connection,
or define the SQL queries.

In my project I also created the in-memory infrastructure, that was easy to use at the beginning
when I was not expecting to persist the objects, but just wanted to make sure the domain works
properly. Right now, the in-memory repositories are used for integration-tests of the domain
use cases.

### The application

This is the last layer, that wraps everything around and makes everything into working
application. This layer is free to use infrastructure and domain layers. This is the layer
where you create and use the use-case classes instances, injecting to them the selected
infrastructure implementations.

In this layer you implement the controllers whose responsibilities are:

- receiving requests and data from the users
- creating proper use-case commands
- running the use-cases `execute` methods
- returning the responses with the effects of the use-cases...
- ...or handling the exceptions thrown from the use-cases

### Read more about this concept

- [https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)

- [https://medium.com/ssense-tech/hexagonal-architecture-there-are-always-two-sides-to-every-story-bc0780ed7d9c](https://medium.com/ssense-tech/hexagonal-architecture-there-are-always-two-sides-to-every-story-bc0780ed7d9c)

- [https://medium.com/@walid.karray/building-a-todo-app-with-typescript-using-clean-hexagonal-architecture-a-detailed-look-at-the-d9e177f9f31](https://medium.com/@walid.karray/building-a-todo-app-with-typescript-using-clean-hexagonal-architecture-a-detailed-look-at-the-d9e177f9f31)

---

## Working with the project locally

### The quickest way to start

First, make sure have the _Docker_ deamon configured and running.
Docker is needed to create and run the local _Postgres_ database.

Clone this GitHub repo,
go into the project directory and run the following commands:

```bash
$> cp env.example .env
$> docker-compose up -d
$> npm i
$> npm run build
$> npm start
```

The project should successfully start on your localhost on port 4000.

Navigate to [http://localhost:4000/status/online](http://localhost:4000/status/online)
to see if it's working

### The most comfortable way to work locally

While working on the project, it's easier to use `npm run dev` command that runs _nodemon_
under the hood and does not require restarting. If you want to use it instead `npm start`,
just remember to run the database migrations before:

```bash
$> npm run db:migrate
```

### Populating the database with sample data

Since the database will be completely empty at the beginning you may fill it with sample data
I prepared. To achieve that just run the command:

```bash
$> npm run db:populate
```

### Running tests

The application is covered with tests running on _Jest_. There is also prettier and typescript checks. Everything is wrapped in one command, so you could just run:

```bash
$> npm run test
```

### Logging into the local database running on docker

You may log into the local database that is running, just use the commands:

```bash
$> docker exec -ti expense_api_db bash
$> psql postgres://expenseapi:987d6b@localhost:5432/expenseapidb
```

And that's it! You are now logged into the database with the _psql_ CLI client.

---

## CI/CD

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/6koqDqLcxHb4FgvWvZbWyg/APHE29GUod9gKbvNWes2fV/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/6koqDqLcxHb4FgvWvZbWyg/APHE29GUod9gKbvNWes2fV/tree/main)

The project is build in [CircleCI](https://circleci.com) and hosted on [Heroku](https://heroku.com).
