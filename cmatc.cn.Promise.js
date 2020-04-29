'use strict';
const http = require('http');
let
      cookie = 'WWWSESSIONID=FLS6is8Oekd80JBxYTaICziKiRVWuiudOhpfqgnfjoPC76AoKPXk!-620412639; LMSSESSIONID=5rS6itJ18uAqgn3qJutOyLA74VenguVik51vJyBG3xl6oaY6pgeq!-1646619129; SSOSESSIONID=ZGm6itcU7A3jadsb_RjsmDKNPy-1ewpU92Ya6ofeLHZ5ZzjvMD92!1157900886',
      //学习的课程越多越好
      lesson = {
            '111116': {
                  '111122': '7e151f82-d466-4e4b-8ddf-ca8e22c7a766',
                  '111116': '4e0ccbce-89a5-4bfa-bf7d-c79b89214bfb',
                  '111130': '6810b63f-1860-406a-abdc-d5181e8e10c0',
                  '111131': '86c61185-eb8f-4957-8dc8-54fe9b9e8bda',
            },
            '115527': {
                  '116186': 'f175a95e-e2ed-4c82-9eee-e51f85202f2f',
            },
            '51424': {
                  '51424': '3512nq001',
            },
            '112418': {
                  '91200': '3515nq01',
                  '91201': '3515nq02',
                  '91033': '3515nq03',
                  '91034': '3515nq04',
                  '91035': '3515nq05',
                  '91036': '3515nq06',
                  '91037': '3515nq07',
            },
            '113016': {
                  '113466': 'a4f4f2b2-ed83-4a61-a12d-a76cd97db8c8',
            },
            '27630': {
                  '27630': '3508tqx001',
            },
            '99440': {
                  '99440': '3515ry001',
            },
      },
      options = {
            hostname: 'www.cmatc.cn',
            port: 80,
            method: 'GET',
            headers: { 'Cookie': cookie },
            timeout: 5000
      };

//开始课程学习，服务器开始记录时间，只执行一次。
(async () => {
      for (let n in lesson) {
            for (let i in lesson[n]) {
                  options.path = '/lms/app/lms/student/Learn/enterUrl.do?lessonId=' + n + '&coursewareId=' + i + '&coursewareGkey=' + lesson[n][i];
                  try {
                        await syncreq('GET', options, '', lesson[n][i]);
                  } catch (e) {
                        console.log(e.message)
                  }
            }
      }
})();


//1分钟后，开始循环
setInterval(async () => {
      //先结束学习，服务器结束记录时间。
      for (let n in lesson) {
            for (let i in lesson[n]) {
                  let postData = 'lessonId=' + n + '&tclessonId=&coursewareId=' + i + '&coursewareGkey=' + lesson[n][i] + '&lessonOrigin=selflearn&standard=&isPreview=false&exitplaytime=0';
                  options.path = '/lms/app/lms/student/Learn/exit.do';
                  options.method = 'POST';
                  options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                  options.headers['Content-Length'] = postData.length;
                  try {
                        await syncreq('POST', options, postData, lesson[n][i]);
                  } catch (e) {
                        console.log(e.message)
                  }

            };
      }
      console.log('END LOOP');
      //再开始学习，服务器开始记录时间
      for (let n in lesson) {
            for (let i in lesson[n]) {
                  options.path = '/lms/app/lms/student/Learn/enterUrl.do?lessonId=' + n + '&coursewareId=' + i + '&coursewareGkey=' + lesson[n][i];
                  options.method = 'GET';
                  delete options.headers['Content-Type'];
                  delete options.headers['Content-Length'];
                  try {
                        await syncreq('GET', options, '', lesson[n][i]);
                  } catch (e) {
                        console.log(e.message)
                  }
            }
      }
}, 60000);

//同步请求函数
function syncreq(kind, options, postData, lname) {
      return new Promise((resolve, reject) => {
            let req = http.request(options, res => {
                  let time = (new Date).toLocaleString() + ' -->';
                  res.on('data', chunk => { });
                  res.on('end', () => {
                        if (res.statusCode === 200) {
                              if (kind === 'POST') {
                                    console.log(time, 'END  ', lname);
                              } else {
                                    console.log(time, 'START', lname);
                              }
                              //正常结束
                              resolve();
                        } else {
                              //抛出异常
                              reject(new Error(time + ' ERROR ' + lname + ' ' + res.statusCode + ' ' + res.statusMessage));
                        }
                  });
            });
            req.on('error', (err) => {
                  reject(err);
            });
            if (kind === 'POST') {
                  req.write(postData);
            }
            req.end();
      });
}
