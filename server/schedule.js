const request = require("request-promise-native");
const schedule = require("node-schedule");
const levenshtein = require("node-levenshtein");

const fs = require("fs");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = class Scheduler {
  constructor() {
    this.upbitJob = null;
    this.upbit_prev_title;

    this.coinnessJob = null;
    this.coinness_prev_id = "/news/1010298";
    this.coinness_data;
  }

  uNews_start() {
    if (this.upbitJob == null) {
      console.log(">>>> Start to 'Upbit Schedule' <<<<");
      this.upbitJob = schedule.scheduleJob("*/3 * * * *", async function () {
        console.log("INFO ::: Inquire Upbit Notice");
        let uNewest = await upbit_notice();

        console.log("Previous Upbit Title ====> " + this.upbit_prev_title);
        console.log("Newest Upbit Title ======> " + uNewest.title);

        if (this.upbit_prev_title == undefined)
          this.upbit_prev_title = uNewest.title;

        let uSimilarScore = similarScore(this.upbit_prev_title, uNewest.title);
        console.log("Similar Result ==========> " + uSimilarScore);

        if (uSimilarScore) {
          console.log(uNewest.title);
          let uArgs = {
            img: UPBIT.IMG.TITLE,
            title: uNewest.title,
            description: await upbit_notice_detail(uNewest.id),
            id: uNewest.id,
            view: uNewest.view_count,
          };
          kalingSend(UPBIT.TEMPLATE.ID, uArgs);
          this.upbit_prev_title = uNewest.title;
          return console.log("KakaoTalk Send :: Upbit => " + "SUCCESS");
        }
      });
    } else {
      console.log("ERROR ::::::::::::: Already starting <<<<");
    }
  }

  cNews_start() {
    if (this.coinnessJob == null) {
      console.log(">>>> Start to 'Coinness Schedule' <<<<");
      this.coinnessJob = schedule.scheduleJob("*/2 * * * *", async function () {
        console.log("INFO ::: Inquire Coinness Notice");
        let newestId = await coinness_newest();

        console.log("Previous Coinness URL ======> " + this.coinness_prev_id);
        console.log("Newest Coinness URL ========> " + newestId);
        console.log(
          "Similar Result =============> " + (this.coinness_prev_id == newestId)
        );

        if (this.coinness_prev_id == undefined)
          return (this.coinness_prev_id = newestId);
        if (this.coinness_prev_id != newestId) {
          kalingSend(
            COINNESS.TEMPLATE.ID,
            await coinness_newest_detail(newestId)
          );
          this.coinness_prev_id = newestId;
          return console.log("KakaoTalk Send :: Coinness => " + "SUCCESS");
        }
      });
    } else {
      console.log("ERROR ::::::::::::: Already starting <<<<");
    }
  }

  uNews_stop() {
    if (this.upbitJob == null) return;
    this.upbitJob.cancel();
    this.upbitJob = null;
    console.log(">>>> Stop 'Upbit Schedule' <<<<");
  }

  cNews_stop() {
    if (this.coinnessJob == null) return;
    this.coinnessJob.cancel();
    this.coinnessJob = null;
    console.log(">>>> Stop 'Coinness Schedule' <<<<");
  }

  news_stop() {
    if (this.coinnessJob == null && this.upbitJob == null) return;
    if (this.coinnessJob != null) {
      this.coinnessJob.cancel();
      this.coinnessJob = null;
    }
    if (this.upbitJob != null) {
      this.upbitJob.cancel();
      this.upbitJob = null;
    }
    console.log(">>>> Stop 'Coinness Schedule' <<<<");
  }
};

function similarScore(a, b) {
  return levenshtein.compare(a, b) > 3 ? true : false;
}
const KakaoLink = require("node-kaling");
const kaling = new KakaoLink(
  "bf169f00c4262e561f34f7cc5195fc1c",
  "https://open.kakao.com"
);
kaling.login("tutu12151@gmail.com", "desife0507!");
function kalingSend(template_id, newest) {
  // 카링 전송
  kaling.send(
    "가상화폐 뉴스 공유 Koala",
    // "-coinbot_stock_",
    {
      link_ver: "4.0",
      template_id: template_id,
      template_args: newest,
    },
    "custom"
  );
}

const UPBIT = {
  TITLE: "가장 신뢰받는 디지털 자산 거래소",
  URL: {
    NOTICE:
      "https://api-manager.upbit.com/api/v1/notices?page=1&per_page=1&thread_name=general",
    NOTICE_DETAIL: "https://api-manager.upbit.com/api/v1/notices/",
  },
  IMG: {
    TITLE: "https://static.upbit.com/upbit-pc/seo/upbit_facebook.png",
    PROFILE:
      "https://pbs.twimg.com/profile_images/1113298401938927616/zFiXWHyH.png",
  },
  TEMPLATE: {
    ID: 60768,
  },
};
function upbit_notice() {
  console.log("--> Newest Upbit Notice Checking....");
  return request(UPBIT.URL.NOTICE).then(
    (body) => JSON.parse(body).data.list[0]
  );
}
function upbit_notice_detail(id) {
  console.log("--> Getting Upbit Notice : No." + id);
  return request(UPBIT.URL.NOTICE_DETAIL + id).then((response) =>
    JSON.parse(response).data.body.replace(/\n\r/g, " ")
  );
}

const COINNESS = {
  TITLE: "암호화폐 마켓 정보",
  URL: {
    WEB: "https://kr.coinness.com",
    MOBILE: "https://m.coinness.com/ko-kr",
  },
  IMG: {
    TITLE:
      "https://play-lh.googleusercontent.com/op8mNy9ZVKeXUyMR2gO6gjlRihClKRHRMCqWZpe0hJiX048ENgWP4JtC0y0VSQ6eWQ",
    PROFILE:
      "https://pbs.twimg.com/profile_images/1113298401938927616/zFiXWHyH.png",
  },
  TEMPLATE: {
    ID: 62423,
  },
};
function coinness_newest() {
  console.log("--> Newest Coinness Checking....");
  return got(COINNESS.URL.WEB)
    .then(
      (response) =>
        new JSDOM(response.body).window.document
          .querySelector(".content")
          .querySelector("a").href
    )
    .catch((err) => {
      console.log(err);
    });
}

function coinness_newest_detail(url) {
  console.log("--> Getting Coinness Notice : Url." + url);
  return got(COINNESS.URL.MOBILE + url)
    .then((response) =>
      // new JSDOM(response.body).window.document.querySelector(".news-container")
      new JSDOM(response.body).window.document.querySelector(".container")
    )
    .then((body) => ({
      img: COINNESS.IMG.TITLE,
      title: body.querySelector(".title").textContent,
      description: body.querySelector(".content").textContent,
      id: url.split("/")[2],
    }))
    .catch((err) => {
      console.log(err);
    });
}
