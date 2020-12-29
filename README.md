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

- security: userIds
- firebase security & permissions deep dive
- more protect from accidental overwrites to zero

### Tier 2

- fix use of user in subcomponents without passing
- fix crash after log out
- console warnings
- add backend app to complete Stripe payment gateway

### Tier 3

- save successful card info (PCI compliance!?)
- add purchasables
- make game fun
- make more useful/meaningful/valuable than game
