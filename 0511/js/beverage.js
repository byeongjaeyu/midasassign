{
    let currentIndex = 1;
    let lastIndex;
    let size = 10;
    let loading = true

    const container = document.getElementById("drinks-container");
    const gotoTop = document.getElementById("gototop");

    const modal = document.getElementById("modal");
    //modal켜졌을 시, 전체를 감싸는 요소(잡플렉스 참조)
    const modalOuter = document.getElementById("modal-outer");
    const modalExit = document.getElementById("modal-exit");
    const modalTitleKr = document.getElementById("modal-title-kr");
    const modalTitleEn = document.getElementById("modal-title-en");
    const modalDescription = document.getElementById("modal-head-description");
    const cal = document.getElementById("cal");
    const sugar = document.getElementById("sugar");
    const prot = document.getElementById("protein");
    const fat = document.getElementById("fat");
    const na = document.getElementById("na");
    const caff = document.getElementById("caffeine");
    const body = document.querySelector("body");
    //load시 전체를 감싸는 요소
    const loadOuter = document.getElementById("onload-outer");

    let drinkElement;

    //modal, scroll-request시 loading추가
    const showLoading = () => {
        loadOuter.className += " block";
        body.className + " onload";
    }

    const closeLoading = () => {
        loadOuter.classList.remove("block");
        body.classList.remove("onload");
    }

    const showModal = () => {
        if(!modal.classList.contains("block")){
            modal.className += " block";
            modalOuter.className += " block";
            body.className += "onmodal";
            closeLoading();
        }
    }

    const closeModal = () => {
        modal.classList.remove("block");
        modalOuter.classList.remove("block");
        body.classList.remove("onmodal");
    }

    showLoading();
    axios.get('http://localhost:6120/api/drink/list/',{
        params:{
            start:1,
            size:size,
        },
    }).then(res=>{
        console.log('초기로딩');
        loading = false;
        setDrink(res.data.drink);
        currentIndex = res.data.paging.currentIndex;
        lastIndex = res.data.paging.lastIndex;
    })


    gotoTop.addEventListener("click",()=>{
        window.scrollTo(0,0);
    })

    modalExit.addEventListener("click",()=>{
        closeModal()
    })

    document.addEventListener("scroll",()=>{
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight*0.99) {
            if(currentIndex+1>=lastIndex){
                return
            }
            if(loading===false){
                loading = true
                showLoading();
                console.log(currentIndex);
                axios.get('http://localhost:6120/api/drink/list/',{
                    params:{
                        start:currentIndex,
                        size:size,
                    },
                }).then(res=>{
                    setDrink(res.data.drink)
                    currentIndex = res.data.paging.currentIndex;
                    lastIndex = res.data.paging.lastIndex;
                })
            }
        }
    })

    // document.addEventListener("click",(e)=>{
    //     if(!modal.classList.contains("block") && e.target.classList.contains("drink")){
    //         showLoading();
    //         axios.get('http://localhost:6120/api/drink/detail/',{
    //                 params:{
    //                     sn:Number(e.target.id),
    //                 },
    //             }).then(res=>{
    //                 console.log(res.data.detail);
    //                 writeModal(res.data.detail);
    //             })
    //     }

    //     if(modal.classList.contains("block") && !modal.contains(e.target)){
    //         closeModal();
    //     }
    // })


    const writeModal = ({title, englishTitle, description, calorie, sugars, protein, saturatedFat, natrium, caffeine}) => {
        modalTitleKr.textContent = title;
        modalTitleEn.textContent = englishTitle;
        modalDescription.textContent = description;
        cal.textContent = `(${calorie}kcal)`;
        sugar.textContent = `(${sugars}g)`;
        prot.textContent = `(${protein}g)`;
        fat.textContent = `(${saturatedFat}g)`;
        na.textContent = `(${natrium}mg)`;
        caff.textContent = `(${caffeine}mg)`;
        showModal();
    }



    const setDrink = (drinks) => {
        let drinksFragment = new DocumentFragment();
        //documentFragment 사용
        //innerHTML사용 안한 이유, 이벤트가 사라지더라고요 새로 다 만드나봐요
        //return값 없으므로 foreach사용.
        drinks.forEach(
            function(drink){
                let gridItem = document.createElement("div");
                gridItem.className="drink grid-item";
                gridItem.id=`${currentIndex}`;
                let drinkImg = new Image();
                drinkImg.className="drink img";
                drinkImg.id = `${currentIndex}`;
                drinkImg.src = `${drink.imgSrc}`;
                let drinkTitle = document.createElement("div");
                drinkTitle.className="drink drink-title";
                drinkTitle.id=`${currentIndex}`;
                drinkTitle.innerHTML=`${drink.title}`;
                gridItem.appendChild(drinkImg);
                gridItem.appendChild(drinkTitle);
                drinksFragment.appendChild(gridItem);
                currentIndex += 1;
            }
        )
        container.appendChild(drinksFragment);
        //dom접근 최소화
        setEvent(drinks.length)
        closeLoading();
        loading = false;
    }

    const setEvent = (size) => {
        for (let id = currentIndex - 1; id !== currentIndex - 1 - size; id--){
            drinkElement = document.getElementById(id);
            drinkElement.addEventListener("click",()=>{
                console.log(id);
                showLoading();
                axios.get('http://localhost:6120/api/drink/detail/',{
                        params:{
                            sn:Number(id),
                        },
                    }).then(res=>{
                        console.log(res.data)
                        writeModal(res.data.detail);
                    })
            })
            
        }
    }


}
