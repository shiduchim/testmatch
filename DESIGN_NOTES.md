# TestMatch design synthesis

This repo is a design lab, not the final app. It combines the strongest ideas from the existing projects and focuses on the part that has been hardest to organize: the complete shidduch process over time.

## What the existing versions do best

### PeerMatch (`shiduchim/match`)
Best reference for the real daily workflow and the amount of information that must be retained. It has detailed Guy/Girl/Shadchan records, contact buttons, attachments, profile text, quick details, linked shadchanim, Make Match, WhatsApp/SMS/Email sharing, call follow-up, waiting-for-reply, WhatsApp ZIP import, backup/restore, and a detailed History.

Weakness: history is attached mainly to people, so reconstructing one shidduch from introduction through dates can require reading several records. The code also accumulated many layered runtime scripts.

### zugmatch (`shiduchim/zugmatch`)
Best clean implementation of the proven PeerMatch behavior. It deliberately preserves the familiar workflow while giving each feature one code owner, one WhatsApp queue, cleaner history pairing and automated comparisons/tests.

Weakness: because its goal is fidelity, it intentionally does not solve the larger information-architecture problem.

### ZivugBase (`shiduchim/zivugbase`)
Best CRM/engine ideas for scale: proper derived state, relationships, sorting/grouping, a Today dashboard, saved views, tags, stages, and a cleaner architecture. It was designed for hundreds of records rather than a small contact list.

Weakness: some of the CRM concepts add structure without necessarily making the actual shidduch story easier to read, and several PeerMatch workflows were originally out of scope.

### zugbase (`shiduchim/zugbase`)
Best experiments around Intake, folders, nested organization, Add to…, zoom levels, Home, memos, soft delete, and links between records. Its later build also makes the folder tree a real explorer.

Weakness: folders alone cannot explain the process. Knowing where a person is filed is different from knowing who contacted whom, what was sent, what happened, and what the next action is.

## Core model proposed for the next version

The key change is to stop treating every piece of information as just a note on a person.

### 1. Person
A real human/contact:
- guy or girl
- shadchan
- friend
- relative
- rabbi/reference
- other contact

The person keeps stable facts: phones, email, profile information, religious/personal details, files, folders, who introduced them, etc.

### 2. Match / Shidduch case
One proposed pairing between one guy and one girl. This is the center of the actual process.

A case has:
- Guy
- Girl
- suggesting shadchan / source
- other people involved
- current stage
- current result/status
- next action and due date
- start/end dates
- all connected activity

A case survives even if many people become involved later.

### 3. Activity / ledger event
This is the bank-app-style history. Every meaningful action is one structured event.

Examples:
- profile received
- profile/photo/PDF sent
- WhatsApp/SMS/email sent or received
- phone call
- waiting for reply
- reply received
- asked friend/rabbi for opinion
- friend feedback received
- information relayed to shadchan
- shadchan suggested a match
- profile reviewed
- date proposed
- date scheduled
- date happened
- date feedback from guy
- date feedback from girl
- feedback sent to shadchan
- continue / hold / declined / ended
- reminder/follow-up set
- note or audio memo

Each event should know, where relevant:
- **Who acted**
- **Who it was sent/contacted to**
- **Which person or match it concerned**
- **What was sent**: profile text, photo, PDF, contact card, message, etc.
- **Channel**: in person, call, WhatsApp, SMS, email, other
- **When**
- **Result**
- **Next action**
- **Attachments / exact profile version**

One event can be linked to several records. For example, “Leah profile v3 + photo sent to Miriam by WhatsApp” belongs to Leah, Miriam, and the Aaron–Leah match without making three unrelated copies.

### 4. Profile package / version
Profiles change. The app should know which version was actually sent.

A package can contain:
- profile text
- photo(s)
- PDF/screenshot
- audio
- contact details
- created/received date
- source

A send event points to a package version. Later you can answer: **What exactly did I send her?**

### 5. Date
A date is important enough to be structured rather than buried in a note:
- date number
- scheduled time/date
- location/details
- happened / cancelled / postponed
- guy feedback
- girl feedback
- shadchan feedback/summary
- outcome: continue, unsure, stop
- next date / next action

The date still appears chronologically in the activity ledger.

### 6. Follow-up / task
Any event can produce a next action:
- call shadchan Tuesday
- ask friend for feedback
- wait for answer until Friday
- send updated profile
- confirm date location

Home should be generated from these next actions instead of requiring a second unrelated reminder system.

## Four UI experiments

### A. Ledger
Bank-app metaphor. The central screen is the chronological activity ledger. Every row immediately shows the actors, action, object, result and next step. Best for answering “what happened?”

### B. Case File
The central screen is one shidduch case (Guy ↔ Girl). It shows stage, people involved, next action, profile packages, dates and the same ledger. Best for following one proposal from beginning to end.

### C. People & Connections
Starts from a person, but shows their network and every match/share/contact relationship. Best for answering “who is connected to whom?” and “who has this person’s profile?”

### D. Today
Action-first dashboard: overdue follow-ups, waiting replies, upcoming dates, new intake and active matches. Best for deciding what to do now.

The likely final app should combine these rather than pick only one. A strong direction is **Today as Home + Case File for each shidduch + Ledger as the universal history + People/Folders for the stable database.**
