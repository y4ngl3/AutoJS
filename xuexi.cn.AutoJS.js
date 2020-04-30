//软件版本：Auto.Js v4.1.1  学习强国APP v2.11.1
//学习强国手机自动点击脚本，自动学习30分 
//仅限安卓手机，需设置无障碍服务程序为Auto.js并开启。
//使用稳定流畅的wifi，学习强国添加 “时评” 和 “山东” 频道（原因是时评每日更新最频繁，默认就有）

//点亮屏幕
device.wakeUp();
sleep(2000);
//启动强国，脚本中depth、drawingOrder这些魔数随着版本更新可能需要更改
app.launch('cn.xuexi.android');
sleep(5000);
//先收听广播
desc('电台').findOne().click();
sleep(2000);
text('听新闻广播').findOne().parent().click();
sleep(2000);
text('中国之声').findOne().parent().click();
sleep(2000);
//开始点击学习-时评栏目下的文章
desc("学习").findOne().click();
sleep(2000);
text("时评").findOne().parent().click();
sleep(2000);
//获取文章列表，一般length=7
var articles = id("general_card_title_id").depth(5).find();
if (!articles.empty()) {
    //循环阅读文章
    for (var i = 0; i < articles.length; i++) {
        //点击某一篇文章
        if (articles[i] === null)
            continue;
        articles[i].click();
        //文章学习时长
        sleep(1000 * 120);
        if (i < 0) {
            //获取评论框、收藏框、转发框
            var pl, sc, zf;
            pl = className("android.widget.TextView").depth(2).drawingOrder(7).findOne();
            sc = className("android.widget.ImageView").depth(2).drawingOrder(9).findOne();
            zf = className("android.widget.ImageView").depth(2).drawingOrder(10).findOne();
            //收藏和取消收藏操作
            sc.click();
            sleep(2000);
            sc.click();
            sleep(2000);
            //评论操作
            pl.click();
            sleep(2000);
            className("android.widget.EditText").findOne().setText('学习贯彻社会主义核心价值观');
            sleep(2000);
            text('发布').findOne().click();
            sleep(2000);
            //转发操作
            zf.click();
            sleep(2000);
            //手机没有微信的话还得修改这里
            text('分享给微信\n好友').depth(5).findOne().parent().click();
            sleep(5000);
            id('dm').findOne().click();
            sleep(2000);
        }
        //返回文章列表
        //className("android.widget.ImageView").depth(2).drawingOrder(3).findOne().click();
        back();
        //强制最多读11篇
        if (i > 10) break;
    }
}
sleep(2000);
//点击本地频道
text("山东").depth(3).findOne().parent().click();
sleep(2000);
text('山东学习平台').depth(7).findOne().parent().click();
sleep(2000);
//返回学习页面
//className("android.widget.ImageView").depth(3).drawingOrder(21).findOne().click();
back();
sleep(2000);
///开始点击电视台-联播频道栏目下的视频
desc('电视台').findOne().click();
sleep(2000);
text('联播频道').findOne().parent().click();
sleep(2000);
//获取视频列表，一般length=6
var videos = text('中央广播电视总台').find();
//循环看视频
for (var i = 0; i < videos.length; i++) {
    //点击某一篇视频
    if (videos[i].parent() == null)
        continue;
    videos[i].parent().click();
    //视频学习时长
    sleep(1000 * 180);
    //最后一篇视频总是点不到，为啥？
    //点击返回框
    //className("android.widget.ImageView").depth(3).drawingOrder(4).findOnce().click();
    back();
    sleep(2000);
    //强制最多看11个
    if (i > 10) break;
}
//结束，回到首页
desc("学习").findOne().click();
sleep(2000);
home();
exit();
