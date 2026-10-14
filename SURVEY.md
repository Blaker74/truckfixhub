# TruckFixHub industry-priorities survey

## Purpose and questions

Standalone page: https://truckfixhub.com/industry-survey.html

The headline is “What would help you and your business in trucking?” Ask people with different trucking roles which one to three challenges they want help with, which they would address first, what improvement would help most, and how it would help them. Role and the two issue questions are required. Written answers are optional and limited to 1,000 characters each. Issue ordering is randomized except the final Other option. The questionnaire does not require agreement with the owner's views.

## Collection and privacy

Sign-in is required. One response per account per survey version (2026-10) is enforced in PostgreSQL; this is not a verified one-person sample and does not verify professional roles. The form explicitly says it is not anonymous: the owner can review answers linked to an account. No name, email, phone, precise location or employer field is collected by the survey itself. Existing account authentication remains separate.

RLS permits members to read, submit and withdraw only their own responses. No public or member-wide read policy exists. The page offers withdrawal. No update grant is provided; members can withdraw and submit a replacement. Insert column grants prevent clients from forging the server-created timestamp or ID. No marketing subscription, outbound invitations, or public posting of written answers occurs. Written answers require separate permission before individual publication.

The remote Supabase table was created with create_tfh_industry_survey_2026_10, followed by restrict_tfh_survey_insert_columns. industry-survey.sql records the final schema. It is isolated from existing tables and community policies.

## Validation

Four payload unit tests and mock DOM checks passed: signed-out gate, 13 issues, signed-in saved-response check, submission, repeat-submit gate, and withdrawal. Syntax, local asset paths, and HTML IDs passed.

Transactional database tests used authenticated role claims to verify own insert/read, duplicate rejection, option validation, unrelated-account read/delete denial, spoofed-owner insert denial, and own withdrawal. All test writes were rolled back. Initial real response count: zero. Anonymous table read/insert and authenticated updates are not granted. Column privileges confirmed server timestamps cannot be supplied by members.

Security advisors identified no findings naming the new survey table. Existing unrelated project findings remain, including leaked-password protection disabled: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

Browser visual/iPhone and real email/password sign-in through the new page have not been verified. The existing account/signup/password-reset page is reused. Do not describe mock or role-simulation checks as complete browser testing.

## Reporting plan

Report the collection dates, total responses, role composition and recruitment channels. Give both the percentage selecting an issue and the percentage choosing it as most urgent. Multiple-choice percentages may total more than 100%. Do not present selected issues as a full ranking; only the most-urgent question identifies a first priority.

Compare roles while keeping small groups private; avoid publishing breakdowns with fewer than five respondents. Review free text for recurring themes without publishing individual quotations or identifying details. Record withdrawals in subsequent counts and do not treat a small self-selected sample as representative of the whole industry. No people have been contacted or real answers collected during setup.

## Published survey evidence reviewed October 14, 2026

ATRI's 2025 survey had more than 4,200 trucking-industry respondents. Its overall leading concerns were the economy, lawsuit abuse reform, insurance cost/availability, truck parking, and driver compensation. Respondents were roughly 46% carrier executives/personnel, 30% drivers and 23% other stakeholders, with rounding. Driver respondents' top three were compensation, parking and English-language proficiency; carrier respondents prioritized the economy, lawsuit abuse reform and insurance. These are that survey's results, not TruckFixHub responses or a representative poll of all truckers.

ATRI announced that its 2026 results would be released October 18, 2026; those results were not available on the research date. The TruckFixHub questionnaire adds topics central to this community, including repair costs, technician availability and next-generation training. Its results should not be directly compared numerically with ATRI's differently designed survey.

Sources:
- https://truckingresearch.org/2025/10/for-the-third-year-in-a-row-the-economy-is-the-trucking-industrys-top-concern/
- https://truckingresearch.org/2026/08/trucking-industry-asked-to-rank-top-concerns-for-2026/
- https://trid.trb.org/View/2613647
