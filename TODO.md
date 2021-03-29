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

1. user activity quality
2. clarify needs and app unique value
3. community growth and sales

## Priority Requests

1. (native app) push notifications

## Tier 1

- fix Google auth from apps like Facebook that use embedded browsers
- finish database security rules and related tests
- enforce @username uniqueness

## Tier 2

- home is getting slow
- family-tree displays and stats for top inviters ?
- use auth.token.identifier not uid
- improve visibility of "hot" topics/posts; get as many eyes/additional-activity on the "hot" (replies etc) as possible
- cross site search
- what is "healthy relating"? what are the expectations here, how do i play? map out what is healthy relating
- change display name, optional custom display names?
- community verification for display names
- post shouldn't need room in link

## Tier 3

- wizard trainings recommendation doesn't update itself when you submit a training modality, requires refresh
- use context for room, remove roomHack
- add (#) count to browser tab
- accounting tools
- 'Add Tags' to new top level post
- downvotes, or flagging or something
- remove hackFunctions
- help user to put it on their phone home screen
- phone users may be confused about no submit buttons for tags
- confirm prompt for delete post
- stats for top tag getters esp by tag type
- long-term small groups?; round tables, eg 5 closest friends, 5 best friends, 5 friends I want to be more like, etc
- chat rooms
- are client-visible userIds a concern?
- better react props handling
- add backend app to complete Stripe payment gateway, add purchasables

## Tier 4

- margins between Posts feednav and searchfilter are not obeyed on UserProfile (2021-03-09) -- it's because UserProfile is wrapped in Card Card.Body and Posts page is not
- change post 'userId' to 'uid'
- abstract posts' and collections' functions into models and utils etc
- replies should be less organized by hot and more by popular
- pin|save|favorite posts/conversations/threads
- show accurate reply count on user profile posts
- (my) user profile is so slow
- something to let premium members know all they're getting for their money, maybe like the PremiumSaleCard for premium members somewhere
- cleanup Posts/index.js
- editor's choice posts
- room-specifics like stats, users here now, etc
- manually fix old post links, there's not many of them
- the mark-post/thread-as-seen button should be more like a universal hide-until-new-stuff; Unseen feed should be obsolute, just a layer available on any other feed
- a top level post (without replyToId) is akin to a thread-head; a thread would keep useful meta-data, eg whether anyone had replied to any message in the thread since you last visited it
- change db 'upvote' to 'upvotes'
- https://www.robinwieruch.de/react-firebase-realtime-database
- develop the end-game, Trust Points or Healthy Relater levels and access to deeper safer rooms for higher safety and vulnerable/charged topics etc
- tag filtering; presets; digests
- tag filter digests group similar tags
- Feature Requests should just be a preset in a whole bunch of tag filtering abilities
- buggish: Feature Requests feed allows replies now but does't show them
- lowercase all tags ?
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
- save successful card info (PCI compliance!?)

## APPS

- daily scorecard app w limited visibility for habits etc and accountability
- healthy intimacy dating called Tender XD
- cooperative mind map
- jom's productivity tracker
- implement reemind app
- new names networking/contacts/friends utility
