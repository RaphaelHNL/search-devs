let filtroName = null;

let tabDevs = null;

let allDevs = [];

let countDevs = 0;

let javaChecked = null;
let javaScriptChecked = null;
let pythonChecked = null;

let eChecked = null;
let orChecked = null;


window.addEventListener('load', carregaPag);
window.addEventListener('input', carregaPag);

async function carregaPag() {
  let arrayLanguges = [
    document.querySelector('#java'),
    document.querySelector('#javascript'),
    document.querySelector('#python'),
  ]

  arrayLanguges = arrayLanguges.filter(language => language.checked).map(language => language.value).sort();

  eChecked = document.querySelector('#eChecked').checked;
  orChecked = document.querySelector('#orChecked').checked;

  filtroName = document.querySelector('#nameDev').value;
  tabDevs = document.querySelector('#tabDevs');
  countDevs = document.querySelector('#countDevs');

  await fetchDevs();
  filtraNome(filtroName);
  filterOuE(arrayLanguges)
}



async function fetchDevs() {

  const res = await fetch('./js/dados/devs.json', { method: 'GET', mode: 'cors' });
  const json = await res.json();

  allDevs = json.map(devs => {
    const { name, picture, programmingLanguages } = devs;

    return {
      name,
      picture,
      programmingLanguages
    }

  });


}

function render() {
  renderDevList();
  renderSummary();

}

function renderDevList() {
  let devsHTML = "<div>";

  allDevs.forEach(devs => {
    const { name, picture, programmingLanguages } = devs;
    const language = programmingLanguages.map(devs => {
      if (devs.language === 'Java') {
        return '<img src="./img/java.png">'
      } else if (devs.language === 'JavaScript') {
        return '<img src="./img/javascript.png">'
      } else {
        return '<img src="./img/python.png">'
      }
    })

    const devHTML = `
    <div class="dev col s3">
      <div>
      <img src="${picture}" alt="imagem da(o) ${name}">
      </div>
      <div>
      <ul>
        <li>${name}</li>
        <li class="imgLanguage">${language}</li>
      </ul>
      </div>
    </div>
    
    `;

    devsHTML += devHTML;
  });
  devsHTML += "</div>";

  tabDevs.innerHTML = devsHTML;
}


function renderSummary() {
  countDevs.textContent = allDevs.length;
}



function filtraNome(textoInput) {
  allDevs = allDevs.filter(dev => remover_acentos_espaco(dev.name).toLowerCase().trim().includes(remover_acentos_espaco(textoInput)))
}


function remover_acentos_espaco(str) {
  return str.normalize("NFD").replace(/[^a-zA-Zs]/g, "");
}



function filterOuE(languages) {
  allDevs = allDevs.filter(dev => {
    if (orChecked) {
      return dev.programmingLanguages.some(devLng => languages.includes(devLng.language.toLowerCase()))
    } else {
      return dev.programmingLanguages.sort().map(devLng => devLng.language.toLowerCase()).join("") === languages.join("")
    }
  })
  render();
}
