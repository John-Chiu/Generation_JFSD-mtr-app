import lines from "./mtr_lines.js";

const LINE_UP = "line-up";
const LINE_DOWN = "line-down";

// console.log(lines);

// create buttons for each line. Clicking the button will
// fetch next train data of each station of the line.
function createLinesBtns() {
  const btnContainer = document.getElementById("lines-btn-container");

  for (const lineCode in lines) {
    const lineObj = lines[lineCode];
    let lineChineseName = lineObj.text;
    const stationArr = lineObj.sta;

    // button for the line.
    let btn = document.createElement("button");
    btn.innerText = lineChineseName;
    // console.log(btn.innerText);

    // onClick listener that fetch all next train data of each station of the line.
    btn.addEventListener("click", (event) => {
      let lineUp = document.getElementById(LINE_UP);
      let lineDown = document.getElementById(LINE_DOWN);

      // clear all cards in lines
      lineUp.replaceChildren();
      lineDown.replaceChildren();

      // create all card
      createCardsForLine(lineUp, stationArr);
      createCardsForLine(lineDown, stationArr);

      // stationArr.forEach((stationObj) => {
      //   let temp = document.createElement('div');
      //   temp.classList.add('station-card');

      //   let title = document.createElement('h4');
      //   title.classList.add('station-name');
      //   title.innerText = stationObj.name;

      //   let nextTrain = document.createElement('p');
      //   nextTrain.innerText = '下班列車:';

      //   let platform = document.createElement('p');
      //   platform.innerText = '開出月台:';

      //   temp.appendChild(title);
      //   temp.appendChild(nextTrain);
      //   temp.appendChild(platform);
      //   lineUp.append(temp);
      // });

      // time to delay to fetch in order to avoid 429 Too Many Request
      let delayInMs = 0;
      // get next train ETA of all stations in that line
      for (const stationObj of stationArr) {
        let stationCode = stationObj.code;
        let stationName = stationObj.name;

        setTimeout(() => {
          callAPI(lineCode, stationCode)
            .then((res) => res.json())
            .then((data) => {
              console.log(`${stationName}: `, data);
              if (data.status === 1)
                putDataIntoCorrectPlace(data, lineCode, stationCode);
            })
            .catch((err) => {
              console.log(err.message);
            });
        }, delayInMs);
        // even delay 2000 ms, there still is a change to get 429 Too Many Request,
        // 300ms would be great for better UX and avoding 429.
        delayInMs += 300;
      }
    });

    // append button to the button container.
    btnContainer.append(btn);
  }
}

function putDataIntoCorrectPlace(data, lineCode, stationCode) {
  // console.log(`putDataIntoCorrectPlace:`, data);

  let objNameInData = `${lineCode}-${stationCode}`;
  let upArr = data.data[objNameInData].UP;
  // console.log('upArr: ', upArr);
  let downArr = data.data[objNameInData].DOWN;
  // console.log('downArr: ', downArr);

  // upArr.forEach((elem) => {
  //   helper(elem, LINE_UP, stationCode);
  // let divId = `${LINE_UP}-${stationCode}`;
  // let div = document.querySelector(`#${divId}`);
  // console.log(`nextTrain: `, div);

  // let nextTrain = div.childNodes[1];
  // nextTrain.textContent += elem.time.split(' ')[1];

  // let plateform = div.childNodes[2];
  // plateform.textContent += elem.plat;
  // });

  helper(upArr, LINE_UP, stationCode);

  // downArr.forEach((elem) => {
  //   helper(elem, LINE_DOWN, stationCode);
  // });
  helper(downArr, LINE_DOWN, stationCode);

  function helper(arr, line, stationCode) {
    let divId = `${line}-${stationCode}`;
    let div = document.querySelector(`#${divId}`);
    if (!arr || !arr.length) {
      div.style.visibility = "hidden";
      return;
    }
    let elem = arr[0];

    // console.log(`nextTrain: `, div);

    let nextTrain = div.childNodes[1];
    nextTrain.textContent += elem.time.split(" ")[1];

    let plateform = div.childNodes[2];
    plateform.textContent += elem.plat;
  }
}

function createCardsForLine(lineNode, stationArr) {
  stationArr.forEach((stationObj, idx) => {
    let card = document.createElement("div");
    // console.log('lineNode.id:', lineNode.id);
    card.id = `${lineNode.id}-${stationObj.code}`;
    // console.log(`card.id: ${card.id}`);

    // card.id = `$`;
    card.classList.add("station-card");

    let title = document.createElement("h4");
    title.classList.add("station-name");
    title.innerText = stationObj.name;

    let nextTrain = document.createElement("p");
    nextTrain.innerText = "下班列車:";

    let platform = document.createElement("p");
    platform.innerText = "開出月台:";

    card.appendChild(title);
    card.appendChild(nextTrain);
    card.appendChild(platform);
    lineNode.append(card);
  });
}

async function callAPI(line, sta, lang = "EN") {
  const url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line}&sta=${sta}&lang=${lang}`;
  console.log("fetching API", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response;
    // let data = await response.json();
    // console.log('data: ', data);
  } catch (error) {
    console.log(error.message);
  }
}

createLinesBtns();
// callAPI('TML', 'YUL');
