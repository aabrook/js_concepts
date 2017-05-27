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
