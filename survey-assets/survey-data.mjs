export const VERSION='2026-10';
export const ROLES={company_driver:'Company driver',owner_operator:'Owner-operator',fleet_business:'Fleet / trucking business',technician:'Technician / repair shop',parts:'Parts professional',training:'Instructor / training provider',student_newcomer:'Student / newcomer',other:'Another role'};
export const ISSUES={fuel:'Fuel prices',freight:'Freight rates / available freight',emissions:'Emissions-system problems',repairs:'Repair costs / downtime',technicians:'Finding qualified technicians',next_generation:'Attracting and training the next generation',parking:'Truck parking',detention:'Waiting / detention time',pay_conditions:'Driver pay / working conditions',insurance:'Insurance / liability costs',regulations_training:'Regulations / driver training standards',fraud:'Freight fraud / cargo theft',other:'Another issue'};
export function surveyPayload({userId,role,issues,priority,impact='',improvement='',consent}){
 if(!userId)throw Error('Sign in before submitting.');
 if(!Object.hasOwn(ROLES,role))throw Error('Choose the role that best fits you.');
 if(!Array.isArray(issues)||issues.length<1||issues.length>3||new Set(issues).size!==issues.length||issues.some(k=>!Object.hasOwn(ISSUES,k)))throw Error('Choose one to three different issues.');
 if(!issues.includes(priority))throw Error('Choose the most urgent issue from your selections.');
 if(impact.length>1000||improvement.length>1000)throw Error('Keep each written answer within 1,000 characters.');
 if(consent!==true)throw Error('Please read and accept how responses will be used.');
 return {user_id:userId,survey_version:VERSION,role,issues,priority,impact:impact.trim(),improvement:improvement.trim(),consent:true};
}
