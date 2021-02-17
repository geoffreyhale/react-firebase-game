# FOCUS

1. security
   - database rules
2. features
3. activity
   - handful of obsessed users
   - hundred daily users
4. performance
   - do not query all posts

## ...

1. user quantity
2. user activity
3. app unique value
4. sales

# TODO

- bug: 0 notifications is infinite spinner
- consolidate stats, store them, update them selectively for performance, competitive gamification

## Top Tier

- finish database security rules and related tests
- enforce @username uniqueness

## Tier 2

- elevate visibility of modality posts that need votes
- elevate visibility of unanswered posts
- use auth.token.identifier not uid
- improve visibility of "hot" topics/posts; get as many eyes/additional-activity on the "hot" (replies etc) as possible
- fix Google auth from apps like Facebook that use embedded browsers
- cross site search
- step by step intro/tutorial/quest-lines
- improve new member experience, on-boarding
- what is "healthy relating"? what are the expectations here, how do i play?
- map out what is healthy relating
- change display name
- optional custom display names?
- community verification for display names
- invite codes and family-tree displays and stats for top inviters ?

## Tier 3

- better handling for delete posts
- use context for room, remove roomHack
- add (#) count to browser tab
- accounting tools
- 'Add Tags' to new top level post
- downvotes, or flagging or something
- remove hackFunctions
- help user to put it on their phone home screen
- phone users may be confused about no submit buttons for tags
- Ability to delete your own tags
- confirm prompt for delete post
- better handling for orphan posts; how handle deleting posts?
- stats for top tag getters esp by tag type
- long-term small groups?; round tables, eg 5 closest friends, 5 best friends, 5 friends I want to be more like, etc
- chat rooms
- are client-visible userIds a concern?
- abstract posts' and collections' functions into models and utils etc
- better react props handling
- add backend app to complete Stripe payment gateway
- add purchasables

## Tier 4

- replies should be less organized by hot and more by popular
- should not be able to approve your own modality post
- sent j a direct link to single post full of comments for her, she didn't know how to see them;; she saw the blue no lurking box and even if she read it there wasn't a clear way to post/reply/rejoin-the-conversation
- pin posts/conversations/threads
- save posts/conversations/threads
- favorite posts/conversations/threads
- showHeaderLinkToParent Card.Header could have more helpful informations
- show accurate reply count on user profile posts
- (my) user profile is so slow
- something to let premium members know all they're getting for their money, maybe like the PremiumSaleCard for premium members somewhere
- cleanup Posts/index.js
- editor's choice posts
- room-specifics like stats, users here now, etc
- manually fix old post links, there's not many of them
- the mark-post/thread-as-seen button should be more like a universal hide-until-new-stuff; Unseen feed should be obsolute, just a layer available on any other feed
- a top level post (without replyToId) is akin to a thread-head; a thread would keep useful meta-data, eg whether anyone had replied to any message in the thread since you last visited it
- change post 'userId' to 'uid'
- change db 'upvote' to 'upvotes'
- https://www.robinwieruch.de/react-firebase-realtime-database
- move Tag Stats to home / Posts page
- develop the end-game, Trust Points or Healthy Relater levels and access to deeper safer rooms for higher safety and vulnerable/charged topics etc
- tag filtering; presets; digests
- tag filter digests group similar tags
- Feature Requests should just be a preset in a whole bunch of tag filtering abilities
- buggish: Feature Requests feed allows replies now but does't show them
- lowercase all tags ?
- save user preferred feed ?
- character and maybe time to read length indicators maybe on Read More link
- fix double render (still happening? / use more loading)
- clean out Posts index
- posts feed slowness ?
- fix the smart feed active indicator, differently weird on desktop and phone ?
- allow like or heart or read or something on replies or all posts
- private rooms like worlds w game-ified invites / vote-off-island / scores etc
- private rooms for conversations, games, etc?
- picture handling, stop querying google for user photos
- ability to share pictures
- view posts feed by filters: user, tag
- save successful card info (PCI compliance!?)

## APPS

- daily scorecard app w limited visibility for habits etc and accountability
- healthy intimacy dating called Tender XD
- scorekeeper as part of rooms
- humans game modeling reality, eg mood meter
- event pages
- cooperative mind map
- jom's productivity tracker
- implement reemind app
- movies seen w ratings and reviews; books, etc
- new names networking/contacts/friends utility
