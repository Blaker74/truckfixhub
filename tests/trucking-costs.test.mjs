import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateCosts} from '../assets/trucking-costs.mjs';
const example={loaded:8000,empty:2000,mpg:6.5,diesel:4,maintenance:.2,pay:.65,other:.1,fixed:5000,margin:10,rate:2.5};
const close=(actual,expected)=>assert(Math.abs(actual-expected)<.000001,`${actual} != ${expected}`);
test('worked example includes all miles and divides break-even by loaded miles',()=>{
 const r=calculateCosts(example);close(r.cost,20653.846153846);close(r.perMile,2.0653846153846);close(r.breakEven,2.58173076923);close(r.target,2.86858974359);close(r.result,-653.846153846);close(r.emptyPercent,20);
});
test('margin uses revenue rather than a markup on cost',()=>{
 const r=calculateCosts({loaded:800,empty:200,mpg:10,diesel:5,maintenance:0,pay:0,other:0,fixed:500,margin:20,rate:2});
 close(r.cost,1000);close(r.perMile,1);close(r.breakEven,1.25);close(r.target,1.5625);close(r.result,600);
});
test('additional deadhead raises cost at a fixed loaded-mile revenue',()=>{
 const a=calculateCosts({...example,empty:0}),b=calculateCosts({...example,empty:3000});assert(b.breakEven>a.breakEven);assert(b.result<a.result);close(a.revenue,b.revenue);
});
test('zero margin equals break-even and invalid denominators are rejected',()=>{
 const r=calculateCosts({...example,margin:0});close(r.target,r.breakEven);
 for(const change of [{loaded:0},{mpg:0},{empty:-1},{fixed:NaN},{margin:100},{diesel:Infinity}])assert.throws(()=>calculateCosts({...example,...change}));
});
