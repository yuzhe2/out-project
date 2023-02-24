const express = require('express');
const router = express.Router();
const mysqlInit = require('../utils/mysql');
const moment = require('moment');

/**
  * 数据表字段
  * @param id
  * @param name  名称
  * @param time  时间
  * @param tel  手机号
  * @param content  简介
  * @param addr  地址
  * @param img  头像
 */

//医疗机构表-获取列表
router.post('/getlist', async (req, res) => {  //req请求对象res处理对象
    const body = req.body
    let where = JSON.parse(JSON.stringify(req.body))

    //清除为空的值
    Object.keys(where).forEach(item => {
        if (where[item] == '' || where[item] == null || where[item] == undefined) {
            delete where[item]
        }
    })
    delete where.offset
    delete where.limit

    //模糊查询
    if (where['search']) {
        where['name'] = ['like', '%' + where['search'] + '%']
        delete where['search']
    }

    const data = await mysqlInit.table('admin').where(where).page(body.offset, body.limit).select();
    res.json({ code: 200, data: data });
});


//医疗机构表-获取单个
router.post('/getone', async (req, res) => {
    const body = req.body
    const data = await mysqlInit.table('admin').where({ id: body.id }).find();
    res.json({ code: 200, data: data });
});


//医疗机构表-删除
router.post('/del', async (req, res) => {
    const body = req.body
    const { affectedRows } = await mysqlInit.table('admin').delete({ id: body.id });
    if (affectedRows > 0) {
        res.json({ code: 200, data: [], msg: '成功' });
    } else {
        res.json({ code: 300, data: [], msg: "失败" });
    }
});


//医疗机构表-保存
router.post('/save', async (req, res) => {
    const body = req.body
    let time = new Date()
    let row = 0

    //清除为空的值
    Object.keys(body).forEach(item => {
        if (body[item] == '' || body[item] == null || body[item] == undefined) {
            delete body[item]
        }
    })

    //设置时间
    body.time = moment(time).format('YYYY-MM-DD HH:mm:ss');

    if (body.id) {
        const { affectedRows } = await mysqlInit.table('admin').update(body, { id: body.id });
        row = affectedRows
    } else {
        const { affectedRows } = await mysqlInit.table('admin').add(body);
        row = affectedRows
    }

    if (row > 0) {
        res.json({ code: 200, data: [], msg: '成功' });
    } else {
        res.json({ code: 300, data: [], msg: "失败" });
    }
});



module.exports = router;

