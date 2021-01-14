# FOCUS

- manifest a handful of regular active users
- build for constructive conversation
- healthy relating, productivity, health

# TODO

2021-01-14

- fix post page doesn't include full tree
- fix double render
- cleanup 'Add Tags' and 'Reply' buttons

2021-01-12

- clean out Posts index
- do not query all posts, do not return all posts; chunks please
- posts feed slowness
- NOTIFICATIONS - cool stuff you might care to see since you last logged in
- security, seriously
- bug: after log out, PERMISSION DENIED errors
- motivate user to put it on their phone home screen
- move junk data out of db users
- fix the smart feed active indicator, differently weird on desktop and phone ?
- phone users may be confused about no submit buttons for tags
- allow like or heart or read or something on replies or all posts
- chess+
- optional custom display names?
- community verification for display names
- private rooms for conversations, games, etc?
- user profiles
- picture handling, stop querying google lol
- Ability to delete your own tags
- can't see stats tables on phones very well; they're at bottom of post feed
- firebase nodes have metadata with creationTime and lastSignInTime; do we need my janky `joined` or `lastLogin` ?

### SECURITY & DEV

- implement database backups
- database security rules should prevent clients from reading any private data
- are client-visible userIds a concern?
- firebase security & permissions deep dive
- more protect from accidental wipes, eg overwrites to zero in game
- abstract posts' and collections' functions into models and utils etc
- better react props handling

### Tier 2 (user convenience etc)

- confirm prompt for delete post
- ability to edit your existing posts
- ability to share pictures
- better handling for orphan posts; how handle deleting posts?

### NEW USERS AND PARTICIPATION

- stats for top tag getters esp by tag type
- invite codes and family-tree displays and stats for top inviters ?

### MONETIZATION

- add backend app to complete Stripe payment gateway
- add purchasables
- save successful card info (PCI compliance!?)

### IDEAS

- who's online now
- private rooms like worlds w game-ified invites / vote-off-island / scores etc
- auto-curated feed universal and personal, eg most active recent posts
- view posts feed by filters: user, tag
- groups -> rooms / post feeds / chat rooms
- healthy intimacy dating called Tender XD
- user private profile includes:
  - round tables, eg 5 closest friends, 5 best friends, 5 friends I want to be more like, etc
  - jom's productivity tracker

### UTILITIES

- movies seen w ratings and reviews; books, etc
- new names networking/contacts/friends utility
- scorekeeper as part of rooms

### GAMES

- humans game modeling reality, eg mood meter
