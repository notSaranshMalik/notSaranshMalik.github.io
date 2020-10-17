const anim_button = document.getElementById("animbutton")
const over_menu = document.getElementById("over-menu")
const but1 = document.getElementById("exp_over_button")
const but2 = document.getElementById("port_over_button")
const but3 = document.getElementById("cont_over_button")
const bar1 = document.getElementById("bar1")
const bar2 = document.getElementById("bar2")
const bar3 = document.getElementById("bar3")
let overlay_on = false;

anim_button.onclick = do_anim;
but1.onclick = do_anim;
but2.onclick = do_anim;
but3.onclick = do_anim;

function do_anim() {

    if(overlay_on) {
        over_menu.style.visibility = "hidden";
        over_menu.style.opacity = 0;
        over_menu.style.zIndex = 0;

        bar1.style.transform = "translate(0px, 0px) rotate(0deg)";
        bar2.style.transform = "rotate(0deg)";
        bar2.style.opacity = 1;
        bar3.style.transform = "translate(0px, 0px) rotate(0deg)";

        overlay_on = false;
    } else {
        over_menu.style.visibility = "visible";
        over_menu.style.opacity = 1;
        over_menu.style.zIndex = 15;

        bar1.style.transform = "translate(0px, 8px) rotate(225deg)";
        bar2.style.transform = "rotate(180deg)";
        bar2.style.opacity = 0;
        bar3.style.transform = "translate(0px, -8px) rotate(135deg)";

        overlay_on = true;
    }
}

const scriptURL = 'https://script.google.com/macros/s/AKfycbxmnr6YFNbXHkq6ZL5i97d41f3EoiAoGLxMqh56sIYE8TJogIdV/exec'
const form = document.forms['contact_form']
form.addEventListener('submit', e => {
    document.getElementById('overlay').textContent="Sending";
    document.getElementById('overlay').style.animation = "show 0.5s forwards";
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {form.reset();
        document.getElementById('overlay').style.animation = "";
        document.getElementById('overlay').textContent="Sent!";
        return true})
    .catch(error => console.error('Error!', error.message))
})