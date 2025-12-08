# Story: Personalized Prompts

**Epic:** [E6 - Advanced AI](../epic.md)
**Status:** not-started
**Priority:** P2
**Points:** 5
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Generate AI-powered writing prompts based on user's journaling history, themes, and interests.

## Acceptance Criteria
- [ ] "Personalized prompt" option alongside existing random prompts
- [ ] Prompts reference user's themes and past entries
- [ ] Avoids repetitive or similar prompts
- [ ] Falls back to generic prompts for new users
- [ ] Prompts encourage deeper exploration of identified themes

## Implementation Notes
- Analyze user's theme history from E3 implementation
- Generate prompts that connect to their patterns
- Example: "You've written about work stress 5 times. What would your ideal workday look like?"
- Cache generated prompts to avoid API calls on each request

## Test Plan
- Test with users having theme history
- Verify prompts feel personal and relevant
- Test fallback for new users
- Verify no duplicate prompts in session

## Completion Evidence
_Filled when complete:_
- Tests: ___
- Verified: ___
