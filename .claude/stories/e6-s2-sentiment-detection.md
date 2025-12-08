# Story: AI Sentiment Detection

**Epic:** [E6 - Advanced AI](../epic.md)
**Status:** not-started
**Priority:** P2
**Points:** 5
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Have AI automatically suggest a mood based on entry content, reducing friction while keeping user in control.

## Acceptance Criteria
- [ ] AI suggests mood based on entry content after user finishes writing
- [ ] Suggestion appears as a gentle prompt, not automatic override
- [ ] User can accept with one click or ignore
- [ ] Target 80%+ accuracy match with user selections
- [ ] Never overrides explicit user mood choice

## Implementation Notes
- Call Gemini with entry content to analyze sentiment
- Map sentiment to existing mood options (10 moods available)
- Trigger analysis on entry save or after idle period
- Show suggestion near mood selector with "AI thinks you're feeling..."

## Test Plan
- Test with entries of varying emotional content
- Verify suggestion doesn't override manual selection
- Test accuracy across mood spectrum
- Verify UX is non-intrusive

## Completion Evidence
_Filled when complete:_
- Tests: ___
- Verified: ___
