// Mengambil canvas yang akan dijadikan tempat menggambarnya
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

// Mendefaultkan bahwa game belum dimulai
let gameStarted = false;

function drawStartGame() {
    // UKURAN CARD
    const cardWidth = 300;
    const cardHeight = 300;

    // Menghitung posisi agar card berada tepat di tengah Canvas
    const cardX = (canvas.width - cardWidth) / 2;
    const cardY = (canvas.height - cardHeight) / 2;

    // Menyimpan kondisi awal page yang tanpa bayangan
    ctx.save();
    
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 6;

    // MEMBUAT CARD
    ctx.fillStyle = "red";
    ctx.fillRect(
        cardX,
        cardY,
        cardWidth,
        cardHeight
    );

    // Mengembalikan kondisi canvas ke semula dan shadow otomatis mati untuk elemen berikutnya
    ctx.restore();

    // JUDUL
    ctx.fillStyle = "white";
    ctx.font = "24px Monospace";
    ctx.textAlign = "center";

    ctx.fillText(
        "CATCH THE COINS",
        canvas.width / 2,
        cardY + 70
    );

    // TOMBOL START
    const buttonWidth = 200;
    const buttonHeight = 60;

    // Agar tombol berada di tengah Canvas
    const buttonX = (canvas.width - buttonWidth) / 2;

    // Posisi tombol di dalam card
    const buttonY = cardY + 180;

    ctx.save();

    ctx.shadowColor = "gold";
    ctx.shadowBlur = 34;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = "gold";
    ctx.fillRect(
        buttonX,
        buttonY,
        buttonWidth,
        buttonHeight
    );

    ctx.restore();

    // TULISAN TOMBOL
    ctx.fillStyle = "black";
    ctx.font = "20px Monospace";

    ctx.fillText(
        "START GAME",
        canvas.width / 2,
        buttonY + 38
    );
}

canvas.addEventListener('click', function(event) {
    // 1. Ambil posisi kursor yang sudah disesuaikan dengan skala canvas di layar
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 2. Hitung ulang posisinya menggunakan rumus yang sama persis
    const cardHeight = 300;
    const cardY = (canvas.height - cardHeight) / 2;

    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = cardY + 180;

    // 3. Batas area klik (Bounding Box) berdasarkan variabel dinamis
    const buttonLeft = buttonX;
    const buttonRight = buttonX + buttonWidth;
    const buttonTop = buttonY;
    const buttonBottom = buttonY + buttonHeight;

    // 4. Cek apakah klik berada di dalam area tombol
    if (
        mouseX >= buttonLeft && 
        mouseX <= buttonRight && 
        mouseY >= buttonTop && 
        mouseY <= buttonBottom
    ) {
        gameStarted = true;
        console.log("Game Berhasil Dimulai!");
    }
});

// Membuat objek Player
const playerImage = new Image();
playerImage.src = "img/player.png";

// Membuat objek Coins
const coinsImage = new Image();
coinsImage.src = "img/coins.png";

// Mengisi data player baik ukuran, tata letak, hingga kecepatan
const player = {
    // Menentukan posisi awal player berada atau di buat
    x: 100,
    y: 100,
    // Menentukan ukuran dari player
    width: 50,
    height: 50,
    // Menentukan kecepatan dari player
    speed: 3
} 

// Mmbuat array untuk menyimpan semua coins yang akan dibuat 
const coins = [];
// Menentukan jumlah coins yang akan dibuat
const jumlahCoins = 10;
// Menentukan ukuran dari tiap coins
const coinWidth = 40;
const coinHeight = 40;

// Perulangan yang digunakan untuk membuat coins
for(let i = 0; i < jumlahCoins; i++){
    // Membuat satu object coin
    const coin = {
        // Membuat posisi x secara random, pengurangan di akhir digunakan agar coin tidak keluar dari sisi kanan canvas
        x: Math.random() * (canvas.width - coinWidth),

        // Membuat posisi y secara random, pengurangan di akhir digunakan agar coin tidak keluar dari sisi bawah canvas
        y: Math.random() * (canvas.height - coinHeight),

        // Menyimpan ukuran coin
        width: coinWidth,
        height: coinHeight
    };

    // Memasukkan coin yang telah dibuat ke dalam array dengan cara di push
    coins.push(coin)
}

// Menentukan score awal 
let score = 0;

// Menggambar seluruh isi dari game
function draw() {
    // Membersihkan frame dari gambar sisa game sebelumnya dan menggambar canvas baru
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(!gameStarted){
        drawStartGame();
        return;
    }

    // Menggambar player 
    ctx.drawImage(
        playerImage,
        player.x,
        player.y,
        player.width,
        player.height
    );

    // Menggambar seluruh coin dengan mengambilnya satu satu dari array
    coins.forEach(function(coin){
        ctx.drawImage(
            coinsImage,
            coin.x,
            coin.y,

            coin.width,
            coin.height
        );
    });

    // Menampilkan Score
    ctx.font = "24px Monoscape";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";

    ctx.fillText("Score : " + score, 20, 30);
}

// Fungsi untuk membatasi player agar tidak keluar dari area canvas
function batasiPlayer(){
    // Jika player keluar dari sisi kiri
    if(player.x < 0){
        player.x = 0;
    }
    // Jika player keluar dari sisi kanan
    if(player.x + player.width > canvas.width){
        player.x = canvas.width - player.width;
    }

    // Jika player keluar dari sisi atas
    if(player.y < 0){
        player.y = 0;
    }

    // Jika player keluar dari sisi bawah
    if(player.y + player.height > canvas.height){
        player.y = canvas.height - player.height;
    }
}

const keys = {};

window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    // Mencegah layar scroll saat menekan tombol WASD atau Spasi
    if (["w", "a", "s", "d", " "].includes(key)) {
        event.preventDefault();
    }
    keys[key] = true;
});

window.addEventListener('keyup', function(event) {
    keys[event.key.toLowerCase()] = false;
});

// Reset tombol jika game kehilangan fokus (pindah tab)
window.addEventListener('blur', function() {
    for (let key in keys) {
        keys[key] = false;
    }
});

// Fungsi untuk mengetahui apakah player sudah menyeruh coin
function cekSentuhan(player, coin){
    return(
        // Sisi kiri player masih berada sebelum sisi kanan coin
        player.x < coin.x + coin.width &&

        // Sisi kanan player sudah melewati sisi kiri coin
        player.x + player.width > coin.x &&

        // Sisi atas player masih berada sebelum sisi bawah coin
        player.y < coin.y + coin.height &&

        // Sisi bawah player sudah melewati sisi atas coin
        player.y + player.height > coin.y
    );
}

// Fungsi REUSABLE untuk memindahkan koin koin baru ke posisi random agar tidak sama
function posisiAcakKoin(coin){
    // Posisi X baru
    coin.x = Math.random() * (canvas.width - coin.width);

    // Posisi Y baru
    coin.y = Math.random() * (canvas.height - coin.height);
}

// Fungsi untuk UPDATE data game seperti memriksa tabrakan, menambah score, dan memindahkan coin
function update(){
    // Jika game belum dimulai, hentikan update
    if(!gameStarted){
        return;
    }

    // Cek apakah tombol Shift ditekan untuk lari cepat
    const isShift = keys["shift"] || keys["shiftright"] || keys["shiftleft"];
    let speed = isShift ? player.speed + 2 : player.speed;

    // Variabel arah (vektor) untuk pergerakan halus & diagonal
    let moveX = 0;
    let moveY = 0;

    // Hanya merespons tombol W, A, S, D
    if (keys["d"]) moveX += 1;
    if (keys["a"]) moveX -= 1;
    if (keys["s"]) moveY += 1;
    if (keys["w"]) moveY -= 1;

    // Terapkan kecepatan ke posisi player
    player.x += moveX * speed;
    player.y += moveY * speed;

    // Batasi posisi player agar tidak keluar canvas
    batasiPlayer();

    // Pengecekan sentuhan koin
    coins.forEach(function(coin) {
        if(cekSentuhan(player, coin)){
            score++;
            posisiAcakKoin(coin);
        }
    });
}

// Fungsi untuk menjalankan fungsi game secara loop mulai dar update, draw, tunggu frame, update, draw
function gameLoop() {
    // Memanggil Fungsi Update
    update();
    // Memanggil Fungsi Menggambar asset
    draw();
    // membuat frame animasi 
    requestAnimationFrame(gameLoop);
}

// Menjalankan Game
gameLoop();