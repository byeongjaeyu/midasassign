{
    let notices = []
    let noticeIdx;
    const noticeTitle = document.getElementById("notice-content-title");
    const noticeDate = document.getElementById("notice-content-date");
    const noticeContent = document.getElementById("notice-content-content");
    const noticeUp = document.getElementById("notice-button-up");
    const noticeDown = document.getElementById("notice-button-down");

    axios.get('http://localhost:6120/api/notice/').then((res)=>{
            notices = res.data;
            setNotices();
        })

    const setNotices = () => {
        if(notices.length !== 0){
            noticeIdx = 0
            let notice = notices[0];
            noticeTitle.textContent = notice.title;
            noticeDate.textContent = notice.registrationDate.split('T')[0];
            noticeContent.textContent = notice.content;
            noticeDown.disabled = true;
        }
    }

    noticeUp.addEventListener("click",()=>{
        if(notices.length !== 0){
            changeNotice(1)
        }
    })

    noticeDown.addEventListener("click",()=>{
        if(notices.length !== 0){
            changeNotice(-1)
        }
    })

    const changeNotice = (k) => {
        noticeIdx += k;

        noticeDown.disabled = (noticeIdx === 0) ? true : false;
        noticeUp.disabled = (noticeIdx === notices.length - 1) ? true : false;

        let newNotice = notices[noticeIdx]
        noticeTitle.innerHTML=newNotice.title;
        noticeDate.innerHTML=newNotice.registrationDate.split('T')[0];
        noticeContent.innerHTML=newNotice.content;
    }

    axios.get('http://localhost:6120/api/intro/').then(res=>{
        let iframediv = document.getElementById("iframe");
        let code = res.data;
        //replace 사용
        code = code.replace('https://youtu.be/','https://www.youtube.com/embed/');
        iframediv.innerHTML=`
        <iframe src=${code} class="home-content-left-youtube"/>
        `
    })

    let newsList = [];

    axios.get('http://localhost:6120/api/article/articles/',{
        params:{
            keyword:'이디야',
            keywordType:'content',
            currentPage:1,
        },
    }).then(res=>{
        newsList = res.data.articles;
        setNews()
    })

    const setNews = () => {
        let newsContainer = document.getElementById("news-content");
        let newsFragment = "";
        newsList = newsList.slice(0,2);
        newsList.forEach(
            function(news){
                newsFragment += `
                    <div class="news-content-news">
                        <span>
                            ${news.title}
                        </span>
                        <span>
                            ${news.registrationDate.split('T')[0].replace(/-/g,'.')}
                        </span>
                    </div>
                `
            }
        );
        newsContainer.innerHTML = newsFragment;
    }
}