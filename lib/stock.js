/*
Stock 조회 모듈
© 2021 Dark Tornado, All rights reserved.
Based on Delta's kaling.js
*/

(function () {
  const cutilsModule = require("./CUtils").CUtils();
  const cutils = new cutilsModule();

  const kalingModule = require("./kaling").Kakao();
  const Kakao = new kalingModule();

  Kakao.init("fce4aa24b3538de6cc18884373242077", "https://open.kakao.com");
  Kakao.login("tutu12151@gmail.com", "desife0507!");

  /* Main */
  function Stock() {}

  Stock.prototype = {};
  Stock.prototype.chart = function (room, item) {
    let stockName;
    if (
      ((doc1 = org.jsoup.Jsoup.connect(
        "https://m.search.naver.com/search.naver"
      )
        .data("query", item)
        .data("where", "m")
        .get()),
      (ID = doc1
        .select("div[class='stock_tlt']>span")
        .text()
        .replace(/[^0-9]/g, "")),
      (stockName = doc1.select("div[class='stock_tlt']>strong").text()),
      "" == ID)
    )
      throw new TypeError("검색 결과가 없습니다.");

    doc = org.jsoup.Jsoup.connect("https://finance.naver.com/item/sise_day.nhn")
      .data("code", ID)
      .get();

    let image =
      "https://fn-chart.dunamu.com/images/kr/candle/d/A" + ID + ".png";

    let price = doc.select("td[class=num]").get(0).text();

    let changeFullStr =
      (doc1.select("span[class=u_hc]").text(),
      doc1.select("span[class=price_gap]").get(0).text().split("("));

    let rate = changeFullStr[1].replace(/ /g, "");

    let cPrice = rate.split("")[0];

    let cStr = "🔺";
    "-" == cPrice && (cStr = "🔻");

    Kakao.send(
      room,
      {
        link_ver: "4.0",
        template_id: 60768,
        template_args: {
          img: image,
          title: "💰💰💰" + stockName + "💰💰💰" + "\n" + price + " KRW",
          description: cStr + changeFullStr[0] + " (" + rate,
        },
      },
      "custom"
    );
  };

  Stock.prototype.google = function (item) {
    let Stock = {
      searchUrl: {
        google: "https://www.google.com/search?hl=ko&q=",
        naver:
          "https://m.search.naver.com/search.naver?where=m&sm=mtb_jum&query=",
      },
    };

    const url = Stock.searchUrl.google + item + "+주가";

    let resultStockItem = cutils
      .removeAllFunction(
        cutils.changeAllBlankToOne(
          cutils.removeAllEnter(
            cutils.removeAllTag(
              Utils.getWebText(url).split("보내주세요</a>.")[1].split("오늘")[0]
            )
          )
        )
      )
      .trim();

    let comment;
    Log.i(resultStockItem);
    if (resultStockItem.includes("공유")) {
      let resultArray = cutils
        .changeAllBlankToOne(
          resultStockItem.replace(
            /(공유|메뉴|닫기|개요|비교|재무|기본|결과|뉴스)/gi,
            ""
          )
        )
        .split(" ");

      let stockName = "[종목명] " + resultArray[0];
      let nation = "🗺 " + resultArray[1].replace(":", "");
      let code = "🥠 " + resultArray[2];
      let unit = resultArray[4];
      let price =
        unit == "USD" ? "💵 " + resultArray[3] : "💰 " + resultArray[3];
      let rate =
        (resultArray[5].includes("+")
          ? "🔺 " + resultArray[5]
          : "🔻 " + resultArray[5]) + resultArray[6];

      comment =
        stockName +
        "\n\n" +
        nation +
        "\n" +
        code +
        "\n" +
        price +
        " " +
        unit +
        "\n" +
        rate;
    } else {
      comment =
        "종목코드로도 조회가 안될 시, 종목명 확인 후 관리자에게 문의해주세요.";
    }

    return comment;
  };

  Stock.prototype.naver = function (item) {
    const naverStockUrl =
      "https://m.search.naver.com/search.naver?where=m&sm=mtb_jum&query=" +
      msg.split("/")[1];
    let stockItemName = msg.split("/")[1].replace("주가", "").trim();
    let stockData = Utils.getWebText(naverStockUrl);

    stockData = stockData.replace(/<[^>]+>/g, "");
    stockData = stockData.split("최신 컨텐츠")[1];
    stockData = stockData.split("기간별 정보")[0];
    stockData = stockData.split("1일")[0];
    stockData = stockData.replace(/(\r\n|\n|\r)/gm, "");

    stockData = stockData.includes("하락")
      ? stockData.replace("전일대비 하락", "🔻")
      : stockData.replace("전일대비 상승", "🔺");

    let stockArray = stockData.split("  ");
    stockArray = stockArray.filter(function (item) {
      return item !== "" && item !== " " && item !== "  ";
    });

    let stockComment =
      "🐨 " +
      "[Koala] Stock Story" +
      " 🐨" +
      "\n" +
      "\n" +
      stockArray[0] +
      "\n" +
      stockArray[1].trim();

    return stockComment;
  };

  /* Legacy Module Compatible */
  Stock.Stock = function () {
    return Stock;
  };

  /* Export */
  module.exports = Stock;
})();
