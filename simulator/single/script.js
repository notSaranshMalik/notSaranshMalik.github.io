// Initialise script
let canvas = document.querySelector("canvas");
let main = document.querySelector("main");

let slider_length = document.getElementById("length");
let slider_radius = document.getElementById("radius");
let slider_density_bob = document.getElementById("density_bob");
let slider_density_atm = document.getElementById("density_atm");
let slider_drag = document.getElementById("drag");
let period_label = document.getElementById("period");
let coef_label = document.getElementById("coef");

c = canvas.getContext('2d');


// Initialise visuals
let width = main.offsetWidth;
let height = main.offsetHeight;
canvas.width = width;
canvas.height = height;
let pend_rad = Math.min(height, width) / 50;
let pend_len = Math.min(height, width) / 2;
let fps = 60;


// Fixed properties
let pend_len_real = 0.5;
let pend_rad_real = 0.02;
let dens_bob = 1000;
let dens_air = 1.2;
let drag = 0.5;
let org_ang = Math.PI / 3;
let g = -9.81;
let coef;


// Changing properties
let ang = org_ang;
let vel = 0;
let acc = 0;
let max = [org_ang];


// If resized
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    main.removeChild(canvas)

    width = main.offsetWidth;
    height = main.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    pend_rad = Math.min(height, width) / 50;
    pend_len = Math.min(height, width) / 2;

    main.appendChild(canvas);
}


// Sliders
slider_length.oninput = modified;
slider_radius.oninput = modified;
slider_density_bob.oninput = modified;
slider_density_atm.oninput = modified;
slider_drag.oninput = modified;

function modified() {
    pend_len_real = slider_length.value;
    pend_rad_real = slider_radius.value;
    dens_bob = slider_density_bob.value;
    dens_air = slider_density_atm.value;
    drag = slider_drag.value;

    slider_length.previousElementSibling.innerHTML = `${pend_len_real} m`;
    slider_radius.previousElementSibling.innerHTML = `${pend_rad_real} m`;
    slider_density_bob.previousElementSibling.innerHTML = `${dens_bob} kg⋅m<sup>-3</sup>`;
    slider_density_atm.previousElementSibling.innerHTML = `${dens_air} kg⋅m<sup>-3</sup>`;
    slider_drag.previousElementSibling.innerHTML = `${drag}`;

    coef = 0.375 * dens_air * drag / (dens_bob * pend_rad_real * pend_len_real);

    period_label.innerHTML = `Period: ${(2 * Math.PI * Math.sqrt(-pend_len_real / g)).toFixed(2)} s`;
    coef_label.innerHTML = `Constant: ${(coef).toFixed(4)} m<sup>-1</sup>`;

    ang = org_ang;
    vel = 0;
    max = [org_ang];
}

modified();


// Animate
setInterval(animate, 1000 / fps);

function animate() {
    prev_vel = vel;

    acc = Math.sin(ang) * g / pend_len_real;
    air_res = coef * vel ** 2;
    air_res = vel < 0 ? air_res : -air_res;

    vel += (acc + air_res) / fps;
    ang += vel / fps;

    if ((prev_vel < 0 && vel > 0) || (prev_vel > 0 && vel < 0)) {
        max[1] = max[0];
        max[0] = ang;
    }

    c.lineWidth = 3;
    c.setLineDash([]);
    c.strokeStyle = '#000000';
    c.clearRect(0, 0, canvas.width, canvas.height);
    draw_pend(width/2, 0, ang);

    c.lineWidth = 1;
    c.setLineDash([5, 15]);
    c.strokeStyle = '#ff0000';
    for (i of max) {
        draw_max(width/2, 0, i);
    }
}

function draw_max(start_x, start_y, ang) {
    c.beginPath();
    c.moveTo(start_x, start_y);
    c.lineTo(start_x + (Math.sin(ang) * pend_len), start_y + (Math.cos(ang) * pend_len));
    c.stroke();
}

function draw_pend(start_x, start_y, ang) {
    c.beginPath();
    c.moveTo(start_x, start_y);
    c.lineTo(start_x + (Math.sin(ang) * pend_len), start_y + (Math.cos(ang) * pend_len));
    c.stroke();

    c.beginPath();
    c.arc(start_x + (Math.sin(ang) * (pend_len + pend_rad)), start_y + (Math.cos(ang) * (pend_len + pend_rad)), pend_rad, 0, 2 * Math.PI);
    c.closePath();
    c.fillStyle = "#000000";
    c.fill();
    c.stroke();
}