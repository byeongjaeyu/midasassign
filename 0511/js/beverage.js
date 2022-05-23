{
    let currentIndex = 1;
    let lastIndex;
    let size = 10;
    let loading = true

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
    const loadOuter = document.getElementById("onload-outer");

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

    window.addEventListener("scroll",()=>{
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
                    console.log('스크롤로딩');
                    setDrink(res.data.drink)
                    currentIndex = res.data.paging.currentIndex;
                    lastIndex = res.data.paging.lastIndex;
                })
            }
        }
    })

    document.addEventListener("click",(e)=>{
        if(!modal.classList.contains("block") && e.target.classList.contains("drink")){
            showLoading();
            axios.get('http://localhost:6120/api/drink/detail/',{
                    params:{
                        sn:Number(e.target.id),
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
        na.textContent = `(${data.natrium}mg)`;
        caffeine.textContent = `(${data.caffeine}mg)`;
        showModal();
    }



    const setDrink = (drinks) => {
        let drinksHtml = ''
        drinks.forEach(
            function(drink){
                drinksHtml += `
                    <div class="drink grid-item" id=${currentIndex}>
                        <img class="drink img" id=${currentIndex} src=${drink.imgSrc}>
                        <div class="drink drink-title" id=${currentIndex}>${drink.title}</div>
                    </div>
                `;
                currentIndex += 1;
            }
        )
        container.innerHTML += drinksHtml;
        closeLoading();
        loading = false;
    }

    // const setEvent = () => {
    //     console.log(document.querySelectorAll(".grid-item"));
    // }


}
