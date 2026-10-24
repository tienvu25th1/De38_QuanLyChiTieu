const express=require('express');
const pool=require('../config/db');
const authenticate=require('../middleware/auth.middleware');
const router=express.Router();router.use(authenticate);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validDate=value=>{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;
 const date=new Date(`${value}T00:00:00.000Z`);
 return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
};
router.get('/summary',async(req,res,next)=>{try{
 const scope=req.query.scope||'personal';
 if(!['personal','family'].includes(scope))return res.status(400).json({message:'Invalid scope'});
 const month=Number(req.query.month||new Date().getMonth()+1),year=Number(req.query.year||new Date().getFullYear());
 if(!Number.isInteger(month)||month<1||month>12||!Number.isInteger(year)||year<2000||year>2100)return res.status(400).json({message:'Invalid period'});
 const {from,to,account_id,category_id,type,family_id}=req.query;
 if(from!==undefined&&!validDate(from)||to!==undefined&&!validDate(to))return res.status(400).json({message:'Invalid date range'});
 if(from&&to&&from>to)return res.status(400).json({message:'Start date must not be after end date'});
 if(account_id!==undefined&&!uuid.test(account_id))return res.status(400).json({message:'Invalid account id'});
 if(category_id!==undefined&&!uuid.test(category_id))return res.status(400).json({message:'Invalid category id'});
 if(family_id!==undefined&&(!uuid.test(family_id)||scope!=='family'))return res.status(400).json({message:'Invalid family id'});
 if(type!==undefined&&!['in','out'].includes(type))return res.status(400).json({message:'Invalid transaction type'});
 const access=scope==='personal'?"t.scope='personal' AND t.user_id=$1":"t.scope='family' AND EXISTS (SELECT 1 FROM family_members fm WHERE fm.family_id=t.family_id AND fm.user_id=$1 AND fm.status='ACTIVE')";
 const params=[req.user.id,year,month];
 let where=`${access} AND t.transaction_date>=make_date($2,$3,1) AND t.transaction_date<(make_date($2,$3,1)+interval '1 month')`;
 if(family_id){const member=await pool.query("SELECT 1 FROM family_members WHERE family_id=$1 AND user_id=$2 AND status='ACTIVE'",[family_id,req.user.id]);if(!member.rowCount)return res.status(403).json({message:'Family access denied'});params.push(family_id);where+=` AND t.family_id=$${params.length}`;}
 if(from){params.push(from);where+=` AND t.transaction_date >= $${params.length}::date`;}
 if(to){params.push(to);where+=` AND t.transaction_date <= $${params.length}::date`;}
 if(account_id){params.push(account_id);where+=` AND t.account_id=$${params.length}`;}
 if(category_id){params.push(category_id);where+=` AND t.category_id=$${params.length}`;}
 if(type){params.push(type);where+=` AND t.type=$${params.length}`;}
 const [summary,categories,accounts,trend]=await Promise.all([
  pool.query(`SELECT COALESCE(SUM(t.amount) FILTER(WHERE t.type='in'),0) AS income,COALESCE(SUM(t.amount) FILTER(WHERE t.type='out'),0) AS expense,COUNT(*)::int AS total_transactions FROM transactions t WHERE ${where}`,params),
  pool.query(`SELECT c.id AS category_id,c.name AS category_name,t.type,SUM(t.amount) AS amount,COUNT(*)::int AS total_transactions FROM transactions t JOIN categories c ON c.id=t.category_id WHERE ${where} GROUP BY c.id,c.name,t.type ORDER BY SUM(t.amount) DESC`,params),
  pool.query(`SELECT a.id AS account_id,a.name AS account_name,t.type,SUM(t.amount) AS amount,COUNT(*)::int AS total_transactions FROM transactions t JOIN accounts a ON a.id=t.account_id WHERE ${where} GROUP BY a.id,a.name,t.type ORDER BY SUM(t.amount) DESC`,params),
  pool.query(`SELECT t.transaction_date,COALESCE(SUM(t.amount) FILTER(WHERE t.type='in'),0) AS income,COALESCE(SUM(t.amount) FILTER(WHERE t.type='out'),0) AS expense FROM transactions t WHERE ${where} GROUP BY t.transaction_date ORDER BY t.transaction_date`,params)
 ]);
 const r=summary.rows[0];
 res.json({scope,month,year,family_id:family_id||null,income:r.income,expense:r.expense,balance:(Number(r.income)-Number(r.expense)).toFixed(2),total_transactions:r.total_transactions,categories:categories.rows,accounts:accounts.rows,trend:trend.rows,filters:{from:from||null,to:to||null,account_id:account_id||null,category_id:category_id||null,type:type||null}});
}catch(e){next(e);}});
module.exports=router;
