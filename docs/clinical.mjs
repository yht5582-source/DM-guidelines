export const VERSION='2026-10-28';
export const num=v=>v===''||v==null?null:Number(v);
export function diagnose(s){
 const abnormal=[],pre=[];
 const a=num(s.a1c),f=num(s.fpg),o=num(s.ogtt),r=num(s.random),repeat=num(s.repeat);
 const unreliable=s.unreliable||s.dialysis;
 if(a!==null&&!unreliable){if(a>=6.5)abnormal.push('HbA1c');else if(a>=5.7)pre.push('HbA1c');}
 if(f!==null){if(f>=126)abnormal.push('空腹血漿葡萄糖');else if(f>=100)pre.push('空腹血漿葡萄糖');}
 if(o!==null){if(o>=200)abnormal.push('75 g OGTT 第 2 小時');else if(o>=140)pre.push('75 g OGTT 第 2 小時');}
 const threshold={a1c:6.5,fpg:126,ogtt:200}[s.repeatType];
 const repeatValid=repeat!==null&&threshold&&repeat>=threshold&&!(s.repeatType==='a1c'&&unreliable);
 const danger=s.alarm||[f,o,r].some(x=>x!==null&&x>=600);
 if(danger)return {code:'emergency',tone:'danger',title:'優先急症評估',body:'疑似高血糖危象或嚴重急性病況。立即評估生命徵象、血酮、電解質、酸鹼值與滲透壓；勿等門診診斷確認。SGLT2 相關 DKA 可出現在血糖未明顯升高時。',abnormal};
 if([f,o,r].some(x=>x!==null&&x<70))return {code:'low',tone:'danger',title:'先評估低血糖',body:'目前至少一項葡萄糖低於 70 mg/dL。先評估症狀、處理低血糖並回顧藥物，再完成慢性診斷流程。',abnormal};
 if(s.pregnant)return {code:'special',tone:'warn',title:'切換孕期診斷流程',body:'本頁數值判讀採非孕期標準。請依孕週與既有糖尿病狀態，使用 ADA 孕期專章及台灣孕期照護規範。',abnormal};
 if(['t1','t2','other'].includes(s.kind))return {code:'known',tone:'neutral',title:'已有糖尿病診斷：評估目前控制',body:'已選擇醫師確認的糖尿病類型。治療後數值下降不會取消既有診斷；請至治療規劃核對目前控制與共病。若本次為初次診斷，請將類型改為「尚未確認」。',abnormal};
 if((r!==null&&r>=200&&s.symptoms)||abnormal.length>=2||(abnormal.length>=1&&repeatValid))return {code:'diabetes',tone:'ok',title:'符合糖尿病診斷條件',body:r>=200&&s.symptoms?'隨機血漿葡萄糖 ≥200 mg/dL 且有典型症狀。仍需由醫師確認病因與糖尿病類型。':'已提供兩項達標檢驗，或初次異常與確認性異常檢驗。請確認採檢條件、檢驗有效性與糖尿病類型。',abnormal};
 if(abnormal.length)return {code:'confirm',tone:'warn',title:'達診斷閾值，仍需確認',body:`${abnormal.join('、')}達糖尿病閾值。無明確高血糖症狀／危象時需第二項異常結果；結果不一致時重複超過閾值的檢驗。`,abnormal};
 if(r!==null&&r>=200)return {code:'confirm',tone:'warn',title:'隨機血糖偏高，安排確認檢驗',body:'未勾選典型症狀，單次隨機血糖不能直接確診。安排有效 HbA1c、空腹血漿葡萄糖或 OGTT。',abnormal};
 if(pre.length)return {code:'prediabetes',tone:'warn',title:'落在糖尿病前期範圍',body:`依 ADA 閾值：${pre.join('、')}落在前期範圍。安排生活型態介入與至少每年評估；高風險個案個別考慮預防治療。`,abnormal};
 if(a===null&&f===null&&o===null&&r===null)return {code:'empty',tone:'neutral',title:'輸入檢驗，開始判讀',body:'空白代表未知；請使用實驗室血漿葡萄糖。家用血糖機與 CGM 不作為本工具的確診依據。',abnormal};
 return {code:'below',tone:'neutral',title:'現有資料尚不足以確診',body:unreliable?'HbA1c 已排除於診斷演算；請以有效血漿葡萄糖檢驗判讀。':'已輸入的有效檢驗未達糖尿病閾值，不能據此排除未檢測項目的異常；依症狀與風險安排追蹤。',abnormal};
}
export function treatment(s){
 const d=diagnose(s),age=num(s.age),e=num(s.egfr),a=num(s.a1c),u=num(s.uacr),b=num(s.bmi);
 const cards=[];const add=(title,body,tone='neutral')=>cards.push({title,body,tone});
 if(d.code==='emergency'||d.code==='low'){add(d.title,d.body,'danger');return {blocked:true,cards};}
 if(s.pregnant||age!==null&&age<18||s.kind==='t1'||s.kind==='other'||s.suspectT1){add('需專科／特殊族群流程','孕期、兒童、已知或疑似第 1 型及其他特定型糖尿病，不能套用成人第 2 型選藥演算。第 1 型需胰島素照護；疑似胰島素缺乏應即時評估血酮，安排抗體／C-peptide 等分類評估。','warn');return {blocked:true,cards};}
 if(age===null||s.kind!=='t2'){add('先完成年齡與類型確認','請填寫年齡，並由醫師確認為第 2 型糖尿病。檢驗達標本身不能確定糖尿病類型。','warn');return {blocked:true,cards};}
 if(!s.reviewed){add('先確認安全與共病資料','請核對下方共病、安全條件與目前用藥，再勾選「已完成核對」。未核對時不產生選藥建議。','warn');return {blocked:true,cards};}
 if(s.dialysis){add('透析：個別化專科選藥','不使用 metformin，亦不新啟用 SGLT2 抑制劑。胰島素及部分非腎清除 GLP-1 類藥物可由專科評估；注意低血糖、營養、腸胃副作用與個別台灣仿單。HbA1c 可靠性下降，搭配血糖／CGM。','warn');return {blocked:false,cards};}
 const severe=(!s.unreliable&&a!==null&&a>10)||[num(s.fpg),num(s.random),num(s.ogtt)].some(x=>x!==null&&x>=300)||s.catabolic||s.symptoms;
 if(severe)add('優先評估胰島素需要','出現高血糖症狀、分解代謝徵象、HbA1c >10% 或血糖 ≥300 mg/dL 時，考慮啟動胰島素；先排除危象及胰島素缺乏。此處不自動產生劑量。','warn');
 if(s.ascvd)add('ASCVD：納入有實證的心血管保護藥物','考慮具有相應心血管效益的 GLP-1 RA 及／或 SGLT2 抑制劑，並整合血壓、血脂與戒菸管理。器官保護不以 HbA1c 未達標為必要前提。','ok');
 if(s.hf)add('心衰竭：優先評估 SGLT2 抑制劑','確認腎功能、容量狀態與個別藥物仿單；避免 pioglitazone 用於心衰竭。健保心衰竭給付另有條件，不等同糖尿病給付路徑。','ok');
 if(e!==null&&e<20)add('腎功能限制：不新啟用 SGLT2','本工具不在 eGFR <20 新啟用 SGLT2 抑制劑；既有用藥是否持續需依專科評估、仿單與健保適應症分別確認。','warn');
 if(s.ckd){add('CKD：整合腎臟與心血管保護',e===null?'先取得 eGFR 與 UACR，再選擇 SGLT2 抑制劑或具實證 GLP-1 RA。':e>=20?'eGFR ≥20 可依個別適應症評估 SGLT2 抑制劑；具實證 GLP-1 RA 也是重要選項。eGFR <45 時 SGLT2 的降糖效果減弱。':'eGFR <20 不依本工具新啟用 SGLT2 抑制劑；既有治療是否持續與非腎清除 GLP-1 RA 選擇交由專科評估。','ok');}
 else if(e!==null&&e<60||u!==null&&u>=30)add('腎臟檢驗異常：確認慢性病程','單次 eGFR <60 或 UACR ≥30 不足以確認 CKD；排除急性與暫時性原因，確認至少 3 個月持續異常。','warn');
 if(b!==null&&b>=27)add('體重也是治療目標','結合營養、運動與行為支持；依個案評估 GLP-1 RA 或雙重 GIP/GLP-1 RA。台灣健保糖尿病給付不可由 BMI 或減重需求單獨推定。');
 if(!s.ascvd&&!s.hf&&!s.ckd)add('一般成人第 2 型：依目標選藥','搭配生活型態與自我管理支持，依降糖幅度、體重、低血糖風險、成本與偏好選藥；metformin 為常用選項。需要強化且無嚴重高血糖時，GLP-1 類治療優先於起始胰島素的降糖策略。');
 add('Metformin 腎功能核對',e===null?'腎功能未知，先取得 eGFR，暫不確認起始適合性。':e<30?'eGFR <30：禁用 metformin。':e<45?'eGFR 30–44：依 ADA 引用 FDA 建議不新啟用；既有治療需重新評估與調整，並核對台灣仿單。':'eGFR ≥45：可依臨床條件評估；仍需排除急性缺氧、脫水等風險。',e!==null&&e<45?'warn':'neutral');
 if(s.frail||s.hypo||s.medInsulin||s.medSU)add('減少低血糖與治療負擔','衰弱／低血糖高風險者應放寬或重新設定目標；新增降糖藥時回顧 insulin、SU／meglitinide 是否需減量。');
 if(s.medDpp&&s.medGlp)add('藥物重複機轉','DPP-4 抑制劑不建議與 GLP-1 RA 或雙重 GIP/GLP-1 RA 併用。','warn');
 if(s.medSglt)add('SGLT2 使用安全','急病、長時間禁食或疑似 DKA 時需評估暫停；手術前依品項通常停 3–4 天。留意脫水、生殖道感染及正常血糖 DKA。');
 return {blocked:false,cards};
}
