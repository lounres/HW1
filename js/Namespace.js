let doc = document; // Лень писать "document"
let game_params = {        //Объект описывающий параметры игры
    posX : 150,
    posY : 20,
    cntX : 5,   //Количество столбцов точек
    cntY : 5,   //Количество строк точек
    divX : 50,  //Расстояние между двумя столбцами точек
    divY : 50,  //Расстояние между двумя строками точек
    lineWidth : 1,  //Толщина линий, соединяющих наши точки
    dist : 5,    //TODO: WTF???
    start : {x: 0, y: 0}, //Начальная позиция
    finish : {x: 4, y: 2} //Конечная позиция
};
