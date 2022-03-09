async function registerItemToServer(itemObj){
    try {
        const url = 'http://midaseyeapi.dothome.co.kr/items/create';
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(itemObj) // {id: 10}
        }
        const resp = await fetch(url, config);
        const result = await resp.json();
        return await result;
    } catch (error) {
        console.log(error);
    }
}

document.querySelector('button.w-100').addEventListener('click', (e)=>{
    e.preventDefault();
    const inputs = document.querySelectorAll('.needs-validation input');
    
    let itemObj = {
        // name: '아이폰',
        // price: 1000,
        // description: 'dlsfjlasd'
    };

    inputs.forEach(elem => {
        itemObj[elem.id] = elem.value;
    });
    
    // let categoryId = document.getElementById('category_id');
    // let selectedValue = categoryId.options[categoryId.options.selectedIndex].value;
    // console.log(selectedValue);
    
    itemObj.category_id = document.querySelector('#category_id option:checked').value;

    const now = new Date();
    let createdNow = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    itemObj.created = createdNow;

    registerItemToServer(itemObj).then(result => {
        // console.log(result);
        alert(result.message);
        location.replace('index.html');
    });
});