# Shidduch process model

The UI should feel simple, but the underlying model must preserve the real process. This document is a checklist for later implementation.

## The five questions the app must always be able to answer

For any person or match:

1. **Who is involved?**
2. **Who contacted whom?**
3. **What exactly was sent or discussed?**
4. **What was the result?**
5. **What needs to happen next, and when?**

If a screen cannot answer those questions without reading a pile of free-text notes, the information architecture is not finished.

## Main records

### Person
Stable information about one human.

Possible roles are not mutually exclusive:
- single guy
- single girl
- shadchan
- friend
- family member
- rabbi/reference
- contact person
- other

A person can participate in many match cases and many activities.

### Match case
One proposed guy-girl pairing.

Store:
- guy
- girl
- who suggested it
- all intermediaries/contacts involved
- created date, only when known
- current overall stage
- **guy-side status**
- **girl-side status**
- next action
- next-action due date
- open/closed reason
- links to all activity, dates, profile packages and notes

Do not force both sides into the same status. Examples:
- Guy: interested; Girl: profile not yet sent
- Guy: wants date 2; Girl: thinking
- Guy: stop; Girl: would continue

The overall stage can be derived for display.

### Activity event
The universal ledger record.

Suggested fields:
- timestamp
- type
- actor / sender
- recipient(s)
- concerning person(s)
- match case
- channel
- direction relative to the owner: incoming / outgoing / internal / in-person
- subject/title
- body or note
- payload / asset references
- result
- side affected: guy / girl / both / none
- result state
- next action
- next-action due date
- source event, when one event is a reply/follow-up to another
- privacy/visibility marker

The same event is linked from every relevant place instead of copied into unrelated histories.

### Profile package
A versioned snapshot of what can actually be shared.

Fields:
- person
- version
- received/created date
- source person
- profile text
- photo(s)
- PDF/screenshot
- audio
- contact details included
- language(s)
- notes about whether it is current

Every send/share activity points to a specific package version.

### Date
A structured part of a match case.

Fields:
- match
- date number
- proposed date/time
- confirmed date/time
- location/logistics
- scheduled by / through whom
- happened / cancelled / postponed / no-show
- guy feedback
- girl feedback
- shadchan summary
- guy result: continue / unsure / stop / unknown
- girl result: continue / unsure / stop / unknown
- next action
- next date information

The date also creates events in the universal ledger.

### Follow-up
A next action generated from the process.

Examples:
- call shadchan
- wait for answer
- send profile
- ask friend
- ask reference
- send feedback
- confirm date
- call after date
- check back in one week

Follow-ups should be connected to the event/case that created them. Completing a follow-up creates a new event.

## Process from beginning to end

### 1. Intake / discovery
Possible starts:
- shadchan sends a profile
- friend sends a profile
- user sees a person independently
- user sends own card/profile to someone
- shadchan suggests two existing people
- profile arrives from WhatsApp share/import

Record:
- who it came from
- what arrived
- exact files/profile version
- when it arrived
- whether this is a new person, updated profile, or new match idea

### 2. Initial review
Possible actions:
- read profile
- view photo
- listen to audio
- save private first impression
- ask the sender a question
- mark not relevant
- decide to investigate

Do not change the source profile text when adding private notes.

### 3. Ask other people / research
Possible people:
- friend
- family
- rabbi
- reference
- another shadchan

Record each share and each answer separately:
- what was sent to them
- what question was asked
- their answer
- whether that answer was passed to someone else

This is essential because “I asked David” and “Miriam said David said…” are not the same provenance.

### 4. Send or receive the actual suggestion
A profile/package may move:
- shadchan → user
- user → shadchan
- shadchan → other side
- user → friend/family
- friend → user
- one shadchan → another

Every movement should show:
**FROM → TO · CHANNEL · WHAT · TIME · RESULT**

Possible results:
- delivered / sent
- waiting
- opened/reviewed if manually recorded
- interested
- not interested
- needs more info
- no response

### 5. Questions before a date
Common information:
- hashkafa/religious fit
- location/relocation
- age or family details
- Kohen compatibility
- work/lifestyle
- references
- practical date logistics

Questions belong to the match case when they are specific to that pairing. Stable facts learned about a person can also be saved to the person record.

### 6. Decision to meet
Track each side independently:
- not asked yet
- considering
- yes
- no
- needs information

When both are yes, create the date-scheduling follow-up.

### 7. Date scheduling
Record:
- who coordinated
- proposed options
- confirmed date/time
- location
- transportation/logistics if useful
- changes/cancellations

Do not bury changes inside one overwritten date field; important changes belong in the ledger.

### 8. Date happens
Create a structured Date record and activity entry.

### 9. Post-date feedback
Feedback usually travels through several steps:
- single → user/shadchan
- user → primary shadchan
- other side → their shadchan
- shadchan → user

Keep each message/call and its source. Store guy and girl results separately.

Possible side result:
- continue
- unsure / needs time
- stop
- awaiting feedback

### 10. Repeated dates
The same structure repeats for date 2, 3, 4, etc. The case page should make the sequence obvious without requiring separate manual notes.

### 11. Pause / hold
Examples:
- travel
- family issue
- wants time to think
- temporarily unavailable

Pause is different from closed. Keep the reason and a follow-up date when appropriate.

### 12. Ended
Record:
- who stopped: guy / girl / mutual / unknown
- when
- reason, if known and appropriate to save
- who was informed
- whether follow-up is still needed

Do not erase the case. Closed cases are valuable history and prevent accidental repeated suggestions with no context.

### 13. Engagement / marriage
The case can end successfully while remaining in history.

## Event types worth supporting

- profile-received
- profile-sent
- photo-sent
- pdf-sent
- contact-card-sent
- message-in
- message-out
- call
- call-note
- reference-call
- question-asked
- answer-received
- friend-review-requested
- friend-feedback
- match-suggested
- side-status-changed
- waiting-started
- waiting-ended
- date-proposed
- date-scheduled
- date-rescheduled
- date-cancelled
- date-completed
- date-feedback
- feedback-relayed
- follow-up-created
- follow-up-completed
- note
- audio-note
- case-paused
- case-reopened
- case-closed
- engaged
- married

The UI does not need to expose these technical names. They are the structure under simple actions.

## What should be derived automatically

From the structured records the app can derive:
- who has each person’s profile
- which profile version they have
- who introduced each person/match
- how long someone has been waiting
- latest contact with a person
- latest result on a match
- current guy/girl side statuses
- number and outcome of dates
- overdue follow-ups
- upcoming dates
- profiles sent with no response
- shadchan activity and response patterns
- a complete chronological story

This is the main advantage over adding more and more free-text fields.
