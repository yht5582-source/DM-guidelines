import {num} from './clinical.mjs';
export const NHI_PDF='https://www.nhi.gov.tw/ch/dl-100717-e456d68a6e9d4085b4ab7a2c7e37296a-1.pdf';
const q=(id,label)=>({id,label});
const t2=q('t2','已確認為第 2 型糖尿病');
const max=q('max','已使用最大耐受劑量 metformin，血糖仍未理想控制');
const combo=q('combo','最大耐受 metformin 及／或 SU，合併指定另一類（SGLT2、DPP-4、兩者複方或 insulin），持續至少 6 個月');
const noCombo=q('noCombo','擬申報處方不併用 DPP-4 或 SGLT2（含其複方）');
const product=q('product','已核對實際健保品項／代碼、台灣仿單與處方劑量，符合所選條款');
export const pathways={
 glp:{name:'GLP-1 RA｜一般路徑',article:'5.1.3.2',date:'2020-12-01',page:83,drugs:'Victoza / Trulicity / Lyxumia / Ozempic',questions:[t2,combo,noCombo,product],numbers:[{id:'claimA1c',label:'申請時 HbA1c（%）',min:2,max:25}],note:'原文「HbA1c仍高於8.5%以上」：本工具對 >8.5 判為通過數值項，=8.5 標為邊界需人工核對。BMI 不是此條款給付門檻。不能套用至不同品牌／劑型（如減重品項或口服 semaglutide）。'},
 glpCv:{name:'GLP-1 RA｜重大心血管事件',article:'5.1.3.2 第3、4款',date:'2020-12-01',page:83,drugs:'僅 liraglutide / dulaglutide / semaglutide 指定品項',questions:[t2,q('event','曾有條文列舉重大心血管事件：MI、冠狀或其他動脈再通術、動脈硬化相關缺血性中風等'),max,noCombo,product],note:'此路徑不要求一般路徑的 6 個月或 8.5% 門檻；不含 lixisenatide。國際指引的「高風險」不等於本條文的「曾發生重大事件」。'},
 exen:{name:'Exenatide｜Byetta',article:'5.1.3.1',date:'2018-04-01',page:83,drugs:'Exenatide（Byetta）',questions:[t2,q('maxsu','最大耐受 metformin 及／或 SU 後，血糖仍未理想控制'),q('noIns','擬申報處方不併用 insulin、DPP-4 或 SGLT2'),product],note:'本條不得與胰島素併用；請勿直接套用其他 GLP-1 的基礎胰島素併用條件。'},
 soliqua:{name:'Soliqua｜固定複方',article:'5.1.3.3',date:'2021-07-01',page:84,drugs:'Lixisenatide + insulin glargine',questions:[t2,q('adult','患者為成年人'),combo,q('priorIns','若前置治療為 insulin，其每日劑量 <60 U；或前置治療並非 insulin'),noCombo,product],numbers:[{id:'claimA1c',label:'申請時 HbA1c（%）',min:2,max:25}],note:'原文「HbA1c仍高於8.0%以上」；恰為 8.0% 時需人工核對。60 U 是前置胰島素條件，非一般 insulin 的健保上限。'},
 oral:{name:'SGLT2 / DPP-4 / TZD｜糖尿病路徑',article:'5.1 通則、5.1.5',date:'2025-06-01（通則）',page:83,drugs:'適用已收載之口服品項',questions:[t2,q('oralMet','最大耐受 metformin 仍未理想控制，或已記錄 metformin 過敏／禁忌／不耐受'),q('oralCombo','已核對併用原則：SGLT2 與 DPP-4 宜擇一；特定兩者複方另走專屬條件'),product],note:'SGLT2 單方每日最多 1 粒；Jardiance Duo 每日最多 2 粒；Xigduo XR 每日最多 1 粒。5.1 通則於 2025/6/1 已刪除口服最多四種成分的舊限制。此結果不套用 CKD／HF 的獨立給付路徑。'},
 dual:{name:'SGLT2 + DPP-4｜固定複方',article:'5.1.6–5.1.8',date:'2020-05-01',page:84,drugs:'Glyxambi / Qtern / Steglujan',questions:[t2,q('dualPrior','最大耐受 metformin + 對應前置單方至少 6 個月，仍未達控制'),q('dualDose','擬使用劑量每日最多 1 粒'),product],numbers:[{id:'claimA1c',label:'申請時 HbA1c（%）',min:2,max:25}],note:'HbA1c 須 >7.5%。Glyxambi 前置：empagliflozin 或 linagliptin；Qtern：dapagliflozin 或 saxagliptin；Steglujan：ertugliflozin 或 sitagliptin。不可把任意同類單方視為符合前置條件。'},
 ckd:{name:'SGLT2｜CKD 獨立適應症',article:'2.16 第2款',date:'2025-03-01',page:48,drugs:'Dapagliflozin / empagliflozin（Jardiance 10 mg）指定品項',questions:[q('program','已參加初期 CKD 照護整合方案或 Pre-ESRD 計畫'),q('ras','ACEI 或 ARB 最大耐受劑量，穩定至少 4 週'),q('exclusion','已逐項核對 2.16 排除條件，均未符合（詳下方）'),q('one','每日最多 1 粒'),product],numbers:[{id:'claimEgfr',label:'起始 eGFR（mL/min/1.73 m²）',min:0,max:200},{id:'claimUacr',label:'起始 UACR（mg/g）',min:0,max:30000}],note:'起始 eGFR 25–60、UACR 200–5000（均含上下限）。使用後 eGFR <15 應依本健保條款停藥；此點不同於部分國際指引的持續用藥原則。此路徑不以糖尿病為必要條件。ACEI/ARB 不耐並未明列自動例外，需人工確認。',extra:'排除條件：第 1 型糖尿病、多囊腎、狼瘡腎病、ANCA 血管炎、近 6 個月化療／免疫抑制或腎病免疫治療、器官移植；急性 MI、不穩定心絞痛、中風或 12 週內 TIA、12 週內冠脈再通術。心血管事件時間範圍請核對原文，不將所有既往 MI／中風擅自視為永久排除。'},
 hf:{name:'SGLT2｜心衰竭獨立適應症',article:'2.16 第1款',date:'2025-03-01',page:48,drugs:'Dapagliflozin / empagliflozin（Jardiance 10 mg）指定品項',questions:[q('nyha','NYHA II–IV 且仍有症狀'),q('echo','初次申請有一年內的心功能檢查'),q('hftherapy','ACEI/ARB 穩定劑量 + β-blocker 最大耐受劑量至少 4 週（或 β-blocker 有禁忌），仍有症狀'),q('hfSpecial','若 LVEF 為 41–49%，曾因心衰竭住院或經心臟專科醫師診斷；若 ≤40% 選「是」'),q('one','每日最多 1 粒'),product],numbers:[{id:'ef',label:'LVEF（%）',min:0,max:100}],note:'本條列 LVEF ≤40% 或 41–49%；LVEF ≥50% 不在此路徑。數值介於 40 與 41 或 49 與 50 時，勿自行四捨五入，須人工核對。國際指引推薦不代表本條健保符合。'},
 insulin:{name:'Insulin｜一般給付核對',article:'5.1 通則',date:'2025-06-01',page:83,drugs:'已收載之 insulin 品項',questions:[q('insind','已確認糖尿病診斷、胰島素治療適應症及病歷紀錄'),product],note:'第 5.1 節未設一般 insulin 統一 HbA1c 起始門檻或日劑量上限。ADA 的 >10%／≥300 mg/dL 是臨床考量，並非健保硬門檻。特殊複方另依專屬條款。'},
 other:{name:'Tirzepatide／其他品項',article:'需逐品項查詢',date:'查核 2026-10-28',page:83,drugs:'Tirzepatide、未列於上述條款之品牌／劑型',questions:[],note:'本次未確認 tirzepatide 的正式健保給付依據。不可直接套用 GLP-1 既有條款，也不能僅因無專屬條文就推論所有品項均不給付。請查實際健保藥品代碼、收載狀態與公告。'}
};
export function evaluateNhi(key,values={}){
 const p=pathways[key],rows=p.questions.map(q=>({...q,status:values[q.id]==='yes'?'pass':values[q.id]==='no'?'fail':'unknown'}));
 const add=(label,status)=>rows.push({label,status});
 const a=num(values.claimA1c),e=num(values.claimEgfr),u=num(values.claimUacr),ef=num(values.ef);
 if(['glp','soliqua','dual'].includes(key)){const t=key==='glp'?8.5:key==='soliqua'?8:7.5;add(`申請 HbA1c ${key==='dual'?'>7.5%':`高於 ${t}%（等值需人工核對）`}`,a===null?'unknown':a<2||a>25?'invalid':a>t?'pass':a===t&&key!=='dual'?'manual':'fail');}
 if(key==='ckd'){add('起始 eGFR 25–60（含上下限）',e===null?'unknown':e<0||e>200?'invalid':e>=25&&e<=60?'pass':'fail');add('起始 UACR 200–5000（含上下限）',u===null?'unknown':u<0||u>30000?'invalid':u>=200&&u<=5000?'pass':'fail');}
 if(key==='hf')add('LVEF ≤40% 或 41–49%',ef===null?'unknown':ef<0||ef>100?'invalid':ef<=40||ef>=41&&ef<=49?'pass':ef>=50?'fail':'manual');
 const state=key==='other'?'manual':rows.some(x=>x.status==='invalid')?'invalid':rows.some(x=>x.status==='fail')?'fail':rows.some(x=>x.status==='manual')?'manual':rows.some(x=>x.status==='unknown')?'unknown':'pass';
 return {rows,state,title:{pass:'已符合本工具核對條件',fail:'有未符合項目',unknown:'尚缺核對資料',manual:'需人工確認',invalid:'請修正輸入數值'}[state]};
}
