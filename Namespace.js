let doc = document; // Лень писать "document"
let game_params = {        //Объект описывающий параметры игры
    posX : 150,
    posY : 20,
    cntX : 6,   //Количество столбцов точек
    cntY : 6,   //Количество строк точек
    divX : 70,  //Расстояние между двумя столбцами точек
    divY : 70,  //Расстояние между двумя строками точек
    lineWidth : 3,  //Толщина линий, соединяющих наши точки
    edgeWidth: 5,
    dist : 5,    //TODO: WTF???
    start : {x: 0, y: 0}, //Начальная позиция
    finish : {x: 5, y: 2} //Конечная позиция
};

// function notWork() {
//     if (!finish) {
//         alert("This button doesn't work. You can simply play our game.")
//     }else{
//         score = edges_in_chain.length;
//         alert("This button doesn't work. Your score: " + score)
//     }
// }