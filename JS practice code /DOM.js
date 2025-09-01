
document.designMode = "on"
"on" 

document.querySelector(".box")
<div class="box">

document.querySelector(".box").innerHTML
"hey i am a box"

document.querySelector(".container").innerHTML
Uncaught TypeError: document.querySelector(...) is null
    <anonymous> debugger eval code:1
debugger eval code:1:10
document.querySelector(".conatiner").innerHTML
'
		<div class="box">hey i am a box</div>
	'
document.querySelector(".conatiner").OuterHTML
undefined
document.querySelector(".conatiner").outerHTML

'<div class="conatiner">
		<div class="box">hey i am a box</div>
	</div>'

document.querySelector(".conatiner").tagnode
undefined
document.querySelector(".conatiner").tagName
"DIV"
document.querySelector(".conatiner").nodeName
"DIV" 

document.querySelector(".conatiner").textContent
"
		hey i am a box
	" 



document.querySelector(".conatiner").hidden="true"
"true" 


document.querySelector(".conatiner").hasAttribute("style")
true
document.querySelector(".conatiner").getAttribute("style")
"background-color: red;"
document.querySelector(".conatiner").setAttribute("style", "background-color: blue")
undefined 

 // let div = document.createElement("div");
            // div.innerHTML = "I have been inserted <b>by harry</b>"
            // div.setAttribute("class", "created");
            // document.querySelector(".container").before(div);
            let cont = document.querySelector(".container")
            cont.insertAdjacentHTML("beforebegin", "<b> I am under the water. Please h elp me here too much raining.... iuuuuooooo</b>")














