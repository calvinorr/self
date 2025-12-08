# Story: Conversational Insights

**Epic:** [E6 - Advanced AI](../epic.md)
**Status:** not-started
**Priority:** P2
**Points:** 8
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Allow users to ask follow-up questions about their AI insights, creating a dialogue that deepens understanding.

## Acceptance Criteria
- [ ] "Ask more" button appears on AI insight cards
- [ ] Opens chat interface maintaining context of current entry
- [ ] Remembers previous questions within the session
- [ ] Clear conversation history per entry
- [ ] Responses maintain warm, supportive tone

## Implementation Notes
- Add conversation state to entry insight component
- Use Gemini with chat context (entry content + previous insight + follow-ups)
- Store conversation in local state (not persisted to DB initially)
- Consider streaming responses for better UX

## Test Plan
- Verify follow-up questions receive contextual answers
- Test conversation memory within session
- Verify clearing conversation works
- Test with various entry lengths and topics

## Completion Evidence
_Filled when complete:_
- Tests: ___
- Verified: ___
