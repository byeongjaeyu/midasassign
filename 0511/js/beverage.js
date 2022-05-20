let drinks = []
let curIdx = 1;
let lastIdx;
let size = 10;
let loading = false;

const container = document.getElementById("drinks-container");
const gotoTop = document.getElementById("gototop");

const modal = document.getElementById("modal");
const modalOuter = document.getElementById("modal-outer");
const modalExit = document.getElementById("modal-exit");
const modalTitleKr = document.getElementById("modal-title-kr");
const modalTitleEn = document.getElementById("modal-title-en");
const modalDescription = document.getElementById("modal-head-description");
const cal = document.getElementById("cal");
const sugar = document.getElementById("sugar");
const protein = document.getElementById("protein");
const fat = document.getElementById("fat");
const na = document.getElementById("na");
const caffeine = document.getElementById("caffeine");
const body = document.querySelector("body");


axios.get('http://localhost:6120/api/drink/list/',{
    params:{
        start:1,
        size:size,
    },
}).then(res=>{
    drinks = drinks.concat(res.data.drink);
    setDrink(0,size-1)
    curIdx = res.data.paging.currentIndex;
    lastIdx = res.data.paging.lastIndex;
})


gotoTop.addEventListener("click",()=>{
    window.scrollTo(0,0);
})

modalExit.addEventListener("click",()=>{
    closeModal()
})

window.addEventListener("scroll",(e)=>{
    if((window.innerHeight + window.scrollY) >= document.body.offsetHeight*0.99) {
        if(curIdx+1>=lastIdx){
            return
        }
        if(loading===false){
            loading = true
            axios.get('http://localhost:6120/api/drink/list/',{
                params:{
                    start:curIdx,
                    size:size,
                },
            }).then(res=>{
                console.log(res.data)
                drinks = drinks.concat(res.data.drink);
                setDrink(curIdx-1,size-1)
                curIdx = res.data.paging.currentIndex;
                lastIdx = res.data.paging.lastIndex;
            })
        }
    }
})

document.addEventListener("click",(e)=>{
    console.log('!')
    if(!modal.classList.contains("block") && e.target.classList.contains("drink")){
        axios.get('http://localhost:6120/api/drink/detail/',{
                params:{
                    sn:Number(e.target.id)+1
                },
            }).then(res=>{
                writeModal(res.data.detail);
            })
    }

    if(modal.classList.contains("block") && !modal.contains(e.target)){
        closeModal();
    }
})


const writeModal = (data) => {
    modalTitleKr.textContent = data.title;
    modalTitleEn.textContent = data.englishTitle;
    modalDescription.textContent = data.description;
    cal.textContent = `(${data.calorie}kcal)`;
    sugar.textContent = `(${data.sugars}g)`;
    protein.textContent = `(${data.protein}g)`;
    fat.textContent = `(${data.saturatedFat}g)`;
    na.textContent = `(${data.natrium}g)`;
    caffeine.textContent = `(${data.caffeine}g)`;
    showModal();
}

const showModal = () => {
    if(!modal.classList.contains("block")){
        modal.className += " block";
        modalOuter.className += " block";
        body.className += "onmodal";
    }
}

const closeModal = () => {
    modal.classList.remove("block");
    modalOuter.classList.remove("block");
    body.classList.remove("onmodal");
}

const setDrink = (idx1,idx2) => {
    console.log(drinks,idx1,idx2);
    for (let i = idx1; i < idx1+idx2+1; i++) {
        if(lastIdx && i === lastIdx)break;
        container.innerHTML += `
            <div class="drink grid-item" id=${i}>
                <img class="drink img" id=${i} src=${drinks[i].imgSrc}>
                <div class="drink drink-title" id=${i}>${drinks[i].title}</div>
            </div>
        `
    }
    loading = false;
}
