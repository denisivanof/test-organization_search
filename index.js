const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const token = "e82e29cb73df1c2761b0a06e3e99ac3566b260ca";


const addDropdown = (data) => {
    const li = data.map((item)=>`<li class="li" data-type="li" data-id="${item.data.inn}"><div>${item.value}</div><div>${item.data.inn + ' '+ item.data.address.value}</div></li>`)
    return ` <ul>${li.join('')}</ul>`
}

class inputSearch extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `<div class="search" id="search"><input value="" type="text"  class="input" placeholder="Введите">
        <div class="dropdown" id="dropdown"><ul><li></li></ul></div>
</div>`
        this.querySelector('div').addEventListener('input', this.search)
        this.querySelector('div').addEventListener('click', this.select)
    }
    select(e){
        console.log(e.target.parentElement)
    }
    search(){

        let query = this.children[0].value;
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({query: query})
        }

        fetch(url, options)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result).suggestions
                data.length ? this.children[1].innerHTML =  addDropdown(data)
                    : this.children[1].innerHTML = ''
            })
            .catch(error => console.log("error", error));
    }


}

customElements.define("input-search", inputSearch);


