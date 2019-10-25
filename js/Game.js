let linesX = [];  //Список вертикальных соединительных линий
let linesY = [];  //Список горизонтальных соединительных линий
let dots = [];    //Список всех точек, кроме TODO:???
let chain = []; //Рёбра цепи, которую сделал пользователь
let dots_in_chain = []; //Точки цепи, которую сделал пользователь

game_params.sizeX = game_params.cntX * game_params.divX; //Горизонтальный размер "таблицы" (без учёта ширины точек)
game_params.sizeY = game_params.cntY * game_params.divY; //Вертикальный размер "таблицы" (без учёта высоты точек)

let Game = doc.getElementById("Game"); //Div игры, который уже описан в HTML страницы 
console.log((game_params.sizeY + game_params.posY + 20)); //TODO: WTF?
let sup = (game_params.sizeY + game_params.posY + 20);    //TODO: WTF??
game_params.posX = (sup - game_params.sizeX) / 2; //TODO: WTF???
Game.style.padding = ((game_params.sizeY + game_params.posY + 20) / 2);   //TODO: WTF????

function to_integer(s){ //Косорукое преобразование строки в целое
    let ans = "";
    for (let i = 0; i < s.length; i++){
        if ("0123456789".lastIndexOf(s[i]) != -1){
            ans += s[i];
        }
    }
    return Number(ans);
}

function init_styles(obj){ //Перезаносит все правила стилей в объект
    let style = window.getComputedStyle(obj);
    for (i in style){
        if (style[i] != ""){
            obj.style[i] = style[i];
        }
    }
}

function rotate(obj, deg){  //Поворот объекта с помощью CSS
    obj.style.webkitTransform = 'rotate(' + deg + 'deg)'; // Chrome
    obj.style.mozTransform = 'rotate(' + deg + 'deg)'; // Mozilla
    obj.style.msTransform = 'rotate(' + deg + 'deg)'; // Explorer
    obj.style.oTransform = 'rotate(' + deg + 'deg)'; // Opera
    obj.style.transform = 'rotate(' + deg + 'deg)'; // Просто для всего
}

function recolour(obj, colour){ //Перекрасить объект в данный цвет
    obj.style.backgroundColor = colour;
}

function position_by_index(ind){    //Позиция точки по индексам
    res = {x : 0, y : 0};
    res.x = game_params.posX + game_params.divX * ind[0];
    res.y = game_params.posY + game_params.divY * ind[1];
    return res;
}

function distance(dot1, dot2){  //Норма между двумя точками
    let dy = to_integer(dot2.style.top) - to_integer(dot1.style.top);
    let dx = to_integer(dot2.style.left)  - to_integer(dot1.style.left);
    return dx ** 2 + dy ** 2;
}

function create_vertical_lines(){   //Делает вертикальные прямые
    for (let i = 0; i <= game_params.cntX; i += 1){
        let new_line = doc.createElement('div');
        linesX.push(new_line);
        new_line.id = "lineX" + i;
        
        Game.appendChild(new_line);
        new_line.className = "grid";
        init_styles(new_line);

        new_line.style.top = game_params.posY;
        new_line.style.left = game_params.posX + i * game_params.divX;
        new_line.style.height = game_params.sizeX;
        new_line.style.width = game_params.lineWidth;
    }
}

function create_horizontal_lines(){ //Делает горизонтальные прямые
    for (let i = 0; i <= game_params.cntY; i += 1){
        let new_line = doc.createElement('div');
        linesY.push(new_line);
        new_line.id = "lineY" + i;

        Game.appendChild(new_line);
        new_line.className = "grid";
        init_styles(new_line);

        new_line.style.top = game_params.posY + i * game_params.divY;
        new_line.style.left = game_params.posX;
        new_line.style.width = game_params.sizeY;
        new_line.style.height = game_params.lineWidth;
    }
}

function create_new_dot(pos){   //Делает новую точку в заданных координатах
    new_dot = doc.createElement("div");
    dots.push(new_dot);
    new_dot.coordinates = pos;
    new_dot.id = "fixed_dots" + (pos[1] * game_params.cntX + pos[0]);

    Game.appendChild(new_dot);
    new_dot.className = "fixed_dots";
    init_styles(new_dot);

    new_dot.style.top = pos.y - to_integer(new_dot.style.height) / 2;
    new_dot.style.left = pos.x - to_integer(new_dot.style.width) / 2;

    new_dot.onclick = function(){Adding_to_chain(this);};
    new_dot.onmouseenter = function(){
        if (distance(lDot, this) != game_params.dist){ 
            return;
        }
        recolour(this, "white");
    };
    new_dot.onmouseleave = function(){
        if (distance(lDot, this) != game_params.dist){
            return;
        }
        recolour(this, "black");
    };
}

function create_dots(){ //Делает все необходимые точки
    for (let i = 0; i <= game_params.cntX; i += 1){
        for (let j = 0; j <= game_params.cntY; j += 1){
            create_new_dot(position_by_index([i, j]));
        }
    }
}

function is_intersected(dotA, dotB, dotC, dotD){
    function prod(dot1, dot2){
        return dot1.x * dot2.y - dot2.x * dot1.y;
    };
    function diff(dot1, dot2){
        let x1 = To_integer(dot1.style.left);
        let y1 = To_integer(dot1.style.top);
        let x2 = To_integer(dot2.style.left);
        let y2 = To_integer(dot2.style.top);
        return {x : x1 - x2, y : y1 - y2};
    }

    let v1 = diff(dotC, dotA);
    let v2 = diff(dotD, dotA);
    let v3 = diff(dotB, dotA);
    let ans = true;
    ans = ans && ((prod(v1, v2) * prod(v1, v3) >= 0) && (prod(v1, v3) * prod(v3, v2) >= 0));
    v1 = diff(dotA, dotC);
    v2 = diff(dotB, dotC);
    v3 = diff(dotD, dotC);
    ans = ans && ((prod(v1, v2) * prod(v1, v3) >= 0) && (prod(v1, v3) * prod(v3, v2) >= 0));
    return ans; //Недобаг: точки могут (нет) лежать на одной прямой
}

function create_chain(dot1, dot2){
    if (!dot1){ //Проверка на undefined
        return false;
    }

    for (let i = 0; i + 2 < dots_in_chain.length; i++){
        if (is_intersected(dots_in_chain[i], dots_in_chain[i + 1], dot1, dot2)){
            return false;
        }
    }

    let a = to_integer(dot2.style.left) - to_integer(dot1.style.left);
    let b = to_integer(dot2.style.top) - to_integer(dot1.style.top);
    if (a ** 2 + b ** 2 != game_params.dist){
        return false;
    }

    let c = Math.sqrt((a * a) + (b * b));
    let sinus = b / c; 
    let cosinus = a / c;
    let last_ind = chain.length;
    chain.push(doc.createElement("div"));
    Game.appendChild(chain[last_ind]);
    chain[last_ind].className = "chain";
    init_styles(chain[last_ind]);
    chain[last_ind].id = "chain" + last_ind;
    chain[last_ind].style.width = c;
    chain[last_ind].style.top = To_integer(dot1.style.top) + To_integer(dot1.style.height) / 2;
    chain[last_ind].style.left = To_integer(dot1.style.left) + To_integer(dot1.style.height) / 2;
    let deg = Math.atan2(sinus, cosinus) * (180 / Math.PI);
    Rotate(chain[last_ind], deg);
    return true;
}

function Adding_to_chain(dot){
    if (lDot != undefined && !Create_chain(lDot, dot)){
        return;
    }
    dots_in_chain.push(dot);
    dot.style.backgroundColor = "balck";
    dot.onmouseenter = function(){};
    dot.onmouseleave = function(){};
    dot.onclick = function(){reduceChainTo(dot)};
    lDot = dot;
    if (dot == dots[finish_coordinates]){
        finishedChain();
    }
}

function finishedChain(){
    alert("Your result : " + chain.length + "pts");
}

function unfinushedChain(){
    
}

function reduceChainTo(dot){
    while (dots_in_chain[dots_in_chain.length - 1] != dot){
        let cur = dots_in_chain[dots_in_chain.length - 1];
        if (cur != dots[finish_coordinates]){
            Recoloring(cur, "black");
            cur.onmouseenter = function(){
                if (Distance(lDot, cur) != game_params.dist){return;}
                Recoloring(cur, "#BBBBBB");
            };
            cur.onmouseleave = function(){
                if (Distance(lDot, cur) != game_params.dist){return;}
                Recoloring(cur, "white");
            };
        }else{
            Recoloring(dots[finish_coordinates], "#AA0000");
            dots[finish_coordinates].onmouseenter = function(){
                if (Distance(lDot, dots[finish_coordinates]) != game_params.dist){return;}
                rRecoloring(dots[finish_coordinates], "#FF0000");
            };
            dots[finish_coordinates].onmouseleave = function(){
                if (Distance(lDot, dots[finish_coordinates]) != game_params.dist){return;}
                Recoloring(dots[finish_coordinates], "#AA0000");
            };
        }
        cur.onclick = function(){Adding_to_chain(cur);};
        dots_in_chain.pop();
        game_params.removeChild(chain.pop());
    }
    if (dot != dots[finish_coordinates]){
        unfinushedChain();
    }
    lDot = dot;
}


create_vertical_lines();
create_horizontal_lines();
create_dots();
let start_coordinates = game_params.start[0] * game_params.cntX + game_params.start[1];
let finish_coordinates = game_params.finish[0] * game_params.cntX + game_params.finish[1];
recolour(dots[finish_coordinates], "orange");
dots[finish_coordinates].onmouseenter = function(){
    if (Distance(lDot, dots[finish_coordinates]) != game_params.dist){
        return;
    }
    Recoloring(dots[finish_coordinates], "purple");
};
dots[finish_coordinates].onmouseleave = function(){
    if (Distance(lDot, dots[finish_coordinates]) != game_params.dist){
        return;
    }
    recolour(dots[finish_coordinates], "#AA0000");
};
let lDot = undefined;
Adding_to_chain(dots[start_coordinates]);