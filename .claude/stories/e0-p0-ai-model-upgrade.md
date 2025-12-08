# Story: Upgrade AI Model to Gemini 2.5 Flash

**Epic:** Infrastructure / Pre-requisite for E6
**Status:** not-started
**Priority:** P0 (Critical)
**Points:** 2
**Created:** 2024-12-08
**Updated:** 2024-12-08

## Objective
Switch from Gemini 2.0 Flash (free tier) to Gemini 2.5 Flash (paid) to eliminate quota limits and improve response quality.

## Background
- Current model: `gemini-2.0-flash` hitting free tier quota limits
- Target model: `gemini-2.5-flash` with billing enabled
- Budget: £5/month (estimated actual cost: ~£0.15/month)

## Acceptance Criteria
- [ ] Google Cloud billing enabled for Gemini API
- [ ] All 3 API routes updated to use `gemini-2.5-flash`
- [ ] Verify responses are fast (<3 seconds)
- [ ] Verify quality is maintained or improved
- [ ] No quota errors in production

## Implementation Notes

### Files to Update
1. `src/app/api/analyze/route.ts` - Entry insights
2. `src/app/api/themes/route.ts` - Theme analysis
3. `src/app/api/summary/route.ts` - Weekly/monthly summaries

### Code Change
```typescript
// Before
model: google("gemini-2.0-flash")

// After
model: google("gemini-2.5-flash")
```

### Google Cloud Setup
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Navigate to API keys settings
3. Enable billing on the associated Google Cloud project
4. Verify API key has access to Gemini 2.5 Flash

### Environment
- Same `GOOGLE_GENERATIVE_AI_API_KEY` works for paid tier
- No new env vars needed

## Test Plan
- [ ] Test entry analysis locally
- [ ] Test theme discovery locally
- [ ] Test weekly/monthly summary locally
- [ ] Deploy to production
- [ ] Verify no quota errors after multiple requests

## Completion Evidence
_Filled when complete:_
- Tests: ___
- Response time: ___
- Verified in production: ___
