const selectBox = document.getElementById("select_box");
const selectMode = document.getElementById("select_mode");
const selectBtn = document.getElementById("select_btn");
const selectDropdown = document.getElementById("select_dropdown");
let mode = 'title';
let currentPage = 1;
let currentKeyword = "이디야";
let lastPage = 1;
let pageSize = 1;
const mode1Btn = document.getElementById("mode1");
const mode2Btn = document.getElementById("mode2");
const searchInput = document.getElementById("search_input");
const searchIcon = document.getElementById("search_icon");
const pageJumpup = document.getElementById("page_arrow_up");
const pageJumpdown = document.getElementById("page_arrow_down");
const newsContainerBody = document.getElementById("news_container_body");
const noData = document.getElementById("no_data");

selectBox.addEventListener("click",()=>{
    show()
})

document.addEventListener("click",(e)=>{
    if(selectDropdown.classList.contains("block") && !e.target.id.includes("select")){
        show()
    }
})

mode1Btn.addEventListener("click",()=>{
    mode = 'title';
    selectMode.innerHTML = "제목"
    show()
})

mode2Btn.addEventListener("click",()=>{
    mode = 'content';
    selectMode.innerHTML = "내용"
    show()
})

searchIcon.addEventListener("click",()=>{
    if(searchInput.value!==""){
        search()
    }
})
searchInput.addEventListener("keydown",(e)=>{
    if(e.keyCode===13){
        search(searchInput.value);
    }
})

const show = () => {
    let classList = selectDropdown.classList;
    if(classList.contains("block")){
        selectDropdown.classList.remove("block");
    }else{
        selectDropdown.className += " block";
    }
}

const search = () => {
    let keyword = searchInput.value;
    currentPage = 1;
    if(!keyword){
        keyword = '이디야';
    }
    axios.get('http://localhost:6120/api/article/articles/',{
        params:{
            keyword:keyword,
            keywordType:mode,
            currentPage:1,
        },
    },).then((res)=>{
        console.log(res.data)
        if(res.data.articles.length === 0){
            setError(true);
        }else{
            setError(false);
            lastPage = res.data.paging.lastPage;
            pageSize = res.data.paging.blockSize;
            currentKeyword = keyword
            jumpVisible(1);
            setNews(res.data.articles)
            setPage(res.data.paging)
        }
    })
}

const setError = (value) => {
    if(value){
        newsContainerBody.innerHTML="";
        noData.className += " block";
        setPage({
            blockSize:1,
            currentPage:"1",
            lastPage:1
        });
    }else{
        noData.classList.remove("block");
    }
}

const loadPage = (page) => {
    currentPage = page;
    jumpVisible(page);
    axios.get('http://localhost:6120/api/article/articles/',{
        params:{
            keyword:currentKeyword,
            keywordType:mode,
            currentPage:page,
        },
    },).then((res)=>{
        setNews(res.data.articles)
        setPage(res.data.paging)
    })
}

const jumpVisible = (page) => {
    pageJumpdown.disabled = page - pageSize <= 0
    pageJumpup.disabled = parseInt((page-1)/pageSize) === parseInt((lastPage-1)/pageSize);
}

const setNews = (newsList) => {
    newsContainerBody.innerHTML="";
    newsList.forEach(
        function(news){
            newsContainerBody.innerHTML += `
            <tr>
                <th class="news_order">${news.sn}</th>
                <th class="news_contents">
                    <img src=${news.imgSrc} alt="No Image" height="100%" width="auto"/>
                    <div>
                        <div class="news_title">${news.title}</div>
                        <div class="news_content">${news.content}</div>
                    </div>
                </th>
                <th class="news_date">${news.registrationDate.split('T')[0].replace(/-/g,'.')}</th>
            </tr>
            `;
        }
    )
}

const setPage = (paging) => {
    let pagesDiv = document.getElementById("pages");
    let pageFragment = new DocumentFragment()
    let pageStart = parseInt(Number(paging.currentPage-1)/(paging.blockSize)) * (paging.blockSize) + 1;
    pagesDiv.innerHTML="";
    for (let i = pageStart; i < paging.blockSize+pageStart; i++) {
        if(i>paging.lastPage){
            break;
        }
        let page = document.createElement("span");
        page.className=`pagenode`;
        if(i === currentPage){
            //여기해야함.
            page.style.fontWeight = '700';
            page.style.color = '#24388D'
            console.log(i,'now!!');
        }
        page.addEventListener("click",()=>{
            loadPage(i);
        })
        page.innerHTML=i;
        pageFragment.appendChild(page);
    }
    pagesDiv.appendChild(pageFragment);
}

pageJumpup.addEventListener("click",()=>{
    let nextPage = parseInt((currentPage+pageSize-1)/(pageSize)) * (pageSize) + 1;
    if(nextPage <= lastPage){
        loadPage(nextPage);
    }
})
pageJumpdown.addEventListener("click",()=>{
    let nextPage = parseInt((currentPage-pageSize-1)/(pageSize)) * (pageSize) + pageSize;
    console.log(nextPage)
    if(nextPage>=pageSize){
        loadPage(nextPage);
    }
})

//초기 검색 함수
search();

//대체폰트 설정