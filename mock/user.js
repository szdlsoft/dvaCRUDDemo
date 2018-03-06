'use strict';

const qs = require('qs');
const mockjs = require('mockjs');  //导入mock.js的模块

const Random = mockjs.Random;  //导入mock.js的随机数

// 数据持久化   保存在global的全局变量中
let db = {};

if (!global.db) {
  const data = mockjs.mock({
    'data|100': [{
      'id|+1': 1,
      'name': () => {
        return Random.cname();
      },
      'mobile': /1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}/,
      'avatar': () => {
        return Random.image('125x125');
      },
      'status|1-2': 1,
      'email': () => {
        return Random.email('visiondk.com');
      },
      'isadmin|0-1': 1,
      'created_at': () => {
        return Random.datetime('yyyy-MM-dd HH:mm:ss');
      },
      'updated_at': () => {
        return Random.datetime('yyyy-MM-dd HH:mm:ss');
      },
    }],
    page: {
      total: 100,
      current: 1,
    },
  });
  db = data;
  global.db = db;
} else {
  db = global.db;
}

module.exports = {
  //post请求  /api/users/ 是拦截的地址   方法内部接受 request response对象
  'GET /api/users' (req, res) {
    //console.log(req);

    const page = qs.parse(req.query);
    const pageSize = page.pageSize || 10;
    const currentPage = page.page || 1;

    let data;
    let newPage;

    let newData = db.data.concat();

    //数据开始模拟
    if (page.field) {
      const d = newData.filter((item) => {
        return item[page.filed].indexOf(page.keyword) > -1;
      });

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      newPage = {
        current: currentPage * 1,
        total: d.length,
      };
    } else {
      data = db.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      db.page.current = currentPage * 1;

      newPage = {
        current: db.page.current,
        total: db.page.total,
      }
    }

    setTimeout(() => {
      res.json({      //将请求json格式返回
        success: true,
        data,
        page: newPage.current,
        total: newPage.total,
      });
    }, 200);
  },

  //很奇怪 post 就是不行！
  'POST /api/users' (req, res) {
    //console.log(req.read());
    //console.log(req);
    //console.log(req.body);

    let user = req.body;
    //console.log(user);
    user.id = mockjs.mock('@id');
    console.log(user);
    db.data.push(user);
    db.page.total += 1; 

    setTimeout(() => {
      res.json({      //将请求json格式返回
        success: true,
      });
    }, 200);
  },

  'PATCH /api/users/*' (req, res) {
    //console.log(req);

    var id = parseInt(req.params[0])//获取修改的id
    let user = req.body;
    console.log(`params id=${id}`);
    console.log(user);    

    var index;
    var data = db.data;
    for(var i in data){
      if(data[i].id===id){//在数组arr里找到这个id
          data[i] = user;
          data[i].id = id;
          console.log(i);
          break;
      }
  }

    //data[index] = user;
    setTimeout(() => {
      res.json({      //将请求json格式返回
        success: true,
      });
    }, 200);

  },

  //reomve
  'DELETE /api/users/*' (req, res) {
    //console.log(req);
    
    var id = parseInt(req.params[0])//获取删除的id
    console.log(`params id=${id}`);

    var index;
    var data = db.data;
    //console.log(db);
    for(var i in data){
        if(data[i].id===id){//在数组arr里找到这个id
            index=i
            break;
        }
    }
    
    console.log(`index=${index}`);
    data.splice(index,1)//把这个id对应的对象从数组里删除
    
    setTimeout(() => {
      res.json({      //将请求json格式返回
        success: true,
      });
    }, 200);
  }, 
  

}