# JS Concepts

[![Build Status](https://travis-ci.org/aabrook/js_concepts.svg?branch=master)](https://travis-ci.org/aabrook/js_concepts)

This is a small repository that I'm using to trial various javascript concepts.
The primary goal is to follow a more functional approach to where appropriate.

Tests will live under __tests__ in the related directory

# Store (/store)

The first is my pass at a redux style store. It initially started as a functional observer
pattern but then ended up being a redux-style store with observers

# Event Store (/events)

I wanted to write a simple event store with 2 features around projection. Either wait until
all projections have completed successfully before returning or fire them in the next tick
immediately returning to the caller.

I feel waiting for projections to complete saves multiple client requests/polling. An API user
will typically make a request and want to see the result or the action. Waiting for projections
will allow this.

# Test App (/app)

This is a simple express app that ties the event store and the redux style store together.
It uses the events store to save `Tasks` to a database and has a store that the projections
will write to. The state of the store is returned to the user after projections have been made.

To start:
1. run `bin/setup-env.sh`
2. run `yarn start:app`
3. Open your favourite API tool (curl/postman/insomnia?)
4. post to `localhost:8001/tasks` an event of the shape `{ task: 'my sweet task' }`
5. Read the response

# UI of the Test App (/tasks-ui)

A simple create-react-app client that will let you create/delete tasks using the event sourced
app above.

To start in dev mode:
1. Run the `/app` above
2. In a new tab go to /app/tasks-ui
3. run `yarn dev`
4. Follow the prompts on screen and profit!

