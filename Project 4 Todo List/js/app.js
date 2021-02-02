let section = document.querySelector("section")
let add = document.querySelector("form button")

add.addEventListener("click", e => {
    //凍結送出表單功能
    e.preventDefault()
    //將表單存放到form變數
    let form = e.target.parentElement
    //將抓取到的HTMLCollection拆分存放到變數中
    let todoText = form.children[0].value
    let todoMooth = form.children[1].value
    let todoDate = form.children[2].value
    //如果待辦事項為空,則提醒使用者輸入
    if (todoText === "") {
        alert("請輸入待辦事項")
        return //不加入此行則會繼續往下執行
    }
    //生成一個div class="todo" 的標籤
    let todo = document.createElement("div")
    todo.classList.add("todo")
    //生成一個p class="todo-text" 的標籤,並將todoText放進去
    let text = document.createElement("p")
    text.classList.add("todo-text")
    text.innerText = todoText
    //生成一個p class="todo-ttime" 的標籤,並將todoMooth跟todoDate放進去
    let time = document.createElement("p")
    time.classList.add("todo-time")
    time.innerText = todoMooth + " / " + todoDate
    //將兩個P標籤放入div class="todo"的容器中
    todo.appendChild(text)
    todo.appendChild(time)

    //建立check圖案
    let completeButton = document.createElement('button')
    completeButton.classList.add('complete')
    completeButton.innerHTML = '<i class="fas fa-check"></i>'
    //按下check按鈕時切換一個done樣式給div class="todo"的容器中
    completeButton.addEventListener('click', e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done")
    })
    //建立close圖案跟設定其功能
    let trashButton = document.createElement('button')
    trashButton.classList.add('trash')
    trashButton.innerHTML = '<i class="fas fa-times"></i>'
    //按下close按鈕時刪除整個div class="todo"的容器
    trashButton.addEventListener('click', e => {
        let todoItem = e.target.parentElement;
        //等待動畫完後再完整刪除整個容器
        todoItem.addEventListener("animationend", () => {
            //刪除localStorage裡的資料
            let text = todoItem.children[0].innerText
            let myListArray = JSON.parse(localStorage.getItem("list"))
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1)
                    localStorage.setItem("list", JSON.stringify(myListArray))
                }
            })
            //刪除頁面資料
            todoItem.remove()
        })
        todoItem.style.animation = "scaleDown 0.5s forwards"
    })
    //將兩個button標籤放入div class="todo"的容器中
    todo.appendChild(completeButton)
    todo.appendChild(trashButton)
    //增加淡入動畫效果
    todo.style.animation = "scaleUp 0.5s forwards"

    /* *****創建一個新物件***** */
    let myTodo = {
        todoText: todoText,
        todoMooth: todoMooth,
        todoDate: todoDate
    }
    /* *****將資料存進localStorage***** */
    let myList = localStorage.getItem("list")

    if (myList == null) {
        localStorage.setItem('list', JSON.stringify([myTodo])) //直接寫入myTodo物件
    } else {
        let myListArray = JSON.parse(myList) //先將localStorage裡的東西轉換出來
        myListArray.push(myTodo) //接著將新增的東西存放進陣列
        localStorage.setItem("list", JSON.stringify(myListArray)) //再存回去
    }

    //清空Input的內容
    form.children[0].value
    //再把div class="todo"丟進section裡面
    section.appendChild(todo)
})

loadData()

/* 讀取localStorage */

function loadData() {
    let myList = localStorage.getItem("list")
    if (myList !== null) {
        let myListArray = JSON.parse(myList)
        //將取出的東西迭代套上HTML標籤與CSS樣式
        myListArray.forEach(item => {
            let todo = document.createElement("div")
            todo.classList.add("todo")
            let text = document.createElement("p")
            text.classList.add("todo-text")
            text.innerText = item.todoText
            let time = document.createElement("p")
            time.classList.add("todo-time")
            time.innerText = item.todoMooth + "/" + item.todoDate
            todo.appendChild(text)
            todo.appendChild(time)
            //建立check圖案
            let completeButton = document.createElement('button')
            completeButton.classList.add('complete')
            completeButton.innerHTML = '<i class="fas fa-check"></i>'
            //按下check按鈕時切換一個done樣式給div class="todo"的容器中
            completeButton.addEventListener('click', e => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done")
            })
            //建立close圖案跟設定其功能
            let trashButton = document.createElement('button')
            trashButton.classList.add('trash')
            trashButton.innerHTML = '<i class="fas fa-times"></i>'
            //按下close按鈕時刪除整個div class="todo"的容器
            trashButton.addEventListener('click', e => {
                let todoItem = e.target.parentElement;
                //等待動畫完後再完整刪除整個容器
                todoItem.addEventListener("animationend", () => {
                    //刪除localStorage裡的資料
                    let text = todoItem.children[0].innerText
                    let myListArray = JSON.parse(localStorage.getItem("list"))
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1)
                            localStorage.setItem("list", JSON.stringify(myListArray))
                        }
                    })
                    //刪除頁面上的資料
                    todoItem.remove()
                })
                todoItem.style.animation = "scaleDown 0.5s forwards"
            })
            todo.appendChild(completeButton)
            todo.appendChild(trashButton)

            section.appendChild(todo)
        })
    }
}
/* merge 排列演算法 */
function mergeTime(arr1, arr2) {
    let i = 0
    let j = 0
    let result = []

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMooth) > Number(arr2[j].todoMooth)) {
            result.push(arr2[j])
            j++
        } else if (Number(arr1[i].todoMooth) < Number(arr2[j].todoMooth)) {
            result.push(arr1[i])
            i++
        } else if (Number(arr1[i].todoMooth) == Number(arr2[j].todoMooth)) {
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j])
                j++
            } else {
                result.push(arr1[i])
                i++
            }
        }
    }
    while (i < arr1.length) {
        result.push(arr1[i])
        i++
    }

    while (j < arr2.length) {
        result.push(arr2[j])
        j++
    }

    return result
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr
    } else {
        let middle = Math.floor(arr.length / 2)
        let right = arr.slice(0, middle)
        let left = arr.slice(middle, arr.length)
        return mergeTime(mergeSort(right), mergeSort(left))
    }
}

//console.log(mergeSort(JSON.parse(localStorage.getItem("list"))))

let sortButton = document.querySelector("div.sort button")
sortButton.addEventListener("click", () => {

    //sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")))
    localStorage.setItem("list", JSON.stringify(sortedArray))

    //remove data
    let len = section.children.length
    for (let i = 0; i < len; i++) {
        section.children[0].remove()
    }

    //load data
    loadData()
})