'use strict'

const
      inquirer = require('inquirer'),
      request = require('sync-request'),
      fs = require('fs'),

      u1 = 'https://www.zhifa315.com/index.php/common/authimg',
      u2 = 'https://www.zhifa315.com/index.php/ucenter/login_ex/validate',
      u3 = 'https://www.zhifa315.com/index.php/ucenter/course',
      u4 = 'https://www.zhifa315.com/index.php/site/study/update_time_new/';

var uid, pwd, veri, session, hashtemp, course, lesson;

var res = request('GET', u1);
session = res.headers['set-cookie'][0].substring(0, 37);
fs.writeFileSync('c:/authimg.png', res.body);


const { spawn } = require('child_process');
const bat = spawn('cmd.exe', ['/c', 'c:/authimg.png']);

inquirer.prompt([
      {
            type: 'input',
            name: 'veri',
            message: '请输入验证码：',
      },
      {
            type: 'input',
            name: 'uid',
            message: '请输入身份证号：',
      },
      {
            type: 'input',
            name: 'pwd',
            message: '请输入密码：',
      }
]).then(function (input) {
      [uid, pwd, veri] = [input.uid.trim(), input.pwd.trim(), input.veri.trim()];

      res = request('POST', u2, {
            'headers': {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Cookie': session,
            },
            'body': 'login_type=4&username=' + uid + '&password=' + pwd + '&auth_code=' + veri + '&url=-1&remember_me=0&a_id=872'
      });


      var r = JSON.parse(res.getBody('utf8'));
      if (r.msg === 'succ') {
            hashtemp = res.headers['set-cookie'][0].substring(0, 42);

            res = request('GET', u3, {
                  'headers': {
                        'Cookie': session + hashtemp,
                  }
            });
            var str = res.getBody().toString();
            var reg = new RegExp('<a href="/index.php/site/study/view/([^"]*)" target="_blank">', 'gi');
            var result;
            course = new Array();
            while ((result = reg.exec(str)) != null) {
                  course.push('https://www.zhifa315.com/index.php/site/study/view/' + result[1]);
            }

            for (let i = 0; i < course.length; i++) {
                  res = request('GET', course[i], {
                        'headers': {
                              'Cookie': session,
                        }
                  });
                  if (res.statusCode == 200) {
                        var str = res.getBody().toString();
                        //从HTML中截取课程目录
                        var str1 = str.substring(str.indexOf('<ul class="exinfo_list">'), str.indexOf('<!-- QuestionDialog -->'));

                        var reg = new RegExp('<a href="/index.php/site/study/view/1381/([^"]*)">', 'gi');
                        var result;
                        lesson = new Array();
                        while ((result = reg.exec(str1)) != null) {
                              lesson.push(result[1].slice(4, 8));
                        }
                        //从HTML中截取用户信息
                        var reg = new RegExp('<input type="hidden" id="c_id" value="([^"]*)"/>', 'gi');
                        var c_id = reg.exec(str)[1];
                        var reg = new RegExp('<input type="hidden" id="ec_id" value="([^"]*)"/>', 'gi');
                        var ec_id = reg.exec(str)[1];
                        var reg = new RegExp('<input type="hidden" id="u_id" value="([^"]*)"/>', 'gi');
                        var u_id = reg.exec(str)[1];
                        var reg = new RegExp('timestamp:"([^"]*)"', 'gi');
                        var timestamp = reg.exec(str)[1];

                        for (let i = 0; i < lesson.length; i++) {
                              var a = true, b = 0;;
                              while (a) {
                                    //循环发包，让服务器累加时间
                                    res = request('POST', u4 + u_id, {
                                          'headers': {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Cookie': session,
                                          },
                                          'body': 'material_id=' + lesson[i] + '&c_id=' + c_id + '&timestamp=' + timestamp + '&playtime=70&ec_id=' + ec_id + '&time_start=70&source=0&ec_exam_flag=1&ec_exam_min_times=94800&ec_course_time_flag=1&cs_pass_cur=0&cs_pass=0&cs_pass1=0&cs_pass2=0&cs_id=0'
                                    });

                                    if (res.statusCode == 200) {
                                          r = JSON.parse(res.getBody('utf8'));
                                          if (r.msg === 'succ') {
                                                //判断是否到分课件合计时间
                                                if (b == r.total_time) {
                                                      a = false;
                                                      console.log(lesson[i] + '已学完');
                                                } else {
                                                      b = r.total_time;
                                                }
                                          } else {
                                                continue;
                                          }
                                    } else {
                                          continue;
                                    }
                              }
                        }
                        console.log(course[i] + '完成');
                  } else {
                        console.log(course[i] + '失败，错误码：' + res.statusCode);
                        continue;
                  };
            };

      } else {
            console.log('登录失败，请检查验证码、用户名、密码');
      };
});
