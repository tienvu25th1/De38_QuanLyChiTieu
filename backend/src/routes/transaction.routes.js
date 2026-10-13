const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/auth.middleware');
const router = express.Router();
router.use(authenticate);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fail = (res, message, status=400) => res.status(status).json({message});
const wrap = fn => (req,res,next) => Promise.resolve(fn(req,res)).catch(next);
const accessible = `((t.scope='personal' AND t.user_id=$1) OR (t.scope='family' AND EXISTS (SELECT 1 FROM family_members fm WHERE fm.family_id=t.family_id AND fm.user_id=$1 AND fm.status='ACTIVE')))`;
router.get('/',wrap(async(req,res)=>{
 const {scope='personal',month,year}=req.query;
 if(!['personal','family','all'].includes(scope))return fail(res,'Invalid scope');
 if(month!==undefined && (!/^\d{1,2}$/.test(month)||+month<1||+month>12))return fail(res,'Invalid month');
 if(year!==undefined && (!/^\d{4}$/.test(year)||+year<2000||+year>2100))return fail(res,'Invalid year');
 const params=[req.user.id]; let sql=`SELECT t.*,c.name AS category_name,a.name AS account_name FROM transactions t JOIN categories c ON c.id=t.category_id JOIN accounts a ON a.id=t.account_id WHERE ${accessible}`;
 if(scope!=='all'){params.push(scope);sql+=` AND t.scope=$${params.length}`;}
 if(month!==undefined){params.push(+month);sql+=` AND EXTRACT(MONTH FROM t.transaction_date)=$${params.length}`;}
 if(year!==undefined){params.push(+year);sql+=` AND EXTRACT(YEAR FROM t.transaction_date)=$${params.length}`;}
 sql+=' ORDER BY t.transaction_date DESC,t.created_at DESC LIMIT 500';
 res.json({transactions:(await pool.query(sql,params)).rows});
}));
router.post('/',wrap(async(req,res)=>{
 const {account_id,category_id,type,amount,transaction_date,note='',payment_method='cash'}=req.body;
 if(!uuid.test(account_id||'')||!uuid.test(category_id||'')||!['in','out'].includes(type)||!Number.isFinite(Number(amount))||Number(amount)<=0||Number(amount)>999999999999)return fail(res,'Invalid transaction');
 if(transaction_date && !/^\d{4}-\d{2}-\d{2}$/.test(transaction_date))return fail(res,'Invalid date');
 if(typeof note!=='string'||note.length>5000||!['cash','bank','wallet','card','other'].includes(payment_method))return fail(res,'Invalid details');
 const a=await pool.query('SELECT id FROM accounts WHERE id=$1 AND user_id=$2 AND family_id IS NULL AND is_active=TRUE',[account_id,req.user.id]);
 const c=await pool.query('SELECT id FROM categories WHERE id=$1 AND type=$2 AND (user_id=$3 OR user_id IS NULL)',[category_id,type,req.user.id]);
 if(!a.rowCount||!c.rowCount)return fail(res,'Account or category unavailable',403);
 const q=await pool.query(`INSERT INTO transactions(user_id,account_id,category_id,type,amount,transaction_date,payment_method,note,scope,created_by) VALUES($1,$2,$3,$4,$5,COALESCE($6::date,CURRENT_DATE),$7,$8,'personal',$1) RETURNING *`,[req.user.id,account_id,category_id,type,amount,transaction_date||null,payment_method,note]);
 res.status(201).json({transaction:q.rows[0]});
}));
router.delete('/:id',wrap(async(req,res)=>{
 if(!uuid.test(req.params.id))return fail(res,'Invalid id');
 const result=await pool.query("DELETE FROM transactions WHERE id=$1 AND user_id=$2 AND scope='personal' RETURNING id",[req.params.id,req.user.id]);
 if(!result.rowCount)return fail(res,'Transaction not found',404);
 res.json({deleted:true,id:result.rows[0].id});
}));
module.exports=router;
