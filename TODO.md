# FOCUS

1. security
   - database security rules should prevent clients from reading any private data
   - cleanup db calls and looping many calls
   - do not query all posts, do not return all posts; chunks please
2. performance
3. features
   - build for constructive conversation
   - healthy relating, productivity, health
4. activity
   - handful of obsessed users
   - hundred daily users
   - ten thousand registered users

# TODO

- move Tag Stats to home / Posts page
- fix tests
- finish notifications; they should be easy, no user effort; also add (#) count to browser tab
- improve new member experience, on-boarding
- develop the end-game, Trust Points or Healthy Relater levels and access to deeper safer rooms for higher safety and vulnerable/charged topics etc
- tag filtering; presets; digests
- merely clicking upvote refreshes all the notifications and stats!
- notifications should be easy, automated, don't make me remember and click around and guess and remove
- notifications and links should take to full thread, top post "see more" state, other comments collapsed, relevant 2 posts uncollapsed
- accounting tools
- improve loading experience on slow devices/connections
- urls are clickable hyperlinks
- what is "healthy relating"? what are the expectations here, how do i play?
- order replies by upvotes/karma too
- 'Add Tags' to new top level post
- notifications column persists beside single post page
- top karma (upvotes) received
- downvotes, or flagging or something
- map out what is healthy relating
- lowercase all tags ?
- tag filter digests group similar tags
- save user preferred feed ?
- sort replies by upvotes too
- implement reemind app
- ui manual collapse of reply tree branches
- !old existing code on people's unrefreshed browsers will knock out new notifications!
- remove hackFunctions
- post feeds start w replies collapsed ?
- character or word counts and maybe time to read length indicators maybe on Read More link
- Feature Requests should just be a preset in a whole bunch of tag filtering abilities
- buggish: Feature Requests feed allows replies now but does't show them
- daily scorecard app w limited visibility for habits etc and accountability
- fix double render (still happening? / use more loading)
- clean out Posts index
- posts feed slowness ?
- bug: after log out, PERMISSION DENIED errors (still an issue?)
- help user to put it on their phone home screen
- move junk data out of db users, eg groups
- fix the smart feed active indicator, differently weird on desktop and phone ?
- phone users may be confused about no submit buttons for tags
- allow like or heart or read or something on replies or all posts
- optional custom display names?
- community verification for display names
- private rooms for conversations, games, etc?
- user profiles
- picture handling, stop querying google lol
- Ability to delete your own tags
- can't see stats tables on phones very well; they're at bottom of post feed
- firebase nodes have metadata with creationTime and lastSignInTime; do we need my janky `joined` or `lastLogin` ?
- confirm prompt for delete post
- ability to edit your existing posts
- ability to share pictures
- better handling for orphan posts; how handle deleting posts?
- stats for top tag getters esp by tag type
- invite codes and family-tree displays and stats for top inviters ?
- private rooms like worlds w game-ified invites / vote-off-island / scores etc
- auto-curated feed universal and personal, eg most active recent posts
- view posts feed by filters: user, tag
- groups -> rooms / post feeds / chat rooms
- healthy intimacy dating called Tender XD
- round tables, eg 5 closest friends, 5 best friends, 5 friends I want to be more like, etc
- jom's productivity tracker
- movies seen w ratings and reviews; books, etc
- new names networking/contacts/friends utility
- scorekeeper as part of rooms
- humans game modeling reality, eg mood meter
- are client-visible userIds a concern?
- firebase security & permissions deep dive
- abstract posts' and collections' functions into models and utils etc
- better react props handling
- add backend app to complete Stripe payment gateway
- add purchasables
- save successful card info (PCI compliance!?)
