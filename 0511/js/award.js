{
    // 한번 누르면 나오게 수정.

    const json = {
        data : [
            {
                date : '2019.11',
                content : {
                    "title" : "고용 노동부 주관, 일·생활 균형 우수 기업 선정",
                    "filepath" : "https://www.ediya.com/files/award/IMG_1580975213558.jpg",
                    "description" : "워라벨 우수 기업이 됐습니다.",
                    "date" : "11"
                }
            },
            {
                date : '2019.10',
                content : {
                    "title" : "커피 산업 공로상 농림축산식품부 장관상 수상",
                    "filepath" : "https://www.ediya.com/files/award/IMG_1580975213558.jpg",
                    "description" : "상을 탔습니다.",
                    "date" : "10"
                }
            },
            {
                date : '2019.06',
                content : {
                    "title" : "이디야커피 대한민국 창업대상 국무총리상 수상",
                    "filepath" : "https://www.ediya.com/files/award/IMG_1580975213558.jpg",
                    "description" : "서울경제에서 주최하는 대한민국 창업대상 CEO 부문에 국무총리상을 수상하였습니다.",
                    "date" : "06"
                }
            },
            {
                date : '2018.12',
                content : {
                    "title" : "소비자중심경영(CCM) 인증 획득",
                    "filepath" : "https://www.ediya.com/files/award/IMG_1580975213558.jpg",
                    "description" : "소비자 중심 경영 인증했습니다.",
                    "date" : "12"
                }
            },
            {
                date : '2017.06',
                content : {
                    "title" : "대한민국 창업대상 산업통상자원부 장관상 수상",
                    "filepath" : "https://www.ediya.com/files/award/IMG_1580975213558.jpg",
                    "description" : "장관상을 탔습니다.",
                    "date" : "06"
                }
            },
            {
                date : '2017.02',
                content : {
                    "title" : "사회보험 사각지대해소 '특별상' 수상",
                    "filepath" : "https://www.ediya.com/files/award/IMG_1580975213558.jpg",
                    "description" : "특별상을 탔습니다.",
                    "date" : "02"
                }
            }
        ]
    }

    const awards = json.data;
    const award_container = document.getElementById("awards");
    let now_year;



    const createYear = (container) => {
        let box = `
            <div class="award" id=${now_year}>
                <p class="award_year">
                    ${now_year}
                </p>
                <img
                    class="dot"
                    src=\"../image/dot.png"
                />
                <div id=${now_year + "content"}>
                    ${container}
                </div>
            </div>
        `
        award_container.innerHTML += box;
    }


    awards.forEach(function(award){
        //구조분해 할당 사용(하면 좋은점?)
        console.log(award);
        let {date:date, content:content} = award;
        // console.log(date, content)
        let {date:day, title, description, filepath} = content;
        // console.log(day)
        date = date.replace(/,/g,'.')
        // console.log(date)
        date = date.split('.');
        var current = false;
        if(!now_year || now_year!==date[0]){
            now_year = date[0];
        }else{
            current = true;
        }

        let container = `
            <div class="container">
                <div class="award_content">
                    <p class="award_content_date">
                        ${date[1]}
                    </p>
                    <p class="award_content_title">
                        ${title}
                    </p>
                    <img 
                        class="award_content_scroll" 
                        id="award_content_scroll"
                        src=\"../image/arrow_close.png"
                        width="10px"
                        height="10px"
                    />
                </div>

                <div class="award_detail" id="award_detail">
                    <img
                        src=${filepath}
                        width="auto"
                        height="100px"
                    />
                    <p>
                        ${description}
                    </p>
                    <div class="detail_date">
                        <p class="detail_date_title">
                            수상일
                        </p>
                        <p class="detail_date_date">
                            ${date[0] + '.' + date[1] + '.' + day}
                        </p>
                    </div>
                </div>
            </div>
        `

        if(!current){
            createYear(container);
        }else{
            const content_container = document.getElementById(now_year+"content");
            content_container.innerHTML+=container;
        }
    })

    //araay를 참조하지 않는 반복문이기 떄문에 여기서는 for문을 사용.
    for (let i = 0; i < awards.length; i++) {
        let detail = document.querySelectorAll("#award_detail")[i];
        let scroll = document.querySelectorAll("#award_content_scroll")[i];
        scroll.addEventListener("click", () => {
            if(detail.classList.contains("block")){
                detail.classList.remove("block")
                scroll.src = '../image/arrow_close.png';
            }else{
                detail.className += " block"
                scroll.src = '../image/arrow_open.png'
            }
        })
    }
}
//details태그