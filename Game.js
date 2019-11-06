async function create_game(game_params){
    finish = false
    let linesX = [];  //Список вертикальных соединительных линий
    let linesY = [];  //Список горизонтальных соединительных линий
    let dots = [];    //Список всех точек, кроме TODO:???
    let edges_in_chain = []; //Рёбра цепи, которую сделал пользователь
    let dots_in_chain = []; //Точки цепи, которую сделал пользователь

    game_params.sizeX = (game_params.cntX - 1) * game_params.divX; //Горизонтальный размер "таблицы" (без учёта ширины точек)
    game_params.sizeY = (game_params.cntY - 1) * game_params.divY; //Вертикальный размер "таблицы" (без учёта высоты точек)

    let Game = doc.getElementById("Game"); //Div игры, который уже описан в HTML страницы 
    console.log((game_params.sizeY + game_params.posY + 20)); //TODO: WTF?
    let sup = (game_params.sizeY + game_params.posY + 20);    //TODO: WTF??
    game_params.posX = (sup - game_params.sizeX) / 2; //TODO: WTF???
    Game.style.paddingLeft = Game.style.paddingRight = ((game_params.sizeX + game_params.posX + 20) / 2);
    Game.style.paddingTop = Game.style.paddingBottom = ((game_params.sizeY + game_params.posY + 20) / 2);   //TODO: WTF????
    Game.style.width = 0;
    Game.style.height = 0;

    function to_integer(s /*Строка*/){ //Косорукое преобразование строки в целое
        let ans = "";
        for (let i = 0; i < s.length; i++){
            if ("0123456789.".lastIndexOf(s[i]) != -1){
                ans += s[i];
            }
        }
        return Number(ans);
    }

    function init_styles(obj /*Любой объект HTML*/){ //Перезаносит все правила стилей в объект
        let style = window.getComputedStyle(obj);

        for (i in style){
            if (style[i] != ""){
                obj.style[i] = style[i];
            }
        }
    }

    function rotate(obj /*Любой объект HTML*/, deg /*Угол в градусах, твою мать*/){  //Поворот объекта с помощью CSS
        obj.style.webkitTransform = 'rotate(' + deg + 'deg)'; // Chrome
        obj.style.mozTransform = 'rotate(' + deg + 'deg)'; // Mozilla
        obj.style.msTransform = 'rotate(' + deg + 'deg)'; // Explorer
        obj.style.oTransform = 'rotate(' + deg + 'deg)'; // Opera
        obj.style.transform = 'rotate(' + deg + 'deg)'; // Просто для всего
    }

    function recolour(obj /*Любой объект HTML*/, colour /*Цвет в виде строки*/){ //Перекрасить объект в данный цвет
        obj.style.backgroundColor = colour;
    }

    function position_by_index(index /*Список из координат по сетке*/){    //Позиция точки по индексам
        res = {x : 0, y : 0};
        res.x = game_params.posX + game_params.divX * index.x;
        res.y = game_params.posY + game_params.divY * index.y;
        return res;
    }

    function distance(dot1 /*Точка-объект*/, dot2 /*Точка-объект*/){  //Норма между двумя точками
        dx = dot1.coordinates.x - dot2.coordinates.x;
        dy = dot1.coordinates.y - dot2.coordinates.y;
        return dx ** 2 + dy ** 2;
    }

    function index_to_number(index){
        return index.y * game_params.cntX + index.x;
    }

    function get_point_by_index(index){
        return dots[index_to_number(index)];
    }

    function create_vertical_lines(){   //Делает вертикальные прямые
        for (let i = 0; i < game_params.cntX; i += 1){
            let new_line = doc.createElement('div');
            linesX.push(new_line);
            new_line.id = "lineX" + i;
            
            Game.appendChild(new_line);
            new_line.className = "grid";
            init_styles(new_line);

            new_line.style.top = game_params.posY - game_params.lineWidth / 2;
            new_line.style.left = game_params.posX + i * game_params.divX - game_params.lineWidth / 2;
            new_line.style.height = game_params.sizeY;
            new_line.style.width = game_params.lineWidth;
        }
    }

    function create_horizontal_lines(){ //Делает горизонтальные прямые
        for (let i = 0; i < game_params.cntY; i += 1){
            let new_line = doc.createElement('div');
            linesY.push(new_line);
            new_line.id = "lineY" + i;

            Game.appendChild(new_line);
            new_line.className = "grid";
            init_styles(new_line);

            new_line.style.top = game_params.posY + i * game_params.divY - game_params.lineWidth / 2;
            new_line.style.left = game_params.posX - game_params.lineWidth / 2;
            new_line.style.width = game_params.sizeX;
            new_line.style.height = game_params.lineWidth;
        }
    }

    function create_new_dot(index /*Список из координат по сетке*/){   //Делает новую точку в заданных координатах
        pos = position_by_index(index);
        new_dot = doc.createElement("div");
        dots.push(new_dot);
        new_dot.coordinates = index;
        new_dot.id = "dot" + index_to_number(index);
        Game.appendChild(new_dot);

        new_dot.className = "dot";
        init_styles(new_dot);

        new_dot.style.top = pos.y - to_integer(new_dot.style.height) / 2;
        new_dot.style.left = pos.x - to_integer(new_dot.style.width) / 2;

        new_dot.onclick = function(){
            if (last_dot != finish_point){
                add_to_chain(this);
            }
        }
        new_dot.onmouseenter = function(){
            if (distance(last_dot, this) == game_params.dist && last_dot != finish_point){
                recolour(this, "blue");
            }
        };
        new_dot.onmouseleave = function(){
            if (distance(last_dot, this) == game_params.dist && last_dot != finish_point){
                recolour(this, "black");
            }
        };
    }

    function create_dots(){ //Делает все необходимые точки
        for (let j = 0; j < game_params.cntY; j += 1){
            for (let i = 0; i < game_params.cntX; i += 1){
                create_new_dot({x: i, y: j});
            }
        }
    }

    function is_intersected(dotA /*Точка-объект*/,
                            dotB /*Точка-объект*/,
                            dotC /*Точка-объект*/,
                            dotD /*Точка-объект*/){    //Проверка отрезков AB и CD на пересечение 
        function det(vec1, vec2){
            return vec1.x * vec2.y -
                vec2.x * vec1.y;
        };
        function diff(dot1, dot2){
            let x1 = dot1.coordinates.x;
            let y1 = dot1.coordinates.y;
            let x2 = dot2.coordinates.x;
            let y2 = dot2.coordinates.y;
            return {x : x2 - x1, y : y2 - y1};
        }

        let ans = true;

        let v1 = diff(dotA, dotC);
        let v2 = diff(dotA, dotB);
        let v3 = diff(dotA, dotD);
        ans = ans && (det(v1, v2) * det(v2, v3) > 0);

        v1 = diff(dotC, dotA);
        v2 = diff(dotC, dotD);
        v3 = diff(dotC, dotB);
        ans = ans && (det(v1, v2) * det(v2, v3) > 0);
        return ans; //Недобаг: точки могут (нет) лежать на одной прямой
    }

    function create_edge(dot1 /*Точка-объект*/,
                        dot2 /*Точка-объект*/){  //Генерит следующее звено цепи, если можно, и возвращает, можно ли
        if (!dot1){ //Проверка на undefined
            return false;
        }

        for (let i = 0; i + 1 < dots_in_chain.length; i++){
            if (is_intersected(dots_in_chain[i], dots_in_chain[i + 1], dot1, dot2)){
                return false;
            }
        }

        if (distance(dot1, dot2) != game_params.dist){
            return false;
        }

        new_edge = doc.createElement("div");
        edges_in_chain.push(new_edge);
        Game.appendChild(new_edge);
        new_edge.className = "edge";
        init_styles(new_edge);
        new_edge.style.height = game_params.edgeWidth + "px";
        new_edge.id = "edge" + edges_in_chain.length;
        
        let a = (dot2.coordinates.x - dot1.coordinates.x) * game_params.divX;
        let b = (dot2.coordinates.y - dot1.coordinates.y) * game_params.divY;
        let c = Math.sqrt((a ** 2) + (b ** 2));
        let sinus = b / c; 
        let cosinus = a / c;

        new_edge.style.width = c;
        new_edge.style.top = to_integer(dot1.style.top) + to_integer(dot1.style.height) / 2;
        new_edge.style.left = to_integer(dot1.style.left) + to_integer(dot1.style.height) / 2;

        let deg = Math.atan2(sinus, cosinus) * (180 / Math.PI);
        rotate(new_edge, deg);
        return true;
    }

    function add_to_chain(dot){
        if (last_dot != undefined && !create_edge(last_dot, dot)){
            return;
        }

        dots_in_chain.push(dot);
        if (dot != finish_point){
            dot.style.backgroundColor = "black";
        }else{
            dot.style.backgroundColor = "red";
        }
        dot.onmouseenter = function(){};
        dot.onmouseleave = function(){};
        dot.onclick = function(){reduce_chain_up_to(dot)};
        last_dot = dot;
        if (dot == finish_point){
            chain_finished();
        }
    }

    function chain_finished(){
        finish = true
        console.log("Your result : " + edges_in_chain.length + "pts");
    }

    function chain_unfinished(){
        finish = 0;
    }

    function reduce_chain_up_to(dot){
        while (dots_in_chain[dots_in_chain.length - 1] != dot){
            let cur_dot = dots_in_chain[dots_in_chain.length - 1];
            if (cur_dot != finish_point){
                recolour(cur_dot, "black");
                cur_dot.onmouseenter = function(){
                    if (distance(last_dot, this) == game_params.dist && last_dot != finish_point){
                        recolour(this, "blue");
                    }
                };
                cur_dot.onmouseleave = function(){
                    if (distance(last_dot, this) == game_params.dist){
                        recolour(this, "black");
                    }
                };
            }else{
                recolour(finish_point, "red");
                finish_point.onmouseenter = function(){
                    if (distance(last_dot, finish_point) != game_params.dist && last_dot != finish_point){
                        recolour(finish_point, "purple");
                    }
                };
                finish_point.onmouseleave = function(){
                    if (distance(last_dot, finish_point) != game_params.dist && last_dot != finish_point){
                        recolour(finish_point, "red");
                    }
                };
            }
            cur_dot.onclick = function(){
                if (last_dot != finish_point){
                    add_to_chain(cur_dot);
                }
            }
            dots_in_chain.pop();
            Game.removeChild(edges_in_chain.pop());
        }
        if (dot != finish_point){
            chain_unfinished();
        }
        last_dot = dot;
    }


    create_vertical_lines();
    create_horizontal_lines();
    create_dots();

    let start_point = dots[index_to_number(game_params.start)];
    let finish_point = dots[index_to_number(game_params.finish)];

    recolour(finish_point, "red");
    finish_point.onmouseenter = function(){
        if (distance(last_dot, finish_point) != game_params.dist && last_dot != finish_point){
        recolour(finish_point, "purple");
        }
    };
    finish_point.onmouseleave = function(){
        if (distance(last_dot, finish_point) != game_params.dist && last_dot != finish_point){
        recolour(finish_point, "red");
        }
    };

    start_point.style.backgroundColor = "green";
    start_point.onmouseenter = function(){};
    start_point.onmouseleave = function(){};
    start_point.onclick = function(){reduce_chain_up_to(start_point)};

    let last_dot = start_point;
    dots_in_chain.push(start_point);


    // Функция для кнопочки
    function notWork() {
        if (!finish) {
            alert("This button doesn't work. You can simply play our game.")
        }else{
            score = edges_in_chain.length;
            alert("This button doesn't work. Your score: " + score);
        }
    }

    document.getElementById("sec2button").addEventListener("click", notWork);



    // Работа с JSON-файлом
    async function getJSON(name){
        let response = await fetch(name);
        let data = await response.json();
        return data;
    }

    async function sendJSON(obj){
        let response = await fetch('/table.json', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
            });
    }   

    let resp = await fetch("Leaderboard.json");
    let data = await resp.json();
    console.log(data);

    document.getElementById("1player").innerHTML(data.data[0])
}