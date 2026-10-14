export function calculateCosts({loaded,empty,mpg,diesel,maintenance,pay,other,fixed,margin,rate}){
 const values=[loaded,empty,mpg,diesel,maintenance,pay,other,fixed,margin,rate];
 if(values.some(v=>!Number.isFinite(v)||v<0)||loaded<=0||mpg<=0||margin>=100)throw Error('Use positive loaded miles and MPG, nonnegative costs and empty miles, and a margin below 100%.');
 const miles=loaded+empty,fuel=miles/mpg*diesel,maintenanceTotal=miles*maintenance,payTotal=miles*pay,otherTotal=miles*other;
 const cost=fuel+maintenanceTotal+payTotal+otherTotal+fixed;
 return {miles,fuel,maintenanceTotal,payTotal,otherTotal,cost,perMile:cost/miles,breakEven:cost/loaded,target:cost/(1-margin/100)/loaded,revenue:rate*loaded,result:rate*loaded-cost,emptyPercent:empty/miles*100};
}
