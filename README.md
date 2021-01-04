# React Firebase Game

Dig holes and save progress.

Built with React, Firebase, Bootstrap, Stripe.

## Dev

```
yarn && yarn start
```

## Deploy

```
yarn build && firebase deploy
```

## TODO

### BUGS

- reply-in-progress jumps to wrong post if new post comes in
- fix crash after log out
- fix use of user in subcomponents without passing

### Tier 1 (security etc)

- database security rules should prevent clients from reading any private data
- are client-visible userIds a concern?
- firebase security & permissions deep dive
- more protect from accidental wipes, eg overwrites to zero in game
- implement database backups

### Tier 2 (user convenience etc)

- confirm prompt for delete post
- ability to edit your existing posts
- keep user logged in on refresh
- add backend app to complete Stripe payment gateway

### Tier 3 (nice to have etc)

- better handling for orphan posts
- pics for posts
- add purchasables
- make game fun
- make more useful/meaningful/valuable than game
- better react props handling

## IDEAS

- groups -> rooms / post feeds / chat rooms
- humans game modeling reality, eg mood meter
- new names networking/contacts/friends utility
- scorekeeper as part of rooms
- demote games
- save successful card info (PCI compliance!?)
