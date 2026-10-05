window.CP_MIRAGE_MAP={
 id:'OA-MIRAGE',name:'MIRAGE',region:'ARID ROUTE-LOGISTICS CORRIDOR',seed:'MRG-04',
 tactical:{width:900,height:650},status:'CAMPAIGN 04 ACTIVE',
 sites:[
  {id:'FAC-01',x:410,y:82,label:'AIRFIELD',capability:'AVIATION / CARGO / FUEL'},
  {id:'FAC-02',x:637,y:330,label:'INDUSTRIAL FACILITY',capability:'FUEL / MAINTENANCE / HEAVY STORAGE'},
  {id:'FAC-03',x:501,y:236,label:'LOGISTICS JUNCTION',capability:'TRANSPORT / TRANSFER / DISTRIBUTION'},
  {id:'FAC-04',x:451,y:553,label:'COMMERCIAL / LOGISTICS',capability:'CIVIL DISTRIBUTION / AGRICULTURAL SUPPORT'},
  {id:'FAC-05',x:466,y:169,label:'SETTLEMENT / SUPPORT',capability:'LOCAL SERVICES / GOVERNMENT SUPPORT'},
  {id:'FAC-06',x:326,y:270,label:'REMOTE COMPOUND',capability:'STORAGE / VEHICLE SUPPORT'},
  {id:'FAC-07',x:529,y:363,label:'SUPPORT SITE',capability:'LIMITED VEHICLE SUPPORT / TEMP STORAGE'}
 ],
 population:[
  {id:'POP-A',label:'SOUTHERN POPULATION CENTER',x:370,y:525,w:130,h:95,density:'DENSE'},
  {id:'POP-B',label:'EASTERN POPULATION CENTER',x:755,y:250,w:95,h:100,density:'URBAN'},
  {id:'POP-C',label:'NORTH-CENTRAL SETTLEMENT',x:425,y:135,w:75,h:70,density:'SETTLEMENT'},
  {id:'POP-D',label:'WESTERN RURAL SETTLEMENTS',x:275,y:245,w:90,h:165,density:'RURAL'}
 ],
 nodes:{N01:[386,0],N02:[407,110],N03:[447,175],N04:[501,236],N05:[528,365],N06:[486,520],N07:[458,650],N08:[900,300],N09:[782,297],N10:[633,323],N11:[0,191]},
 paths:[['N01','N02','N03','N04'],['N11','N04','N05','N06','N07'],['N08','N09','N10','N04'],['N10','N05','N06']],
 siteNode:{'FAC-01':'N02','FAC-02':'N10','FAC-03':'N04','FAC-04':'N06','FAC-05':'N03','FAC-06':'N04','FAC-07':'N05'}
};
