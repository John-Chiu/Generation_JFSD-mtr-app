import lines from './mtr_lines.js';

console.log(lines);

// create buttons for each line. Clicking the button will
// fetch next train data of each station of the line.
function createLinesBtns() {
  const btnContainer = document.getElementById('lines-btn-container');

  for (const lineCode in lines) {
    const lineObj = lines[lineCode];
    let lineEngName = lineObj.text;
    console.log(lineEngName);
    const stationArr = lineObj.sta;

    // button for the line.
    let btn = document.createElement('button');
    btn.innerText = lineEngName;
    // console.log(btn.innerText);

    // onClick listener that fetch all next train data of each station of the line.
    btn.addEventListener('click', (event) => {
      console.log(`clicked ${lineEngName}`);
      for (const stationObj of stationArr) {
        let stationCode = stationObj.code;
        let stationName = stationObj.name;
        callAPI(lineCode, stationCode)
          .then((res) => res.json())
          .then((data) => console.log(`${stationName}: `, data));
      }
    });

    // append button to the button container.
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
