import test from 'node:test';
import assert from 'node:assert/strict';
import {surveyPayload,ISSUES,ROLES} from '../survey-assets/survey-data.mjs';
const example={userId:'test-user',role:'technician',issues:['fuel','repairs'],priority:'repairs',impact:'  Lost a workday  ',improvement:'  More training  ',consent:true};
test('survey accepts multiple roles and trims optional answers',()=>{for(const role of Object.keys(ROLES)){const p=surveyPayload({...example,role});assert.equal(p.role,role);assert.equal(p.impact,'Lost a workday');assert.equal(p.improvement,'More training');assert.equal(p.survey_version,'2026-10');}assert.equal(Object.keys(ISSUES).length,13);});
test('survey requires one to three distinct known issues',()=>{for(const issues of [[],['fuel','fuel'],['unknown'],['fuel','repairs','parking','insurance']])assert.throws(()=>surveyPayload({...example,issues}));});
test('priority must come from the selected issues',()=>{assert.throws(()=>surveyPayload({...example,priority:'parking'}));});
test('sign-in, consent, known role and length limits are enforced',()=>{for(const change of [{userId:''},{consent:false},{role:'fake_role'},{impact:'x'.repeat(1001)}])assert.throws(()=>surveyPayload({...example,...change}));});
