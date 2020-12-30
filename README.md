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

- ensure clients cannot query arbitrary other user data
- security: userIds
- firebase security & permissions deep dive
- more protect from accidental wipes, eg overwrites to zero in game

### Tier 2

- fix use of user in subcomponents without passing
- fix crash after log out
- add backend app to complete Stripe payment gateway

### Tier 3

- pics and display names for posts, cleaner timestamps
- save successful card info (PCI compliance!?)
- add purchasables
- make game fun
- make more useful/meaningful/valuable than game
