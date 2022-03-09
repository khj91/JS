async function getItemsFromServer() {
    try {
        const resp = await fetch('http://midaseyeapi.dothome.co.kr/items/read');
        const respText = await resp.text();
        const itemsObj = await JSON.parse(respText);        
        return await itemsObj;
    } catch (error) {
        console.log(error);
    } finally {
        console.log('async completed');
    }
}
async function getItemViewFromServer(ino) {
    try {
        const resp = await fetch('http://midaseyeapi.dothome.co.kr/items/read/'+ino);
        const respText = await resp.text();
        const itemsObj = await JSON.parse(respText);        
        return await itemsObj;
    } catch (error) {
        console.log(error);
    } finally {
        console.log('async completed');
    }
}
async function deleteItemFromServer(ino) {
    try {
        const url = 'http://midaseyeapi.dothome.co.kr/items/delete';
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({id: ino})
        };
        const resp = await fetch(url, config);
        const result = await resp.json();
        return await result;
    } catch (error) {
        console.log(error);
    }
}
function compareToday(day){
    const today = new Date();
    let [date, month, year] = [today.getDate(), today.getMonth()+1, today.getFullYear()];
    let [d_year, d_month, d_day] = (day.substring(0, day.indexOf(' '))).split('-');
    
    if (date == d_day && month == d_month && year == d_year) {
        return day.substring(day.indexOf(' '))
    }else {
        return day.substring(0, day.indexOf(' '));
    }
    // return date == d_day ? month == d_month ? year == d_year : day.substring(day.indexOf(' ')) : day.substring(0, day.indexof(' '));
}

function makeListView(itemsArr) {
    let str ='';
    itemsArr.forEach(elemObj => {
        str += '<div class="col">';
        str += '<div class="card shadow-sm">';
        str += '<div class="card-body">';
        str += `<p class="card-text">${elemObj.name}</p>`;
        str += ' <div class="d-flex justify-content-between align-items-center">';
        str += '<div class="btn-group">';
        str += `<button type="button" data-ino="${elemObj.id}" class="btn btn-sm btn-outline-secondary view">View</button>`;
        str += `<button type="button" data-ino="${elemObj.id}" class="btn btn-sm btn-outline-secondary edit">Edit</button>`;
        str += `<button type="button" data-ino="${elemObj.id}" class="btn btn-sm btn-outline-danger del">Del</button></div>`;
        str += `<small class="text-muted">${compareToday(elemObj.modified)}</small>`;
        str += '</div></div></div></div>';
    });
    document.getElementById('itemListArea').innerHTML = str;
}
// document.addEventListener('DOMContentLoaded',()=>{
document.getElementById('getItemList').addEventListener('click',()=>{
    getItemsFromServer().then((itemsObj) =>{
        console.log(itemsObj);
        makeListView(itemsObj['items']);
    });
});

function makeItemView(itemArr) {
    document.getElementById('itemListArea').innerHTML = '';
    // 구현시작할 지점 : 화면에 한 개의 객체 정보를 출력하는 코드 작성
    // html 코드는 index.html : 138 line 참고
    const itemObj = itemArr[0];
    let str = '<h2 class="pb-2 border-bottom">Item Detail</h2>';
    str += '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">';
    for (let key in itemObj) {
        str += '<div class="col d-flex align-items-start">'
        str += `<div><h4 class="fw-bold mb-0">${key}</h4>`;
        str += `<p>${itemObj[key]}</p></div></div>`;
    }
    str += '</div>';
    document.getElementById('icon-grid').innerHTML = str;
}
document.addEventListener('click',(e)=>{
    if (e.target.classList.contains('view')){
        // console.log(e.target.dataset.ino);
        getItemViewFromServer(e.target.dataset.ino).then((dataObj)=>{
            // console.log(dataObj);
            makeItemView(dataObj.items);
        });
    }
    if (e.target.classList.contains('del')) {
        deleteItemFromServer(e.target.dataset.ino).then(result => {
            alert(result.message);
            document.getElementById('getItemList').click();
        });
    }
    if (e.target.classList.contains('edit')) {
        location.href = 'update.html?'+e.target.dataset.ino;
    }
});

// 1. del 버튼생성
// 2. del 버튼에 data-ino 세팅
// 3. del 버튼이벤트를 설정해서 async 함수 호출
// 4. url = "자신의 닷홈주소/items/delete"
// 5. config는 create 와 동일
// 6. config의 body는 {id: 지울 아이디 번호}를 stringify
// 7. 모두 완료되면 삭제 완료 alert 실행
// 8. index의 list를 출력하는 버튼을 click()으로 이벤트 부여
// 9. 삭제된 아이템이 없는 리스트가 출력되면 성공