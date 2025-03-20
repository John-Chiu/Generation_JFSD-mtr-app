import lines from './mtr_lines.js';

console.log(lines);

function createLinesBtns() {
  const btnContainer = document.getElementById('lines-btn-container');
  for (const lineKey in lines) {
    const lineObj = lines[lineKey];
    let lineEngName = lineObj.text;
    console.log(lineEngName);
    const staArr = lineObj.sta;

    let btn = document.createElement('button');
    btn.innerText = lineEngName;
    // console.log(btn.innerText);
    btn.addEventListener('click', (event) => {
      console.log(`clicked ${lineEngName}`);
      for (const staObj of staArr) {
        let staKey = staObj.code;
        let staName = staObj.name;
        callAPI(lineKey, staKey)
          .then((res) => res.json())
          .then((data) => console.log(`${staName}: `, data));
      }
    });
    btnContainer.append(btn);
  }
}

async function callAPI(line, sta, lang = 'EN') {
  const url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line}&sta=${sta}&lang=${lang}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response;
    // let data = await response.json();
    // console.log('data: ', data);
  } catch (error) {
    console.error(error.message);
  }
}

createLinesBtns();
// callAPI('TML', 'YUL');
