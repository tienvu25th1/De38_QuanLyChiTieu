const express=require('express');
const pool=require('../config/db');
const authenticate=require('../middleware/auth.middleware');
const router=express.Router();router.use(authenticate);
router.get('/summary',async(req,res,next)=>{try{
 const scope=req.query.scope||'personal';
 if(!['personal','family'].includes(scope))return res.status(400).json({message:'Invalid scope'});
 const month=Number(req.query.month||new Date().getMonth()+1),year=Number(req.query.year||new Date().getFullYear());
 if(!Number.isInteger(month)||month<1||month>12||!Number.isInteger(year)||year<2000||year>2100)return res.status(400).json({message:'Invalid period'});
 const access=scope==='personal'?"t.scope='personal' AND t.user_id=$1":"t.scope='family' AND EXISTS (SELECT 1 FROM family_members fm WHERE fm.family_id=t.family_id AND fm.user_id=$1 AND fm.status='ACTIVE')";
 const result=await pool.query(`SELECT COALESCE(SUM(t.amount) FILTER(WHERE t.type='in'),0) AS income,COALESCE(SUM(t.amount) FILTER(WHERE t.type='out'),0) AS expense,COUNT(*)::int AS total_transactions FROM transactions t WHERE ${access} AND t.transaction_date>=make_date($2,$3,1) AND t.transaction_date<(make_date($2,$3,1)+interval '1 month')`,[req.user.id,year,month]);
 const r=result.rows[0];res.json({scope,month,year,income:r.income,expense:r.expense,balance:(Number(r.income)-Number(r.expense)).toFixed(2),total_transactions:r.total_transactions});
 }catch(e){next(e);}});
module.exports=router;
