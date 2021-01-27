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

- better document.title tab titles like for rooms and user profiles
- really cleanup Posts/index.js; it handles many things and the view logic is outrageous
- favorite posts
- editor's choice posts
- room specific upvoting etc
- watchout for posts that get added without a room; they can be fixed but are lost without a room field
- hot should include comments in equation
- cross site search
- room-specifics like stats, users here now, etc
- manually fix old post links, there's not many of them
- use context for room, remove roomHack
- lift notifications out of rooms in ui/ux
- the mark-post/thread-as-seen button should be more like a universal hide-until-new-stuff; Unseen feed should be obsolute, just a layer available on any other feed
- a top level post (without replyToId) is akin to a thread-head; a thread would keep useful meta-data, eg whether anyone had replied to any message in the thread since you last visited it
- change db 'upvote' to 'upvotes'
- https://www.robinwieruch.de/react-firebase-realtime-database
- step by step intro/tutorial/quest-lines
- @usernames
- change display name
- many replies deep the padding is too much!
- move Tag Stats to home / Posts page
- add (#) count to browser tab
- improve new member experience, on-boarding
- develop the end-game, Trust Points or Healthy Relater levels and access to deeper safer rooms for higher safety and vulnerable/charged topics etc
- tag filtering; presets; digests
- tag filter digests group similar tags
- Feature Requests should just be a preset in a whole bunch of tag filtering abilities
- buggish: Feature Requests feed allows replies now but does't show them
- accounting tools
- urls are clickable hyperlinks
- what is "healthy relating"? what are the expectations here, how do i play?
- map out what is healthy relating
- sort replies by upvotes/karma too
- 'Add Tags' to new top level post
- downvotes, or flagging or something
- lowercase all tags ?
- save user preferred feed ?
- remove hackFunctions
- character or word counts and maybe time to read length indicators maybe on Read More link
- daily scorecard app w limited visibility for habits etc and accountability
- fix double render (still happening? / use more loading)
- clean out Posts index
- posts feed slowness ?
- help user to put it on their phone home screen
- move junk data out of db users, eg groups
- fix the smart feed active indicator, differently weird on desktop and phone ?
- phone users may be confused about no submit buttons for tags
- allow like or heart or read or something on replies or all posts
- optional custom display names?
- community verification for display names
- private rooms like worlds w game-ified invites / vote-off-island / scores etc
- private rooms for conversations, games, etc?
- picture handling, stop querying google for user photos
- ability to share pictures
- Ability to delete your own tags
- confirm prompt for delete post
- ability to edit your existing posts
- better handling for orphan posts; how handle deleting posts?
- stats for top tag getters esp by tag type
- invite codes and family-tree displays and stats for top inviters ?
- auto-curated feed universal and personal, eg most active recent posts
- view posts feed by filters: user, tag
- groups -> rooms / post feeds / chat rooms
- healthy intimacy dating called Tender XD
- round tables, eg 5 closest friends, 5 best friends, 5 friends I want to be more like, etc
- scorekeeper as part of rooms
- humans game modeling reality, eg mood meter
- are client-visible userIds a concern?
- firebase security & permissions deep dive
- abstract posts' and collections' functions into models and utils etc
- better react props handling
- add backend app to complete Stripe payment gateway
- add purchasables
- save successful card info (PCI compliance!?)

## APPS

- event pages
- cooperative mind map
- jom's productivity tracker
- implement reemind app
- movies seen w ratings and reviews; books, etc
- new names networking/contacts/friends utility
