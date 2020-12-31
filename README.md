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

### Tier 1

- database security rules should prevent clients from reading any private data
- are client-visible userIds a concern?
- firebase security & permissions deep dive
- more protect from accidental wipes, eg overwrites to zero in game

### Tier 2

- keep user logged in on refresh
- fix use of user in subcomponents without passing
- fix crash after log out
- add backend app to complete Stripe payment gateway

### Tier 3

- pics for posts, cleaner timestamps
- save successful card info (PCI compliance!?)
- add purchasables
- make game fun
- make more useful/meaningful/valuable than game
