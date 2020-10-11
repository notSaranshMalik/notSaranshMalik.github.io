// Initialise script
let canvas = document.querySelector("canvas");
let main = document.querySelector("main");

let slider_length = document.getElementById("length");
let slider_angle_1 = document.getElementById("angle_1");
let slider_angle_2 = document.getElementById("angle_2");

c = canvas.getContext('2d');
c.lineWidth = 3;
c.strokeStyle = '#000000';

let width = main.offsetWidth;
let height = main.offsetHeight;
canvas.width = width;
canvas.height = height;

let pend_rad = Math.min(height, width) / 150;
let pend_len = Math.min(height, width) / 6;
let fps = 120;
let g = -9.81;

let interval;


// Fixed properties
let pend_len_real = 0.5;
let org_ang = Math.PI/2;
let org_ang2 = Math.PI/2;
let m = 2;


// Bobs
let ang = org_ang;
let vel = 0;
let ang2 = org_ang2;
let vel2 = 0;
let frame = 0;


// If resized
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    main.removeChild(canvas)

    width = main.offsetWidth;
    height = main.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    pend_rad = Math.min(height, width) / 150;
    pend_len = Math.min(height, width) / 6;

    main.appendChild(canvas);
}


// Sliders
slider_length.oninput = modified;
slider_angle_1.oninput = modified;
slider_angle_2.oninput = modified;

function modified() {
    pend_len_real = slider_length.value;
    org_ang = Math.PI * slider_angle_1.value / 180;
    org_ang2 = Math.PI * slider_angle_2.value / 180;

    slider_length.previousElementSibling.innerHTML = `${pend_len_real} m`;
    slider_angle_1.previousElementSibling.innerHTML = `${slider_angle_1.value}°`;
    slider_angle_2.previousElementSibling.innerHTML = `${slider_angle_2.value}°`;

    ang = org_ang;
    ang2 = org_ang2;
    vel = 0;
    vel2 = 0;
    frame = 0;

    clearInterval(interval);
    interval = setInterval(animate, 1000 / fps);
}

modified();


function animate() {

    if (frame < fps * 30) {
        let acc = g * 3 * m * Math.sin(ang) + m * g * Math.sin(ang - 2 * ang2) - 2 * Math.sin(ang - ang2) * m * pend_len_real * (vel2 ** 2 + (vel ** 2) * Math.cos(ang - ang2))
        acc /= (pend_len_real * (3 * m - m * Math.cos(2 * ang - 2 * ang2)));
        let acc2 = 2 * Math.sin(ang - ang2) * ((vel ** 2) * pend_len_real * 2 * m - g * 2 * m * Math.cos(ang) + (vel2 ** 2) * pend_len_real * m * Math.cos(ang - ang2))
        acc2 /= (pend_len_real * m * (3 - Math.cos(2 * ang - 2 * ang2)));

        vel += acc / fps;
        ang += vel / fps;
        vel2 += acc2 / fps;
        ang2 += vel2 / fps;

        c.clearRect(0, 0, canvas.width, canvas.height);
        draw_pend(width/2, height/2, ang);
        draw_pend(width/2 + (Math.sin(ang) * pend_len), height/2 + (Math.cos(ang) * pend_len), ang2);

        frame += 1;
    } else {
        clearInterval(interval);
    }

}

function draw_pend(start_x, start_y, ang) {
    c.beginPath();
    c.moveTo(start_x, start_y);
    c.lineTo(start_x + (Math.sin(ang) * pend_len), start_y + (Math.cos(ang) * pend_len));
    c.stroke();

    c.beginPath();
    c.arc(start_x + (Math.sin(ang) * pend_len), start_y + (Math.cos(ang) * pend_len), pend_rad, 0, 2 * Math.PI);
    c.closePath();
    c.fillStyle = "#000000";
    c.fill();
    c.stroke();
}