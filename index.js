class inputSearch extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `<div class="search" id="search"></div>`
        this.el = this.querySelector('div')
        this.render()
        this.el.addEventListener('input', this.search)
        this.el.addEventListener('click', this.select)
    }
    render(){
        this.el.innerHTML = `<input value="" type="text"  class="input filedInput" id="input" placeholder="Введите">
         <div class="dropdown open" id="dropdown"></div>
         <div class="filedInput"><span>Краткое наименование</span><input value="" type="text"  class="input" placeholder="Краткое наименование"  id="shortName"></div>
         <div class="filedInput"><span>Полное наименование</span><input value="" type="text"  class="input" placeholder="Полное наименование"  id="fullName"></div>
         <div class="filedInput"><span>ИНН / КПП</span><input value="" type="text"  class="input" placeholder="INN / КПП"  id="inn"></div>
         <div class="filedInput"><span>Адрес</span><input value="" type="text"  class="input" placeholder="Адрес"  id="address"></div>
`
    }
    dataSearch = []

    select(e){
        if(e.target.parentElement.dataset.type == 'li'){
            let input = document.getElementById('input')
            let inn = document.getElementById('inn')
            let shortName = document.getElementById('shortName')
            let fullName = document.getElementById('fullName')
            let address = document.getElementById('address')

            let item = this.dataSearch.filter((item)=> item.data.inn === e.target.parentElement.dataset.id)[0]

            inn.value = item.data.inn + " / "+ item.data.kpp
            input.value = item.value
            shortName.value = item.data.name.short_with_opf
            fullName.value = item.data.name.full_with_opf
            address.value = item.data.address.value

            document.getElementById('dropdown').classList.remove('open')
        }
    }
    search(){
        const input = document.getElementById('input')
        const dropdown = document.getElementById('dropdown')
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        const token = "e82e29cb73df1c2761b0a06e3e99ac3566b260ca";

        const query = input.value;
        const add = (data)=>{
            const li = data.map((item)=>`<li class="li" data-type="li" data-id="${item.data.inn}"><div>${item.value}</div><div class="list">${item.data.inn + ' '+ item.data.address.value}</div></li>`)
            return ` <ul>${li.join('')}</ul>`
        }
        if(query){
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
                    this.dataSearch = data
                    dropdown.classList.add('open')
                    data.length ? dropdown.innerHTML =  add(data)
                        : dropdown.innerHTML = '<ul><li class="li">Нет информации</li></ul>'
                })
                .catch(error => console.log("error", error));
        } else {
            dropdown.classList.remove('open')

           let inAll = this.querySelectorAll('input')
            inAll.forEach((item)=>{
                item.value = ''
            })
        }
    }
}

customElements.define("input-search", inputSearch);


